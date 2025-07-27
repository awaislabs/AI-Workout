import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { workoutProgramSchema } from "@/lib/schemas"
import { neon } from "@neondatabase/serverless"
import type { WorkoutProgram } from "@/lib/schemas"

// Use the provided DATABASE_URL from the environment
const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), { status: 400 })
    }

    // Generate structured object using AI SDK
    const { object: workoutProgram } = await generateObject({
      model: openai("gpt-4o"), // Using gpt-4o as requested
      schema: workoutProgramSchema,
      prompt: `Generate a detailed workout program based on the following request: "${prompt}". Ensure the program adheres strictly to the provided JSON schema. The program should be comprehensive, including programName, programDescription, and a 'weeks' array, where each week contains 'days', and each day contains 'exercises'. Each exercise should have 'circuit', 'exerciseName', 'sets', 'reps', 'rest', and 'notes'. If the user asks for a specific number of weeks, generate that many. Otherwise, generate a reasonable number of weeks (e.g., 4).`,
    })

    // Save to PostgreSQL
    const savedProgram = await saveWorkoutProgram(workoutProgram)

    return new Response(JSON.stringify(savedProgram), { status: 200 })
  } catch (error: any) {
    console.error("Error generating or saving workout:", error)
    return new Response(JSON.stringify({ error: error.message || "Failed to generate workout program" }), {
      status: 500,
    })
  }
}

async function saveWorkoutProgram(program: WorkoutProgram): Promise<WorkoutProgram> {
  const { programName, programDescription, weeks } = program

  const result = await sql`
    INSERT INTO workout_programs (program_name, program_description)
    VALUES (${programName}, ${programDescription})
    RETURNING id, program_name, program_description;
  `
  const programId = result[0].id

  for (const weekData of weeks) {
    const weekResult = await sql`
      INSERT INTO weeks (program_id, week_number)
      VALUES (${programId}, ${weekData.week})
      RETURNING id, week_number;
    `
    const weekId = weekResult[0].id

    for (const dayData of weekData.days) {
      const dayResult = await sql`
        INSERT INTO days (week_id, day_number, title)
        VALUES (${weekId}, ${dayData.day}, ${dayData.title})
        RETURNING id, day_number, title;
      `
      const dayId = dayResult[0].id

      for (const exerciseData of dayData.exercises) {
        await sql`
          INSERT INTO exercises (day_id, circuit, exercise_name, sets, reps, rest, notes)
          VALUES (
            ${dayId},
            ${exerciseData.circuit},
            ${exerciseData.exerciseName},
            ${exerciseData.sets},
            ${exerciseData.reps},
            ${exerciseData.rest},
            ${exerciseData.notes}
          );
        `
      }
    }
  }

  // Re-fetch the saved program to ensure consistency and return the full structure
  const savedProgram = await getWorkoutProgramById(programId)
  if (!savedProgram) {
    throw new Error("Failed to retrieve saved workout program.")
  }
  return savedProgram
}

async function getWorkoutProgramById(programId: string): Promise<WorkoutProgram | null> {
  const programRows = await sql`
    SELECT id, program_name, program_description
    FROM workout_programs
    WHERE id = ${programId};
  `

  if (programRows.length === 0) return null

  const program = programRows[0]

  const weekRows = await sql`
    SELECT id, week_number
    FROM weeks
    WHERE program_id = ${program.id}
    ORDER BY week_number;
  `

  const weeks: WorkoutProgram["weeks"] = []
  for (const week of weekRows) {
    const dayRows = await sql`
      SELECT id, day_number, title
      FROM days
      WHERE week_id = ${week.id}
      ORDER BY day_number;
    `

    const days: WorkoutProgram["weeks"][0]["days"] = []
    for (const day of dayRows) {
      const exerciseRows = await sql`
        SELECT id, circuit, exercise_name, sets, reps, rest, notes
        FROM exercises
        WHERE day_id = ${day.id};
      `
      days.push({
        day: day.day_number,
        title: day.title,
        exercises: exerciseRows.map((ex) => ({
          // Include the ID for exercises for potential future use (e.g., deletion)
          id: ex.id,
          circuit: ex.circuit,
          exerciseName: ex.exercise_name,
          sets: ex.sets,
          reps: ex.reps,
          rest: ex.rest,
          notes: ex.notes,
        })),
      })
    }
    weeks.push({
      week: week.week_number,
      days: days,
    })
  }

  return {
    programName: program.program_name,
    programDescription: program.program_description,
    weeks: weeks,
  }
}

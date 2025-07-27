import { neon } from "@neondatabase/serverless"
import type { WorkoutProgram } from "@/lib/schemas"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const programRows = await sql`
      SELECT id, program_name, program_description
      FROM workout_programs
      ORDER BY id DESC;
    `

    const workoutPrograms: WorkoutProgram[] = []

    for (const program of programRows) {
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
              id: ex.id, // Include ID for exercises
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
      workoutPrograms.push({
        programName: program.program_name,
        programDescription: program.program_description,
        weeks: weeks,
      })
    }

    return new Response(JSON.stringify(workoutPrograms), { status: 200 })
  } catch (error: any) {
    console.error("Error fetching workout programs:", error)
    return new Response(JSON.stringify({ error: error.message || "Failed to fetch workout programs" }), { status: 500 })
  }
}

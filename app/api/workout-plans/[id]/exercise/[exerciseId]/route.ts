import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function DELETE(req: Request, { params }: { params: { id: string; exerciseId: string } }) {
  try {
    const { id: programId, exerciseId } = params

    // First, find the exercise to get its day_id
    const exerciseRows = await sql`
      SELECT id, day_id FROM exercises WHERE id = ${exerciseId};
    `

    if (exerciseRows.length === 0) {
      return new Response(JSON.stringify({ error: "Exercise not found" }), { status: 404 })
    }

    const dayId = exerciseRows[0].day_id

    // Delete the exercise
    await sql`
      DELETE FROM exercises WHERE id = ${exerciseId};
    `

    // Check if the day is now empty, and if so, delete the day
    const remainingExercises = await sql`
      SELECT COUNT(*) FROM exercises WHERE day_id = ${dayId};
    `

    if (Number.parseInt(remainingExercises[0].count) === 0) {
      const dayRows = await sql`
        SELECT id, week_id FROM days WHERE id = ${dayId};
      `
      if (dayRows.length > 0) {
        const weekId = dayRows[0].week_id
        await sql`
          DELETE FROM days WHERE id = ${dayId};
        `

        // Check if the week is now empty, and if so, delete the week
        const remainingDays = await sql`
          SELECT COUNT(*) FROM days WHERE week_id = ${weekId};
        `
        if (Number.parseInt(remainingDays[0].count) === 0) {
          const weekRows = await sql`
            SELECT id, program_id FROM weeks WHERE id = ${weekId};
          `
          if (weekRows.length > 0) {
            const programIdFromWeek = weekRows[0].program_id
            await sql`
              DELETE FROM weeks WHERE id = ${weekId};
            `

            // Check if the program is now empty, and if so, delete the program
            const remainingWeeks = await sql`
              SELECT COUNT(*) FROM weeks WHERE program_id = ${programIdFromWeek};
            `
            if (Number.parseInt(remainingWeeks[0].count) === 0) {
              await sql`
                DELETE FROM workout_programs WHERE id = ${programIdFromWeek};
              `
            }
          }
        }
      }
    }

    return new Response(JSON.stringify({ message: "Exercise deleted successfully" }), { status: 200 })
  } catch (error: any) {
    console.error("Error deleting exercise:", error)
    return new Response(JSON.stringify({ error: error.message || "Failed to delete exercise" }), { status: 500 })
  }
}

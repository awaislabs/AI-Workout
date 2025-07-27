import type { WorkoutProgram } from "@/lib/schemas"

export const sampleWorkoutPrograms: WorkoutProgram[] = [
  {
    id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    programName: "",
    programDescription:
      "",
    weeks: [
      {
        id: "w1a1b2c3-d4e5-6789-0123-456789abcdef",
        week: 1,
        days: [
          {
            id: "d1a1b2c3-d4e5-6789-0123-456789abcdef",
            day: 1,
            title: "Upper Body",
            exercises: [
              {
                id: "e1a1b2c3-d4e5-6789-0123-456789abcdef",
                circuit: "A",
                exerciseName: "Barbell Bench Press",
                sets: 3,
                reps: "12, 10, 8",
                rest: "90s",
                notes: "1-3-1 tempo",
              },
              {
                id: "e2a1b2c3-d4e5-6789-0123-456789abcdef",
                circuit: "A",
                exerciseName: "Bent-Over Rows",
                sets: 3,
                reps: "10-12",
                rest: "90s",
                notes: "Focus on squeeze",
              },
              {
                id: "e3a1b2c3-d4e5-6789-0123-456789abcdef",
                circuit: "B",
                exerciseName: "Overhead Press",
                sets: 3,
                reps: "8-10",
                rest: "60s",
                notes: "Strict form",
              },
              {
                id: "e4a1b2c3-d4e5-6789-0123-456789abcdef",
                circuit: "B",
                exerciseName: "Pull-ups",
                sets: 3,
                reps: "AMRAP",
                rest: "60s",
                notes: "Assisted if needed",
              },
            ],
          },
          {
            id: "d2a1b2c3-d4e5-6789-0123-456789abcdef",
            day: 2,
            title: "Lower Body",
            exercises: [
              {
                id: "e5a1b2c3-d4e5-6789-0123-456789abcdef",
                circuit: "A",
                exerciseName: "Barbell Squats",
                sets: 4,
                reps: "8-10",
                rest: "120s",
                notes: "Deep as possible",
              },
              {
                id: "e6a1b2c3-d4e5-6789-0123-456789abcdef",
                circuit: "A",
                exerciseName: "Romanian Deadlifts",
                sets: 3,
                reps: "10-12",
                rest: "90s",
                notes: "Hamstring focus",
              },
              {
                id: "e7a1b2c3-d4e5-6789-0123-456789abcdef",
                circuit: "B",
                exerciseName: "Leg Press",
                sets: 3,
                reps: "12-15",
                rest: "60s",
                notes: "Controlled movement",
              },
            ],
          },
          {
            id: "d3a1b2c3-d4e5-6789-0123-456789abcdef",
            day: 3,
            title: "Rest",
            exercises: [],
          },
        ],
      },
      {
        id: "w2a1b2c3-d4e5-6789-0123-456789abcdef",
        week: 2,
        days: [
          {
            id: "d4a1b2c3-d4e5-6789-0123-456789abcdef",
            day: 4,
            title: "Full Body",
            exercises: [
              {
                id: "e8a1b2c3-d4e5-6789-0123-456789abcdef",
                circuit: "A",
                exerciseName: "Deadlifts",
                sets: 3,
                reps: "5-8",
                rest: "180s",
                notes: "Heavy lift",
              },
              {
                id: "e9a1b2c3-d4e5-6789-0123-456789abcdef",
                circuit: "A",
                exerciseName: "Incline Dumbbell Press",
                sets: 3,
                reps: "10-12",
                rest: "90s",
                notes: "Upper chest focus",
              },
            ],
          },
        ],
      },
    ],
  },
]

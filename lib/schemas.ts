import { z } from "zod"

// Define the Zod schema for a single exercise
export const exerciseSchema = z.object({
  // Added 'id' as optional for AI generation, but expected when fetched from DB
  id: z.string().uuid().optional(),
  circuit: z.string().max(100),
  exerciseName: z.string().max(255),
  sets: z.number().int().positive(),
  reps: z.string().max(100), // e.g., "12, 10, 8" or "8-12"
  rest: z.string().max(100), // e.g., "90s" or "60-90s"
  notes: z.string().max(500).optional(),
})

// Define the Zod schema for a single day
export const daySchema = z.object({
  id: z.string().uuid().optional(), // Added 'id'
  day: z.number().int().positive(),
  title: z.string().max(255),
  exercises: z.array(exerciseSchema),
})

// Define the Zod schema for a single week
export const weekSchema = z.object({
  id: z.string().uuid().optional(), // Added 'id'
  week: z.number().int().positive(),
  days: z.array(daySchema),
})

// Define the Zod schema for the entire workout program
export const workoutProgramSchema = z.object({
  id: z.string().uuid().optional(), // Added 'id'
  programName: z.string().max(255),
  programDescription: z.string().max(1000),
  weeks: z.array(weekSchema),
})

// Export TypeScript types derived from the schemas
export type Exercise = z.infer<typeof exerciseSchema>
export type Day = z.infer<typeof daySchema>
export type Week = z.infer<typeof weekSchema>
export type WorkoutProgram = z.infer<typeof workoutProgramSchema>

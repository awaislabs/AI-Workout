import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { WorkoutProgram } from "@/lib/schemas"

interface WorkoutState {
  workoutPrograms: WorkoutProgram[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: WorkoutState = {
  workoutPrograms: [],
  status: "idle",
  error: null,
}

// Async Thunk for generating a workout
export const generateWorkout = createAsyncThunk(
  "workouts/generateWorkout",
  async (prompt: string, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/generate-workout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate workout")
      }

      const data: WorkoutProgram = await response.json()
      return data
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  },
)

// Async Thunk for fetching all workouts
export const fetchWorkouts = createAsyncThunk("workouts/fetchWorkouts", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/workout-plans")
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to fetch workouts")
    }
    const data: WorkoutProgram[] = await response.json()
    return data
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
})

// Async Thunk for deleting an exercise
export const deleteExercise = createAsyncThunk(
  "workouts/deleteExercise",
  async ({ programId, exerciseId }: { programId: string; exerciseId: string }, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(`/api/workout-plans/${programId}/exercise/${exerciseId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete exercise")
      }

      // After successful deletion, re-fetch workouts to update the state
      dispatch(fetchWorkouts())
      return exerciseId // Return the ID of the deleted exercise
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  },
)

const workoutSlice = createSlice({
  name: "workouts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(generateWorkout.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(generateWorkout.fulfilled, (state, action: PayloadAction<WorkoutProgram>) => {
        state.status = "succeeded"
        // Add the new workout program to the beginning of the array
        state.workoutPrograms = [action.payload, ...state.workoutPrograms]
      })
      .addCase(generateWorkout.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })
      .addCase(fetchWorkouts.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchWorkouts.fulfilled, (state, action: PayloadAction<WorkoutProgram[]>) => {
        state.status = "succeeded"
        state.workoutPrograms = action.payload
      })
      .addCase(fetchWorkouts.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })
      .addCase(deleteExercise.pending, (state) => {
        state.status = "loading" // Or a more specific status like 'deleting'
        state.error = null
      })
      .addCase(deleteExercise.fulfilled, (state, action) => {
        state.status = "succeeded"
        // The state will be updated by the fetchWorkouts call dispatched within the thunk
      })
      .addCase(deleteExercise.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })
  },
})

export default workoutSlice.reducer

"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import { generateWorkout, fetchWorkouts } from "@/store/workoutSlice";
import { WorkoutDisplay } from "@/components/workout-display";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { sampleWorkoutPrograms } from "@/sample-data/workout-program";
import { ChatInterface } from "@/components/chat-interface";
import Image from "next/image"

export default function Home() {
  const dispatch: AppDispatch = useDispatch();
  const { workoutPrograms, status, error } = useSelector(
    (state: RootState) => state.workouts
  );
  const [showWorkoutDisplay, setShowWorkoutDisplay] = useState(false);

  useEffect(() => {
    dispatch(fetchWorkouts());
  }, [dispatch]);

  useEffect(() => {
    if (workoutPrograms.length > 0 && status === "succeeded") {
      setShowWorkoutDisplay(true);
    }
  }, [workoutPrograms, status]);

  const handleGenerate = async (prompt: string) => {
    await dispatch(generateWorkout(prompt));
  };

  const handleBackToChat = () => {
    setShowWorkoutDisplay(false);
  };

  return (
    <>
      <div className="p-4 flex justify-center items-center space-x-2">
        <Image
          src="/image/Icon.png" // path relative to /public
          alt="Maxed Logo"
          width={90}
          height={24}
        />
      </div>
      <main className="min-h-screen w-full flex items-center justify-center  sm:p-6 md:p-2 bg-gray-100">
        <div className="relative w-full max-w-6xl flex flex-col bg-gray-100 rounded-xl  overflow-hidden flex-grow">
          {status === "loading" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 z-50">
              <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
              <p className="mt-4 text-lg text-gray-700 text-center">
                Generating your workout plan...
              </p>
            </div>
          )}

          {showWorkoutDisplay && workoutPrograms.length > 0 ? (
          <div className="w-full flex flex-col flex-grow">
            <div className="p-6 flex justify-between items-center border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">Maxed?</h1>
            <Button onClick={handleBackToChat} variant="outline">
              New Plan
            </Button>
          </div>
            <div className="flex-grow overflow-auto p-0 sm:p-2">
              <WorkoutDisplay workoutProgram={workoutPrograms[0]} />
              
            </div>
          </div>
           ) : (
          <ChatInterface onGenerate={handleGenerate} />
        )} 

          {error && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-500 text-white p-3 rounded-lg shadow-lg text-sm max-w-sm text-center">
              Error: {error}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

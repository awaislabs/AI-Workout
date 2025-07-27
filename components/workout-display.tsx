"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { WorkoutProgram } from "@/lib/schemas";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { deleteExercise } from "@/store/workoutSlice";

interface WorkoutDisplayProps {
  workoutProgram: WorkoutProgram;
}

export function WorkoutDisplay({ workoutProgram }: WorkoutDisplayProps) {
  const dispatch: AppDispatch = useDispatch();
  const [activeWeek, setActiveWeek] = useState(
    `week-${workoutProgram.weeks[0]?.week || 1}`
  );

  const handleDeleteExercise = (programId: string, exerciseId: string) => {
    if (programId && exerciseId) {
      dispatch(deleteExercise({ programId, exerciseId }));
    } else {
      console.warn("Cannot delete exercise: Missing programId or exerciseId.");
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {workoutProgram.programName}
        </h2>
        <p className="text-gray-600">{workoutProgram.programDescription}</p>
      </div>

      <Tabs value={activeWeek} onValueChange={setActiveWeek} className="w-full">
        <TabsList className="flex justify-start w-full gap-2 rounded-lg p-1 mb-6 overflow-hidden">
          {workoutProgram.weeks.map((week) => (
            <TabsTrigger
              key={`week-${week.week}`}
              value={`week-${week.week}`}
              className="flex-shrink-0 rounded-md px-4 py-2 text-gray-700 font-medium transition-colors data-[state=active]:bg-[#6367ef] data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              Week {week.week}
            </TabsTrigger>
          ))}
        </TabsList>

        {workoutProgram.weeks.map((week) => (
          <TabsContent
            key={`week-${week.week}-content`}
            value={`week-${week.week}`}
            className="mt-0"
          >
            <div className="space-y-8">
              {week.days.map((day) => (
                <Card
                  key={`day-${day.day}`}
                  className="shadow-sm rounded-xl "
                >
                  <div
                    className={`px-6 py-4 rounded-lg  ${
                      day.title.toLowerCase().includes("rest")
                        ? "bg-[#e2e2e2] text-black"
                        : "bg-[#cbcdeb] text-black"
                    }`}
                  >
                    <h3 className="text-lg font-[500]">
                      Day {day.day} - {day.title}
                    </h3>
                  </div>

                  <CardContent className="pt-2  space-y-1">
                    {/* Styled Header Row (desktop only) */}
                    <div className="hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_2fr_0.5fr] gap-x-4 bg-[#f9fafb] pt-5 pb-5 pr-4 pl-4 rounded-lg shadow-sm border border-gray-200 text-sm font-[400] text-black">
                      <div>Circuits</div>
                      <div>Exercise</div>
                      <div>Sets</div>
                      <div>Reps</div>
                      <div>Notes</div>
                      <div></div>
                    </div>

                    {day.exercises.map((exercise, index) => (
                      <div
                        key={exercise.id || `${day.day}-${index}`}
                        className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr_1fr_2fr_0.5fr] gap-x-4 gap-y-3 items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
                      >
                        <div className="font-[400] text-black">
                          {exercise.circuit}
                        </div>
                        <div className="font-[400] text-black ">
                          {exercise.exerciseName}
                        </div>
                        <div className="font-[400] text-black">
                          {exercise.sets}
                        </div>
                        <div className="font-[400] text-black text-sm">
                          {exercise.reps}
                        </div>
                        <div className="text-sm italic text-black">
                          {exercise.notes || "AI generated workout notes"}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-red-500"
                            onClick={() =>
                              workoutProgram.id && exercise.id
                                ? handleDeleteExercise(
                                    workoutProgram.id,
                                    exercise.id
                                  )
                                : console.warn(
                                    "Missing program ID or exercise ID for deletion."
                                  )
                            }
                            disabled={!workoutProgram.id || !exercise.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-gray-700"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-gray-700"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

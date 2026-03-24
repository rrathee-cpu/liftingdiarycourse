"use client";

import { useState } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { Calendar } from "@/components/ui/calendar";
import { buttonVariants } from "@/lib/button-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WorkoutWithDetails } from "@/data/workouts";

interface Props {
  workouts: WorkoutWithDetails[];
}

export default function DashboardClient({ workouts }: Props) {
  const [date, setDate] = useState<Date>(new Date());

  const workoutsForDate = workouts.filter((w) => {
    const workoutDate = w.startedAt ?? w.createdAt;
    return format(workoutDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
  });

  return (
    <div className="flex gap-6 items-start">
      <Card className="shrink-0 p-2">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => d && setDate(d)}
        />
      </Card>

      <section className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            Workouts on {format(date, "do MMM yyyy")}
          </h2>
          <Link
            href={`/workouts/new?date=${format(date, "yyyy-MM-dd")}`}
            className={buttonVariants()}
          >
            Log New Workout
          </Link>
        </div>

        {workoutsForDate.length === 0 ? (
          <Card className="p-6">
            <p className="text-muted-foreground text-sm text-center">
              No workouts logged for this date.
            </p>
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {workoutsForDate.map((workout) => (
              <Card key={workout.id}>
                <CardHeader>
                  <CardTitle>{workout.name ?? "Untitled Workout"}</CardTitle>
                  {workout.startedAt && workout.completedAt && (
                    <p className="text-sm text-muted-foreground">
                      {format(workout.startedAt, "h:mm a")} –{" "}
                      {format(workout.completedAt, "h:mm a")}
                    </p>
                  )}
                </CardHeader>

                {workout.exercises.length > 0 && (
                  <CardContent>
                    <div className="flex flex-col gap-4">
                      {workout.exercises.map((exercise) => (
                        <div key={exercise.workoutExerciseId}>
                          <p className="text-sm font-semibold mb-2">
                            {exercise.exerciseName}
                          </p>

                          {exercise.sets.length > 0 ? (
                            <table className="w-full text-sm text-muted-foreground">
                              <thead>
                                <tr className="text-left border-b border-border">
                                  <th className="pb-1 font-medium">Set</th>
                                  <th className="pb-1 font-medium">Reps</th>
                                  <th className="pb-1 font-medium">Weight</th>
                                </tr>
                              </thead>
                              <tbody>
                                {exercise.sets.map((set) => (
                                  <tr key={set.id} className="border-b border-border/50 last:border-0">
                                    <td className="py-1">{set.setNumber}</td>
                                    <td className="py-1">{set.reps ?? "—"}</td>
                                    <td className="py-1">
                                      {set.weight ? `${set.weight} kg` : "—"}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <p className="text-sm text-muted-foreground">No sets recorded.</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

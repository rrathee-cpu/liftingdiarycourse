"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";
import { Calendar } from "@/components/ui/calendar";
import { buttonVariants } from "@/lib/button-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WorkoutWithDetails } from "@/data/workouts";

interface Props {
  workouts: WorkoutWithDetails[];
  selectedDate: Date;
}

export default function DashboardClient({ workouts, selectedDate }: Props) {
  const router = useRouter();

  function handleDateSelect(d: Date | undefined) {
    if (!d) return;
    router.push(`/dashboard?date=${format(d, "yyyy-MM-dd")}`);
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div className="flex flex-col md:flex-row gap-8 items-start justify-center w-full max-w-4xl">
        {/* Calendar */}
        <div className="flex flex-col items-center gap-3 shrink-0">
          <h2 className="text-2xl font-semibold tracking-tight">Workout Dashboard</h2>
          <Card className="p-2">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
            />
          </Card>
        </div>

        {/* Workouts summary */}
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-semibold tracking-tight mb-5">
            Workouts for{" "}
            <span className="text-foreground">{format(selectedDate, "do MMM yyyy")}</span>
          </h2>

          {workouts.length === 0 ? (
            <Card className="p-6 flex flex-col items-center gap-4">
              <p className="text-muted-foreground text-sm text-center">
                No workouts logged for this date.
              </p>
              <Link
                href={`/workouts/new?date=${format(selectedDate, "yyyy-MM-dd")}`}
                className={buttonVariants()}
              >
                Log New Workout
              </Link>
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {workouts.map((workout) => {
                const exerciseCount = workout.exercises.length;
                const setCount = workout.exercises.reduce(
                  (sum, e) => sum + e.sets.length,
                  0
                );

                return (
                  <Card key={workout.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-semibold tracking-tight">
                        {workout.name ?? "Untitled Workout"}
                      </CardTitle>
                      {workout.startedAt && workout.completedAt && (
                        <p className="text-sm text-muted-foreground">
                          {format(workout.startedAt, "h:mm a")} –{" "}
                          {format(workout.completedAt, "h:mm a")}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-6 text-sm text-muted-foreground">
                        <span>
                          <span className="font-medium text-foreground">
                            {exerciseCount}
                          </span>{" "}
                          {exerciseCount === 1 ? "exercise" : "exercises"}
                        </span>
                        <span>
                          <span className="font-medium text-foreground">
                            {setCount}
                          </span>{" "}
                          {setCount === 1 ? "set" : "sets"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

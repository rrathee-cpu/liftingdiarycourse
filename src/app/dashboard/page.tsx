"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MOCK_WORKOUTS = [
  { id: 1, date: new Date(), name: "Push Day", exercises: 6 },
  { id: 2, date: new Date(), name: "Morning Cardio", exercises: 2 },
];

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());

  const workoutsForDate = MOCK_WORKOUTS.filter(
    (w) => format(w.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
  );

  return (
    <main className="min-h-screen bg-muted/30 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Workout Dashboard</h1>

        <div className="flex gap-6 items-start">
          <Card className="shrink-0 p-2">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => d && setDate(d)}
            />
          </Card>

          <section className="flex-1">
            <h2 className="text-xl font-semibold mb-4">
              Workouts on {format(date, "do MMM yyyy")}
            </h2>

            {workoutsForDate.length === 0 ? (
              <Card className="p-6">
                <p className="text-muted-foreground text-sm text-center">No workouts logged for this date.</p>
              </Card>
            ) : (
              <div className="flex flex-col gap-4">
                {workoutsForDate.map((workout) => (
                  <Card key={workout.id}>
                    <CardHeader>
                      <CardTitle>{workout.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{workout.exercises} exercises</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

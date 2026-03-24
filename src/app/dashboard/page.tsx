import { auth } from "@clerk/nextjs/server";
import { getWorkoutsForUserByDate } from "@/data/workouts";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { userId } = await auth();
  const { date: dateParam } = await searchParams;

  const date = dateParam
    ? new Date(`${dateParam}T00:00:00`)
    : new Date();

  const workouts = userId ? await getWorkoutsForUserByDate(userId, date) : [];

  return (
    <main className="min-h-screen bg-muted/30">
      <header className="px-8 py-5 bg-background">
        <span className="text-xl font-semibold tracking-tight text-foreground">Lifting Diary</span>
      </header>
      <div className="max-w-5xl mx-auto flex flex-col items-center p-8">
<DashboardClient workouts={workouts} selectedDate={date} />
      </div>
    </main>
  );
}

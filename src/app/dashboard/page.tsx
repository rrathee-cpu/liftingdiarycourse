import { auth } from "@clerk/nextjs/server";
import { getWorkoutsForUser } from "@/data/workouts";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
  const { userId } = await auth();

  const workouts = userId ? await getWorkoutsForUser(userId) : [];

  return (
    <main className="min-h-screen bg-muted/30 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Workout Dashboard</h1>
        <DashboardClient workouts={workouts} />
      </div>
    </main>
  );
}

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { format, parseISO, isValid } from "date-fns";
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/lib/button-variants";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ date?: string }>;
}

export default async function NewWorkoutPage({ searchParams }: Props) {
  const { date: dateParam } = await searchParams;

  const parsedDate =
    dateParam && isValid(parseISO(dateParam)) ? parseISO(dateParam) : new Date();

  async function createWorkout(formData: FormData) {
    "use server";

    const { userId } = await auth();
    if (!userId) redirect("/");

    const name = formData.get("name") as string;
    const dateValue = formData.get("date") as string;
    const startedAt = isValid(parseISO(dateValue)) ? parseISO(dateValue) : new Date();

    await db.insert(workouts).values({
      userId,
      name: name || null,
      startedAt,
    });

    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-muted/30 p-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold mb-8">Log New Workout</h1>

        <Card>
          <CardHeader>
            <CardTitle>{format(parsedDate, "do MMM yyyy")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createWorkout} className="flex flex-col gap-4">
              <input type="hidden" name="date" value={format(parsedDate, "yyyy-MM-dd")} />

              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-sm font-medium">
                  Workout Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g. Push Day"
                  className="h-8 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Link href="/dashboard" className={buttonVariants({ variant: "outline" })}>
                  Cancel
                </Link>
                <button
                  type="submit"
                  className={buttonVariants()}
                >
                  Save Workout
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

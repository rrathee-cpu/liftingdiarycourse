# Data Fetching Standards

## Server Components Only

All data fetching **must** be done exclusively in **React Server Components**.

- Do **NOT** fetch data in client components (components with `"use client"`)
- Do **NOT** fetch data in Route Handlers (`app/api/` routes)
- Do **NOT** use `useEffect` + `fetch` or any client-side data fetching pattern
- Do **NOT** use SWR, React Query, or any client-side fetching library

If a client component needs data, fetch it in a parent server component and pass it down as props.

## Data Helper Functions

All database queries **must** go through helper functions located in the `/data` directory.

- Do **NOT** write database queries inline inside components or pages
- Do **NOT** use raw SQL
- All `/data` helper functions **must** use [Drizzle ORM](https://orm.drizzle.team/) to query the database

### Example structure

```
src/
  data/
    workouts.ts     # e.g. getWorkouts(), getWorkoutById()
    exercises.ts    # e.g. getExercises()
```

### Example helper function

```ts
// src/data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getWorkoutsForUser(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

### Example usage in a server component

```tsx
// src/app/dashboard/page.tsx
import { getWorkoutsForUser } from "@/data/workouts";
import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();
  const workouts = await getWorkoutsForUser(session.user.id);

  return <WorkoutList workouts={workouts} />;
}
```

## Data Authorization

This is **critical**: a logged-in user must **only** be able to access their own data.

- Every `/data` helper function that returns user-specific data **must** accept a `userId` parameter and filter by it
- **Never** fetch all records and filter in application code — always filter at the query level
- Always retrieve the current user's ID from the authenticated session (e.g. `auth()`) in the server component, then pass it to the data helper
- **Never** trust a `userId` from URL params, query strings, or request bodies to scope data access — always use the session

### Wrong

```ts
// WRONG: fetches all workouts, no user scoping
export async function getWorkouts() {
  return db.select().from(workouts);
}
```

### Correct

```ts
// CORRECT: always scoped to the authenticated user
export async function getWorkoutsForUser(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

import { db } from "@/db";
import { workouts, workoutExercises, exercises, sets } from "@/db/schema";
import { and, eq, gte, lt } from "drizzle-orm";

export type SetDetail = {
  id: number;
  setNumber: number;
  reps: number | null;
  weight: string | null;
};

export type ExerciseDetail = {
  workoutExerciseId: number;
  order: number;
  exerciseName: string;
  sets: SetDetail[];
};

export type WorkoutWithDetails = {
  id: number;
  name: string | null;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  exercises: ExerciseDetail[];
};

type WorkoutRow = {
  workoutId: number;
  workoutName: string | null;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  workoutExerciseId: number | null;
  exerciseOrder: number | null;
  exerciseName: string | null;
  setId: number | null;
  setNumber: number | null;
  reps: number | null;
  weight: string | null;
};

function aggregateWorkoutRows(rows: WorkoutRow[]): WorkoutWithDetails[] {
  const workoutMap = new Map<number, WorkoutWithDetails>();

  for (const row of rows) {
    if (!workoutMap.has(row.workoutId)) {
      workoutMap.set(row.workoutId, {
        id: row.workoutId,
        name: row.workoutName,
        startedAt: row.startedAt,
        completedAt: row.completedAt,
        createdAt: row.createdAt,
        exercises: [],
      });
    }

    const workout = workoutMap.get(row.workoutId)!;

    if (row.workoutExerciseId == null || row.exerciseName == null) continue;

    let exercise = workout.exercises.find((e) => e.workoutExerciseId === row.workoutExerciseId);
    if (!exercise) {
      exercise = {
        workoutExerciseId: row.workoutExerciseId,
        order: row.exerciseOrder!,
        exerciseName: row.exerciseName,
        sets: [],
      };
      workout.exercises.push(exercise);
    }

    if (row.setId != null) {
      exercise.sets.push({
        id: row.setId,
        setNumber: row.setNumber!,
        reps: row.reps,
        weight: row.weight,
      });
    }
  }

  return Array.from(workoutMap.values());
}

export async function getWorkoutsForUserByDate(
  userId: string,
  date: Date
): Promise<WorkoutWithDetails[]> {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const rows = await db
    .select({
      workoutId: workouts.id,
      workoutName: workouts.name,
      startedAt: workouts.startedAt,
      completedAt: workouts.completedAt,
      createdAt: workouts.createdAt,
      workoutExerciseId: workoutExercises.id,
      exerciseOrder: workoutExercises.order,
      exerciseName: exercises.name,
      setId: sets.id,
      setNumber: sets.setNumber,
      reps: sets.reps,
      weight: sets.weight,
    })
    .from(workouts)
    .leftJoin(workoutExercises, eq(workoutExercises.workoutId, workouts.id))
    .leftJoin(exercises, eq(exercises.id, workoutExercises.exerciseId))
    .leftJoin(sets, eq(sets.workoutExerciseId, workoutExercises.id))
    .where(
      and(
        eq(workouts.userId, userId),
        gte(workouts.createdAt, start),
        lt(workouts.createdAt, end)
      )
    )
    .orderBy(workouts.id, workoutExercises.order, sets.setNumber);

  return aggregateWorkoutRows(rows);
}

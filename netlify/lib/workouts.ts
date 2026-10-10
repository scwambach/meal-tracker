import { z } from "zod";
import { collection, type Dated } from "./records.ts";

export const WORKOUT_TYPES = [
  "run",
  "walk",
  "hike",
  "cycle",
  "swim",
  "strength",
  "hiit",
  "yoga",
  "sports",
  "cardio",
  "other",
] as const;

export const WorkoutInputSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "time must be HH:MM")
    .optional(),
  type: z.enum(WORKOUT_TYPES),
  title: z.string().min(1),
  duration_min: z.number().positive().max(1440),
  intensity: z.enum(["light", "moderate", "hard"]).default("moderate"),
  calories_burned: z.number().nonnegative().max(10000),
  distance: z.string().optional(),
  confidence: z.enum(["low", "medium", "high"]).default("medium"),
  assumptions: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

export const WorkoutPatchSchema = WorkoutInputSchema.partial();

export type WorkoutInput = z.infer<typeof WorkoutInputSchema>;
export type Workout = WorkoutInput & Dated;

const workouts = collection<WorkoutInput, Workout>("workouts", (w) => ({
  ...w,
  calories_burned: Math.round(w.calories_burned),
}));

export const listWorkouts = workouts.list;
export const getWorkout = workouts.get;
export const createWorkout = workouts.create;
export const updateWorkout = workouts.update;
export const deleteWorkout = workouts.remove;

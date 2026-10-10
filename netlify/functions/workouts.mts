import type { Config } from "@netlify/functions";
import { crudHandler } from "../lib/crud.ts";
import {
  WorkoutInputSchema,
  WorkoutPatchSchema,
  createWorkout,
  deleteWorkout,
  getWorkout,
  listWorkouts,
  updateWorkout,
} from "../lib/workouts.ts";

export default crudHandler(
  "workouts",
  { input: WorkoutInputSchema, patch: WorkoutPatchSchema },
  { list: listWorkouts, get: getWorkout, create: createWorkout, update: updateWorkout, remove: deleteWorkout },
);

export const config: Config = {
  path: ["/api/workouts", "/api/workouts/:id"],
};

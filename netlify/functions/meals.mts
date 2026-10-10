import type { Config } from "@netlify/functions";
import { crudHandler } from "../lib/crud.ts";
import {
  MealInputSchema,
  MealPatchSchema,
  createMeal,
  deleteMeal,
  getMeal,
  listMeals,
  updateMeal,
} from "../lib/meals.ts";

export default crudHandler(
  "meals",
  { input: MealInputSchema, patch: MealPatchSchema },
  { list: listMeals, get: getMeal, create: createMeal, update: updateMeal, remove: deleteMeal },
);

export const config: Config = {
  path: ["/api/meals", "/api/meals/:id"],
};

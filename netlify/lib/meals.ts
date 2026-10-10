import { z } from "zod";
import { collection, type Dated } from "./records.ts";

const num = z.number().nonnegative();

export const ItemSchema = z.object({
  name: z.string().min(1),
  portion: z.string().optional(),
  calories: num,
  protein_g: num.default(0),
  carbs_g: num.default(0),
  fat_g: num.default(0),
  fiber_g: num.optional(),
});

export const MealInputSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "time must be HH:MM")
    .optional(),
  meal_type: z.enum(["breakfast", "lunch", "dinner", "snack", "drink"]),
  title: z.string().min(1),
  items: z.array(ItemSchema).min(1),
  confidence: z.enum(["low", "medium", "high"]).default("medium"),
  assumptions: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

export const MealPatchSchema = MealInputSchema.partial();

export type Item = z.infer<typeof ItemSchema>;
export type MealInput = z.infer<typeof MealInputSchema>;

export type Totals = {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
};

export type Meal = MealInput & Dated & { totals: Totals };

const round = (n: number) => Math.round(n * 10) / 10;

export function computeTotals(items: Item[]): Totals {
  const t = { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0, fiber_g: 0 };
  for (const i of items) {
    t.calories += i.calories;
    t.protein_g += i.protein_g;
    t.carbs_g += i.carbs_g;
    t.fat_g += i.fat_g;
    t.fiber_g += i.fiber_g ?? 0;
  }
  return {
    calories: Math.round(t.calories),
    protein_g: round(t.protein_g),
    carbs_g: round(t.carbs_g),
    fat_g: round(t.fat_g),
    fiber_g: round(t.fiber_g),
  };
}

const meals = collection<MealInput, Meal>("meals", (m) => ({ ...m, totals: computeTotals(m.items) }));

export const listMeals = meals.list;
export const getMeal = meals.get;
export const createMeal = meals.create;
export const updateMeal = meals.update;
export const deleteMeal = meals.remove;

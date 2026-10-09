import { getStore } from "@netlify/blobs";
import { z } from "zod";

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

export type Meal = MealInput & {
  id: string;
  totals: Totals;
  created_at: string;
  updated_at: string;
};

const store = () => getStore({ name: "meals", consistency: "strong" });

// Keys are "<date>/<id>" so a date range can be filtered from the key list alone.
const keyFor = (m: Pick<Meal, "date" | "id">) => `${m.date}/${m.id}`;

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

async function findKey(id: string): Promise<string | undefined> {
  const { blobs } = await store().list();
  return blobs.find((b) => b.key.endsWith(`/${id}`))?.key;
}

export async function listMeals(from?: string, to?: string): Promise<Meal[]> {
  const s = store();
  const { blobs } = await s.list();
  const keys = blobs
    .map((b) => b.key)
    .filter((k) => {
      const date = k.slice(0, 10);
      return (!from || date >= from) && (!to || date <= to);
    });
  const meals = await Promise.all(keys.map((k) => s.get(k, { type: "json" }) as Promise<Meal | null>));
  return meals
    .filter((m): m is Meal => m !== null)
    .sort((a, b) =>
      a.date === b.date ? (b.time ?? "").localeCompare(a.time ?? "") : b.date.localeCompare(a.date),
    );
}

export async function getMeal(id: string): Promise<Meal | null> {
  const key = await findKey(id);
  return key ? ((await store().get(key, { type: "json" })) as Meal | null) : null;
}

export async function createMeal(input: MealInput): Promise<Meal> {
  const now = new Date().toISOString();
  const meal: Meal = {
    ...input,
    id: crypto.randomUUID().slice(0, 8),
    totals: computeTotals(input.items),
    created_at: now,
    updated_at: now,
  };
  await store().setJSON(keyFor(meal), meal);
  return meal;
}

export async function updateMeal(id: string, patch: Partial<MealInput>): Promise<Meal | null> {
  const s = store();
  const key = await findKey(id);
  if (!key) return null;
  const existing = (await s.get(key, { type: "json" })) as Meal | null;
  if (!existing) return null;
  const meal: Meal = { ...existing, ...patch, id, updated_at: new Date().toISOString() };
  meal.totals = computeTotals(meal.items);
  const newKey = keyFor(meal);
  await s.setJSON(newKey, meal);
  if (newKey !== key) await s.delete(key);
  return meal;
}

export async function deleteMeal(id: string): Promise<boolean> {
  const key = await findKey(id);
  if (!key) return false;
  await store().delete(key);
  return true;
}

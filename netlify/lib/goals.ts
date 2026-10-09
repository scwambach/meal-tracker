import { getStore } from "@netlify/blobs";
import { z } from "zod";

export const ACTIVITY = {
  sedentary: { factor: 1.2, label: "Desk job, little exercise" },
  light: { factor: 1.375, label: "Light exercise 1–3 days/week" },
  moderate: { factor: 1.55, label: "Exercise 3–5 days/week" },
  active: { factor: 1.725, label: "Hard exercise 6–7 days/week" },
} as const;

// Pounds of weight change per week. Negative = lose.
export const PACE = {
  maintain: { lbPerWeek: 0, label: "Maintain" },
  mild: { lbPerWeek: -0.5, label: "Mild" },
  moderate: { lbPerWeek: -1, label: "Moderate" },
  aggressive: { lbPerWeek: -1.5, label: "Aggressive" },
  extreme: { lbPerWeek: -2, label: "Very aggressive" },
} as const;

export const ProfileSchema = z.object({
  sex: z.enum(["male", "female"]),
  age: z.number().int().min(13).max(110),
  height_cm: z.number().min(100).max(250),
  weight_kg: z.number().min(30).max(350),
  activity: z.enum(Object.keys(ACTIVITY) as [keyof typeof ACTIVITY, ...(keyof typeof ACTIVITY)[]]),
  pace: z.enum(Object.keys(PACE) as [keyof typeof PACE, ...(keyof typeof PACE)[]]),
  units: z.enum(["imperial", "metric"]).default("imperial"),
  week_start: z.enum(["monday", "sunday"]).default("monday"),
});

export type Profile = z.infer<typeof ProfileSchema>;

export type Targets = {
  bmr: number;
  tdee: number;
  daily_calories: number;
  weekly_calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  /** True when the requested pace would put intake under the safe minimum, so it was raised. */
  floored: boolean;
};

const KCAL_PER_LB = 3500;

export function computeTargets(p: Profile): Targets {
  // Mifflin–St Jeor
  const bmr = 10 * p.weight_kg + 6.25 * p.height_cm - 5 * p.age + (p.sex === "male" ? 5 : -161);
  const tdee = bmr * ACTIVITY[p.activity].factor;
  const deficit = (-PACE[p.pace].lbPerWeek * KCAL_PER_LB) / 7;
  const minimum = p.sex === "male" ? 1500 : 1200;
  const wanted = tdee - deficit;
  const daily = Math.round(Math.max(wanted, minimum) / 10) * 10;

  // Protein ~1.8 g/kg (higher end to hold on to muscle in a deficit), capped at 35% of calories.
  const protein = Math.min(1.8 * p.weight_kg, (daily * 0.35) / 4);
  const fat = (daily * 0.28) / 9;
  const carbs = Math.max(0, (daily - protein * 4 - fat * 9) / 4);

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    daily_calories: daily,
    weekly_calories: daily * 7,
    protein_g: Math.round(protein),
    carbs_g: Math.round(carbs),
    fat_g: Math.round(fat),
    fiber_g: Math.round((daily / 1000) * 14),
    floored: wanted < minimum,
  };
}

const store = () => getStore({ name: "settings", consistency: "strong" });

export async function getProfile(): Promise<Profile | null> {
  return (await store().get("profile", { type: "json" })) as Profile | null;
}

export async function saveProfile(p: Profile): Promise<void> {
  await store().setJSON("profile", p);
}

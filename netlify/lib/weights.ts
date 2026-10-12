import { z } from "zod";
import { getProfile, saveProfile } from "./goals.ts";
import { collection, type Dated } from "./records.ts";

export const WeightInputSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "time must be HH:MM")
    .optional(),
  weight_kg: z.number().min(30).max(350),
  note: z.string().optional(),
});

export const WeightPatchSchema = WeightInputSchema.partial();

export type WeightInput = z.infer<typeof WeightInputSchema>;
export type Weight = WeightInput & Dated;

const weights = collection<WeightInput, Weight>("weights", (w) => ({
  ...w,
  // Keep enough precision that a weight entered in lb to one decimal round-trips exactly.
  weight_kg: Math.round(w.weight_kg * 1000) / 1000,
}));

/** Keep the profile's weight (which drives calorie targets) equal to the latest weigh-in. */
async function syncProfileWeight(): Promise<void> {
  const [latest] = await weights.list();
  const profile = await getProfile();
  if (latest && profile && profile.weight_kg !== latest.weight_kg) {
    await saveProfile({ ...profile, weight_kg: latest.weight_kg });
  }
}

export const listWeights = weights.list;
export const getWeight = weights.get;

export async function createWeight(input: WeightInput): Promise<Weight> {
  const w = await weights.create(input);
  await syncProfileWeight();
  return w;
}

export async function updateWeight(id: string, patch: Partial<WeightInput>): Promise<Weight | null> {
  const w = await weights.update(id, patch);
  if (w) await syncProfileWeight();
  return w;
}

export async function deleteWeight(id: string): Promise<boolean> {
  const ok = await weights.remove(id);
  if (ok) await syncProfileWeight();
  return ok;
}

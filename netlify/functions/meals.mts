import type { Config, Context } from "@netlify/functions";
import { authorized, json, readBody } from "../lib/http.ts";
import {
  MealInputSchema,
  MealPatchSchema,
  createMeal,
  deleteMeal,
  getMeal,
  listMeals,
  updateMeal,
} from "../lib/meals.ts";

export default async (req: Request, context: Context) => {
  const id = context.params.id;

  if (req.method === "GET") {
    if (id) {
      const meal = await getMeal(id);
      return meal ? json(meal) : json({ error: "not found" }, 404);
    }
    const url = new URL(req.url);
    const from = url.searchParams.get("from") ?? undefined;
    const to = url.searchParams.get("to") ?? undefined;
    return json({ meals: await listMeals(from, to) });
  }

  if (!authorized(req)) return json({ error: "unauthorized" }, 401);

  if (req.method === "POST" && !id) {
    const parsed = MealInputSchema.safeParse(await readBody(req));
    if (!parsed.success) return json({ error: parsed.error.issues }, 400);
    return json(await createMeal(parsed.data), 201);
  }

  if (req.method === "PATCH" && id) {
    const body = await readBody(req);
    const parsed = MealPatchSchema.safeParse(body);
    if (!parsed.success) return json({ error: parsed.error.issues }, 400);
    // Only apply fields the caller actually sent, so schema defaults don't clobber stored values.
    const sent = new Set(Object.keys(body as object));
    const patch = Object.fromEntries(Object.entries(parsed.data).filter(([k]) => sent.has(k)));
    const meal = await updateMeal(id, patch);
    return meal ? json(meal) : json({ error: "not found" }, 404);
  }

  if (req.method === "DELETE" && id) {
    return (await deleteMeal(id)) ? json({ deleted: id }) : json({ error: "not found" }, 404);
  }

  return json({ error: "method not allowed" }, 405);
};

export const config: Config = {
  path: ["/api/meals", "/api/meals/:id"],
};

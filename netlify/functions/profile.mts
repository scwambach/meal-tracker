import type { Config } from "@netlify/functions";
import { ACTIVITY, PACE, ProfileSchema, computeTargets, getProfile, saveProfile } from "../lib/goals.ts";
import { authorized, json, readBody } from "../lib/http.ts";

export default async (req: Request) => {
  if (req.method === "GET") {
    const profile = await getProfile();
    return json({ profile, targets: profile ? computeTargets(profile) : null, options: { activity: ACTIVITY, pace: PACE } });
  }

  if (req.method === "PUT") {
    if (!authorized(req, { allowPasscode: true })) return json({ error: "unauthorized" }, 401);
    const parsed = ProfileSchema.safeParse(await readBody(req));
    if (!parsed.success) return json({ error: parsed.error.issues }, 400);
    await saveProfile(parsed.data);
    return json({ profile: parsed.data, targets: computeTargets(parsed.data) });
  }

  return json({ error: "method not allowed" }, 405);
};

export const config: Config = { path: "/api/profile" };

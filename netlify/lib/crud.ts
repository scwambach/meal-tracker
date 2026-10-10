import type { Context } from "@netlify/functions";
import type { z } from "zod";
import { authorized, json, readBody } from "./http.ts";

type Ops<In, Out> = {
  list: (from?: string, to?: string) => Promise<Out[]>;
  get: (id: string) => Promise<Out | null>;
  create: (input: In) => Promise<Out>;
  update: (id: string, patch: Partial<In>) => Promise<Out | null>;
  remove: (id: string) => Promise<boolean>;
};

/**
 * REST handler for a dated collection at /api/<plural> and /api/<plural>/:id.
 * Reads are public; writes need MEAL_API_TOKEN.
 */
export function crudHandler<In, Out>(
  plural: string,
  schemas: { input: z.ZodType<In>; patch: z.ZodType<Partial<In>> },
  ops: Ops<In, Out>,
) {
  return async (req: Request, context: Context) => {
    const id = context.params.id;

    if (req.method === "GET") {
      if (id) {
        const record = await ops.get(id);
        return record ? json(record) : json({ error: "not found" }, 404);
      }
      const url = new URL(req.url);
      const from = url.searchParams.get("from") ?? undefined;
      const to = url.searchParams.get("to") ?? undefined;
      return json({ [plural]: await ops.list(from, to) });
    }

    if (!authorized(req)) return json({ error: "unauthorized" }, 401);

    if (req.method === "POST" && !id) {
      const parsed = schemas.input.safeParse(await readBody(req));
      if (!parsed.success) return json({ error: parsed.error.issues }, 400);
      return json(await ops.create(parsed.data), 201);
    }

    if (req.method === "PATCH" && id) {
      const body = await readBody(req);
      const parsed = schemas.patch.safeParse(body);
      if (!parsed.success) return json({ error: parsed.error.issues }, 400);
      // Only apply fields the caller actually sent, so schema defaults don't clobber stored values.
      const sent = new Set(Object.keys(body as object));
      const patch = Object.fromEntries(Object.entries(parsed.data).filter(([k]) => sent.has(k))) as Partial<In>;
      const record = await ops.update(id, patch);
      return record ? json(record) : json({ error: "not found" }, 404);
    }

    if (req.method === "DELETE" && id) {
      return (await ops.remove(id)) ? json({ deleted: id }) : json({ error: "not found" }, 404);
    }

    return json({ error: "method not allowed" }, 405);
  };
}

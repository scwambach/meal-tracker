import { timingSafeEqual } from "node:crypto";

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

export async function readBody(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    return undefined;
  }
}

function matches(given: string, expected: string | undefined): boolean {
  if (!expected) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Bearer token check. `allowPasscode` also accepts SITE_PASSCODE, the short code typed on the website. */
export function authorized(req: Request, { allowPasscode = false } = {}): boolean {
  const given = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!given) return false;
  return matches(given, process.env.MEAL_API_TOKEN) || (allowPasscode && matches(given, process.env.SITE_PASSCODE));
}

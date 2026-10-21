import Anthropic from "@anthropic-ai/sdk";
import type { Config } from "@netlify/functions";
import { chat } from "../lib/assistant.ts";
import { authorized, json, readBody } from "../lib/http.ts";

// POST /api/chat with { messages } (the conversation so far, in Messages API format).
// Needs the site passcode, since every call spends Anthropic API credit.
export default async (req: Request) => {
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);
  if (!authorized(req, { allowPasscode: true })) return json({ error: "unauthorized" }, 401);
  if (!process.env.ANTHROPIC_API_KEY) {
    return json({ error: "Claude isn't set up yet. Add ANTHROPIC_API_KEY to the site's Netlify environment variables." }, 503);
  }

  const body = (await readBody(req)) as { messages?: unknown } | undefined;
  const messages = body?.messages;
  if (!Array.isArray(messages) || messages.length === 0 || messages[0]?.role !== "user") {
    return json({ error: "messages must be a non-empty array starting with a user message" }, 400);
  }

  try {
    return json(await chat(messages as Anthropic.Beta.BetaMessageParam[]));
  } catch (err) {
    console.error(err);
    if (err instanceof Anthropic.RateLimitError) return json({ error: "Claude is busy right now. Try again in a moment." }, 429);
    if (err instanceof Anthropic.AuthenticationError) return json({ error: "The Anthropic API key was rejected." }, 502);
    if (err instanceof Anthropic.BadRequestError) return json({ error: `Claude couldn't read that: ${err.message}` }, 400);
    if (err instanceof Anthropic.APIError) return json({ error: `Claude had a problem (${err.status}). Try again.` }, 502);
    return json({ error: "Something went wrong talking to Claude." }, 500);
  }
};

export const config: Config = { path: "/api/chat", method: "POST" };

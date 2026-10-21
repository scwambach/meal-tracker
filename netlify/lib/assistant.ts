import Anthropic from "@anthropic-ai/sdk";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { INSTRUCTIONS, TIMEZONE, createServer, nowLocal } from "./mcp.ts";

// The in-app assistant: Claude, connected in-process to the same MCP tools the claude.ai
// connector uses, so it estimates, asks and logs exactly as it does in the Claude apps.

const MODEL = "claude-opus-5-5";
const TOOLS_THAT_WRITE = /^(log|update|delete)_/;

/** Stop starting new model calls after this long, so a request stays well inside Netlify's 60s limit. */
const DEADLINE_MS = 38_000;
const MAX_STEPS = 8;

const SYSTEM = `${INSTRUCTIONS}

You are the assistant built into the user's meal tracker app, which they mostly use on their phone
while out. They type here or attach photos of food, nutrition labels or workout screens. Use the
tools to log things and look things up.

Keep replies short and friendly: a few lines that fit a phone screen. Plain text, with **bold** and
short "- " bullet lists only when they help. After logging, confirm what you logged and what's left
in one or two lines rather than repeating every number.`;

export type ChatResult = {
  /** Messages to append to the conversation, in order (assistant turns and tool results). */
  messages: Anthropic.Beta.BetaMessageParam[];
  /** False when the turn isn't finished yet; the app should call again to continue it. */
  done: boolean;
  /** True when a tool changed data, so the app should reload. */
  changed: boolean;
};

let anthropic: Anthropic | undefined;

async function connectTools() {
  const server = createServer();
  const [serverSide, clientSide] = InMemoryTransport.createLinkedPair();
  await server.connect(serverSide);
  const client = new Client({ name: "meal-tracker-app", version: "1.0.0" });
  await client.connect(clientSide);
  const { tools } = await client.listTools();
  const defs: Anthropic.Beta.BetaTool[] = tools.map((t, i) => ({
    name: t.name,
    description: t.description ?? "",
    input_schema: t.inputSchema as Anthropic.Beta.BetaTool.InputSchema,
    // Cache the (stable) tool list together with the system prompt.
    ...(i === tools.length - 1 && { cache_control: { type: "ephemeral" as const } }),
  }));
  return { client, server, defs };
}

function resultText(result: Awaited<ReturnType<Client["callTool"]>>): string {
  const content = Array.isArray(result.content) ? result.content : [];
  return content.map((c) => (c.type === "text" ? c.text : `[${c.type}]`)).join("\n") || "(no output)";
}

export async function chat(history: Anthropic.Beta.BetaMessageParam[]): Promise<ChatResult> {
  anthropic ??= new Anthropic();
  const started = Date.now();
  const { client, server, defs } = await connectTools();
  const now = nowLocal();
  const weekday = new Date(`${now.date}T12:00:00Z`).toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" });

  const out: Anthropic.Beta.BetaMessageParam[] = [];
  let changed = false;

  try {
    for (let step = 0; step < MAX_STEPS; step++) {
      if (step > 0 && Date.now() - started > DEADLINE_MS) return { messages: out, done: false, changed };

      const response = await anthropic.beta.messages.create({
        model: MODEL,
        max_tokens: 16000,
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        output_config: { effort: "medium" },
        system: [
          { type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } },
          { type: "text", text: `Right now it is ${weekday} ${now.date}, ${now.time} (${TIMEZONE}).` },
        ],
        tools: defs,
        messages: [...history, ...out],
      });

      out.push({ role: "assistant", content: response.content as Anthropic.Beta.BetaContentBlockParam[] });

      if (response.stop_reason === "pause_turn") continue;
      if (response.stop_reason !== "tool_use") return { messages: out, done: true, changed };

      const calls = response.content.filter((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === "tool_use");
      const results = await Promise.all(
        calls.map(async (call): Promise<Anthropic.Beta.BetaToolResultBlockParam> => {
          try {
            const result = await client.callTool({ name: call.name, arguments: call.input as Record<string, unknown> });
            if (!result.isError && TOOLS_THAT_WRITE.test(call.name)) changed = true;
            return { type: "tool_result", tool_use_id: call.id, content: resultText(result), is_error: !!result.isError };
          } catch (err) {
            return { type: "tool_result", tool_use_id: call.id, content: `Error: ${(err as Error).message}`, is_error: true };
          }
        }),
      );
      // All results for one assistant turn go back in a single user message.
      out.push({ role: "user", content: results });
    }
    return { messages: out, done: false, changed };
  } finally {
    await client.close();
    await server.close();
  }
}

import type { Config, Context } from "@netlify/functions";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { json, matches } from "../lib/http.ts";
import { createServer } from "../lib/mcp.ts";

// A client proves itself either with an "Authorization: Bearer" header on /mcp, or by putting
// MCP_AUTH_TOKEN in the path (/mcp/<token>) for clients like the Claude apps whose custom
// connectors can only be given a URL.
function authorized(req: Request, token: string | undefined): boolean {
  const expected = process.env.MCP_AUTH_TOKEN;
  if (token !== undefined) return matches(token, expected);
  return matches(req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "", expected);
}

export default async (req: Request, context: Context) => {
  if (!authorized(req, context.params.token)) return json({ error: "unauthorized" }, 401);
  // Stateless server: no SSE stream or session to GET/DELETE.
  if (req.method !== "POST") return new Response(null, { status: 405, headers: { allow: "POST" } });

  const server = createServer();
  const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
  try {
    await server.connect(transport);
    return await transport.handleRequest(req);
  } catch (err) {
    console.error(err);
    return json({ jsonrpc: "2.0", error: { code: -32603, message: "Internal error" }, id: null }, 500);
  } finally {
    await server.close();
  }
};

export const config: Config = { path: ["/mcp", "/mcp/:token"] };

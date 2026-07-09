import type { Ai, KVNamespace } from "@cloudflare/workers-types";
import { type AiEnv, runAgent } from "@workspace/ai";
import { verifyToken } from "@workspace/auth/session";
import type { UIMessage } from "ai";
import { Hono } from "hono";

type Bindings = {
	AUTH_SECRET: string;
	OPENAI_API_KEY?: string;
	ANTHROPIC_API_KEY?: string;
	CLOUDFLARE_API_KEY?: string;
	CLOUDFLARE_ACCOUNT_ID?: string;
	DEFAULT_MODEL?: string;
	AGENT_KV: KVNamespace;
	AI: Ai;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/health", (c) => c.json({ ok: true }));

app.post("/v1/agent", async (c) => {
	const authHeader = c.req.header("authorization") ?? "";
	const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

	const session = token ? await verifyToken(token, c.env.AUTH_SECRET) : null;

	if (!session) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	let body: { messages?: UIMessage[]; agentId?: string; model?: string };
	try {
		body = await c.req.json();
	} catch {
		return c.json({ error: "Invalid JSON body" }, 400);
	}

	const messages = body.messages;
	if (!Array.isArray(messages) || messages.length === 0) {
		return c.json({ error: "`messages` is required" }, 400);
	}

	const env: AiEnv = {
		OPENAI_API_KEY: c.env.OPENAI_API_KEY,
		ANTHROPIC_API_KEY: c.env.ANTHROPIC_API_KEY,
		CLOUDFLARE_API_KEY: c.env.CLOUDFLARE_API_KEY,
		CLOUDFLARE_ACCOUNT_ID: c.env.CLOUDFLARE_ACCOUNT_ID,
		AI: c.env.AI,
	};

	const result = runAgent({
		messages,
		agentId: body.agentId ?? "helper",
		model: body.model ?? c.env.DEFAULT_MODEL ?? "openai:gpt-4o-mini",
		env,
		kv: c.env.AGENT_KV,
	});

	return result.toUIMessageStreamResponse();
});

export default app;

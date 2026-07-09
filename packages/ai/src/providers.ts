import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { createWorkersAI } from "workers-ai-provider";
import type { LanguageModel } from "ai";
import type { Ai } from "@cloudflare/workers-types";

export type AiEnv = {
	AUTH_SECRET?: string;
	OPENAI_API_KEY?: string;
	ANTHROPIC_API_KEY?: string;
	CLOUDFLARE_API_KEY?: string;
	CLOUDFLARE_ACCOUNT_ID?: string;
	/** Optional AI Gateway id (NOT the account id). Only set if you created a gateway. */
	CLOUDFLARE_AI_GATEWAY_ID?: string;
	AI?: Ai;
};

/**
 * Resolve a model spec like `"openai:gpt-4o-mini"` or
 * `"anthropic:claude-3-5-sonnet-latest"` to a concrete AI SDK model.
 *
 * - `openai:` / `anthropic:` — remote provider APIs (keys from Worker env)
 * - `cloudflare-workers-ai:` — Workers AI binding (`env.AI`) via workers-ai-provider
 * - `cloudflare:` — Workers AI OpenAI-compatible REST API
 */
export function resolveModel(spec: string, env: AiEnv): LanguageModel {
	const [provider, ...rest] = spec.split(":");
	const modelId = rest.join(":") || "";

	switch (provider) {
		case "openai": {
			if (!env.OPENAI_API_KEY) {
				throw new Error("OPENAI_API_KEY is not configured");
			}
			// Workers do not inject secrets into process.env — pass the key explicitly.
			const client = createOpenAI({ apiKey: env.OPENAI_API_KEY });
			return client(modelId || "gpt-4o-mini");
		}
		case "anthropic": {
			if (!env.ANTHROPIC_API_KEY) {
				throw new Error("ANTHROPIC_API_KEY is not configured");
			}
			const client = createAnthropic({ apiKey: env.ANTHROPIC_API_KEY });
			return client(modelId || "claude-3-5-sonnet-latest");
		}
		case "cloudflare-workers-ai": {
			// Preferred path on Workers: use the AI binding (no AI Gateway required).
			if (!env.AI) {
				throw new Error(
					'AI binding is not configured (add [ai] binding = "AI" in wrangler.toml)',
				);
			}
			// workers-ai-provider pins its own @cloudflare/workers-types copy; cast past
			// the structural AbortSignal mismatch between monorepo and provider types.
			const workersAI = createWorkersAI({
				binding: env.AI as never,
				// gateway.id must be a real AI Gateway name from the dashboard.
				// Never pass CLOUDFLARE_ACCOUNT_ID here — that is not a gateway id.
				...(env.CLOUDFLARE_AI_GATEWAY_ID
					? { gateway: { id: env.CLOUDFLARE_AI_GATEWAY_ID } }
					: {}),
			});
			// Catalog models can ship before types catch up (e.g. kimi-k2.7-code).
			return workersAI(
				(modelId ||
					"@cf/meta/llama-3.3-70b-instruct-fp8-fast") as Parameters<
					typeof workersAI
				>[0],
			);
		}
		case "cloudflare": {
			if (!env.CLOUDFLARE_API_KEY || !env.CLOUDFLARE_ACCOUNT_ID) {
				throw new Error(
					"CLOUDFLARE_API_KEY and CLOUDFLARE_ACCOUNT_ID are not configured",
				);
			}
			const gateway = createOpenAICompatible({
				name: "cloudflare",
				apiKey: env.CLOUDFLARE_API_KEY,
				baseURL: `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/ai/v1`,
			});
			return gateway(
				modelId || "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
			);
		}
		default:
			throw new Error(`Unknown provider in model spec: "${spec}"`);
	}
}

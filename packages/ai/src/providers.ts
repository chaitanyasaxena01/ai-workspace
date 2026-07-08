import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import type { LanguageModel } from "ai";

export type AiEnv = {
	AUTH_SECRET?: string;
	OPENAI_API_KEY?: string;
	ANTHROPIC_API_KEY?: string;
	CLOUDFLARE_API_KEY?: string;
	CLOUDFLARE_ACCOUNT_ID?: string;
};

/**
 * Resolve a model spec like `"openai:gpt-4o-mini"` or
 * `"anthropic:claude-3-5-sonnet-latest"` to a concrete AI SDK model.
 * Supports openai, anthropic, and Cloudflare Workers AI (OpenAI-compatible).
 */
export function resolveModel(spec: string, env: AiEnv): LanguageModel {
	const [provider, ...rest] = spec.split(":");
	const modelId = rest.join(":") || "";

	switch (provider) {
		case "openai": {
			if (!env.OPENAI_API_KEY) {
				throw new Error("OPENAI_API_KEY is not configured");
			}
			return openai(modelId || "gpt-4o-mini");
		}
		case "anthropic": {
			if (!env.ANTHROPIC_API_KEY) {
				throw new Error("ANTHROPIC_API_KEY is not configured");
			}
			return anthropic(modelId || "claude-3-5-sonnet-latest");
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
			return gateway(modelId || "@cf/meta/llama-3.1-8b-instruct");
		}
		default:
			throw new Error(`Unknown provider in model spec: "${spec}"`);
	}
}

export type ModelOption = {
	id: string;
	label: string;
	provider: "Workers AI" | "Workers AI REST" | "OpenAI" | "Anthropic";
	requiresKey?: "openai" | "anthropic";
};

/** Display catalog. `id` is the exact model spec sent to the Worker. */
export const MODEL_OPTIONS: ModelOption[] = [
	{
		id: "cloudflare-workers-ai:@cf/meta/llama-3.3-70b-instruct-fp8-fast",
		label: "Llama 3.3 70B",
		provider: "Workers AI",
	},
	{
		id: "cloudflare-workers-ai:@cf/moonshotai/kimi-k2.7-code",
		label: "Kimi K2.7 Code",
		provider: "Workers AI",
	},
	{
		id: "cloudflare-workers-ai:@cf/meta/llama-4-scout-17b-16e-instruct",
		label: "Llama 4 Scout",
		provider: "Workers AI",
	},
	{
		id: "cloudflare-workers-ai:@cf/zai-org/glm-4.7-flash",
		label: "GLM 4.7 Flash",
		provider: "Workers AI",
	},
	{
		id: "cloudflare:@cf/meta/llama-3.3-70b-instruct-fp8-fast",
		label: "Llama 3.3 70B",
		provider: "Workers AI REST",
	},
	{
		id: "cloudflare:@cf/moonshotai/kimi-k2.7-code",
		label: "Kimi K2.7 Code",
		provider: "Workers AI REST",
	},
	{
		id: "openai:gpt-4o-mini",
		label: "GPT-4o mini",
		provider: "OpenAI",
		requiresKey: "openai",
	},
	{
		id: "openai:gpt-4o",
		label: "GPT-4o",
		provider: "OpenAI",
		requiresKey: "openai",
	},
	{
		id: "anthropic:claude-3-5-sonnet-latest",
		label: "Claude 3.5 Sonnet",
		provider: "Anthropic",
		requiresKey: "anthropic",
	},
];

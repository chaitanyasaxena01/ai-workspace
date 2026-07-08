import { z } from "zod";

/**
 * Environment consumed by the Next.js web app (apps/web).
 * Read via `process.env` at runtime / build time.
 */
export const webEnvSchema = z.object({
	AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required"),
	NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
	NEXT_PUBLIC_WORKER_URL: z.string().url().default("http://localhost:8787"),
	OPENAI_API_KEY: z.string().optional(),
	ANTHROPIC_API_KEY: z.string().optional(),
	CLOUDFLARE_API_KEY: z.string().optional(),
	CLOUDFLARE_ACCOUNT_ID: z.string().optional(),
	DEFAULT_MODEL: z.string().default("openai:gpt-4o-mini"),
});

export type WebEnv = z.infer<typeof webEnvSchema>;

/**
 * Environment bound to the Cloudflare Worker (apps/api).
 * `Vars` come from wrangler.toml; `Bindings` include KV etc.
 */
export const workerEnvSchema = z.object({
	AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required"),
	OPENAI_API_KEY: z.string().optional(),
	ANTHROPIC_API_KEY: z.string().optional(),
	CLOUDFLARE_API_KEY: z.string().optional(),
	CLOUDFLARE_ACCOUNT_ID: z.string().optional(),
	DEFAULT_MODEL: z.string().default("openai:gpt-4o-mini"),
});

export type WorkerEnv = z.infer<typeof workerEnvSchema>;

/**
 * Parse the Web Worker runtime environment (`env` argument from Hono on
 * Cloudflare). Returns the typed + validated env, throwing on missing
 * required secrets.
 */
export function parseWorkerEnv(input: unknown): WorkerEnv {
	return workerEnvSchema.parse(input);
}

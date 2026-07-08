import { tool } from "ai";
import { z } from "zod";

/** Minimal structural shape of a Cloudflare KV namespace we use. */
export type NoteStore = {
	get(key: string): Promise<string | null>;
	put(key: string, value: string): Promise<unknown>;
	list(opts?: { prefix?: string }): Promise<{ keys: { name: string }[] }>;
};

function safeEval(expr: string): number {
	const cleaned = expr.replace(/[^0-9+\-*/().\s]/g, "");
	if (cleaned !== expr.trim()) {
		throw new Error("Only numbers and + - * / ( ) are allowed");
	}
	// eslint-disable-next-line no-new-func
	const value = Function(`"use strict"; return (${cleaned});`)() as number;
	if (typeof value !== "number" || !Number.isFinite(value)) {
		throw new Error("Invalid expression");
	}
	return value;
}

const memory = new Map<string, string>();

/**
 * Build the tool set used by agents. Pass a Cloudflare KV binding to persist
 * notes; without one an in-memory store is used (handy for local dev).
 */
export function createTools(kv?: NoteStore) {
	const notes = kv ?? {
		async get(key: string) {
			return memory.get(key) ?? null;
		},
		async put(key: string, value: string) {
			memory.set(key, value);
		},
		async list() {
			return { keys: [...memory.keys()].map((name) => ({ name })) };
		},
	};

	return {
		calculator: tool({
			description: "Evaluate a basic arithmetic expression (+, -, *, /, parentheses).",
			inputSchema: z.object({
				expression: z.string().describe("e.g. (1 + 2) * 3"),
			}),
			execute: async ({ expression }) => {
				const result = safeEval(expression);
				return { expression, result };
			},
		}),
		webFetch: tool({
			description: "Fetch a URL and return its readable text content (truncated).",
			inputSchema: z.object({
				url: z.string().url(),
			}),
			execute: async ({ url }) => {
				const res = await fetch(url, {
					headers: { "user-agent": "ai-agent-playground/1.0" },
				});
				if (!res.ok) {
					return { url, ok: false, error: `HTTP ${res.status}` };
				}
				const text = await res.text();
				return { url, ok: true, content: text.slice(0, 8000) };
			},
		}),
		notes: tool({
			description:
				"Save or list user notes/memory. action 'save' stores a key/value, 'list' returns all stored keys.",
			inputSchema: z.object({
				action: z.enum(["save", "list"]),
				key: z.string().optional(),
				value: z.string().optional(),
			}),
			execute: async ({ action, key, value }) => {
				if (action === "save") {
					if (!key) return { ok: false, error: "key is required" };
					await notes.put(key, value ?? "");
					return { ok: true, saved: key };
				}
				const listed = await notes.list();
				return { ok: true, keys: listed.keys.map((k) => k.name) };
			},
		}),
	};
}

export type AgentTools = ReturnType<typeof createTools>;

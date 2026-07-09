import { tool } from "ai";
import { z } from "zod";

/** Minimal structural shape of a Cloudflare KV namespace we use. */
export type NoteStore = {
	get(key: string): Promise<string | null>;
	put(key: string, value: string): Promise<unknown>;
	list(opts?: { prefix?: string }): Promise<{ keys: { name: string }[] }>;
};

/**
 * Safe recursive-descent math parser.
 * Supports: +, -, *, /, parentheses, unary minus, decimals.
 * Does NOT use eval/Function — safe for Cloudflare Workers.
 */
function safeEval(expr: string): number {
	const cleaned = expr.replace(/[^0-9+\-*/().\s]/g, "");
	if (cleaned !== expr.trim()) {
		throw new Error("Only numbers and + - * / ( ) are allowed");
	}

	let pos = 0;
	const src = cleaned.replace(/\s+/g, "");

	function parseExpr(): number {
		let left = parseTerm();
		while (pos < src.length && (src[pos] === "+" || src[pos] === "-")) {
			const op = src[pos]!;
			pos++;
			const right = parseTerm();
			left = op === "+" ? left + right : left - right;
		}
		return left;
	}

	function parseTerm(): number {
		let left = parseFactor();
		while (pos < src.length && (src[pos] === "*" || src[pos] === "/")) {
			const op = src[pos]!;
			pos++;
			const right = parseFactor();
			if (op === "/") {
				if (right === 0) throw new Error("Division by zero");
				left = left / right;
			} else {
				left = left * right;
			}
		}
		return left;
	}

	function parseFactor(): number {
		// Unary minus
		if (src[pos] === "-") {
			pos++;
			return -parseFactor();
		}
		// Unary plus
		if (src[pos] === "+") {
			pos++;
			return parseFactor();
		}
		// Parenthesised sub-expression
		if (src[pos] === "(") {
			pos++; // skip '('
			const val = parseExpr();
			if (src[pos] !== ")") throw new Error("Missing closing parenthesis");
			pos++; // skip ')'
			return val;
		}
		// Number literal (integer or decimal)
		const start = pos;
		while (pos < src.length && (src[pos]! >= "0" && src[pos]! <= "9" || src[pos] === ".")) {
			pos++;
		}
		if (pos === start) throw new Error("Unexpected token");
		const value = Number(src.slice(start, pos));
		if (!Number.isFinite(value)) throw new Error("Invalid number");
		return value;
	}

	const result = parseExpr();
	if (pos !== src.length) throw new Error("Unexpected characters after expression");
	if (!Number.isFinite(result)) throw new Error("Invalid expression");
	return result;
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

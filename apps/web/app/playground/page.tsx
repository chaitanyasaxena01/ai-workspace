"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useMemo, useState } from "react";

import { AGENT_LIST, type AgentId } from "@workspace/ai";
import { Button } from "@workspace/ui";

const MODELS = [
	// Workers AI via binding (recommended — uses env.AI, no OpenAI/Anthropic keys needed)
	"cloudflare-workers-ai:@cf/meta/llama-3.3-70b-instruct-fp8-fast",
	"cloudflare-workers-ai:@cf/moonshotai/kimi-k2.7-code",
	"cloudflare-workers-ai:@cf/meta/llama-4-scout-17b-16e-instruct",
	"cloudflare-workers-ai:@cf/zai-org/glm-4.7-flash",
	// Workers AI via OpenAI-compatible REST API
	"cloudflare:@cf/meta/llama-3.3-70b-instruct-fp8-fast",
	"cloudflare:@cf/moonshotai/kimi-k2.7-code",
	"cloudflare:@cf/zai-org/glm-4.7-flash",
	// Need OPENAI_API_KEY / ANTHROPIC_API_KEY in apps/api/.dev.vars
	"openai:gpt-4o-mini",
	"openai:gpt-4o",
	"anthropic:claude-3-5-sonnet-latest",
];

export default function PlaygroundPage() {
	const [agentId, setAgentId] = useState<AgentId>("helper");
	const [model, setModel] = useState(MODELS[0]);
	const [input, setInput] = useState("");

	const transport = useMemo(
		() =>
			new DefaultChatTransport({
				api: "/api/agent",
				body: { agentId, model },
			}),
		[agentId, model],
	);

	const { messages, sendMessage, status, stop } = useChat({ transport });

	const busy = status === "submitted" || status === "streaming";

	const agentOptions = useMemo(
		() => AGENT_LIST.map((a) => ({ id: a.id, name: a.name })),
		[],
	);

	async function onSend(e: React.FormEvent) {
		e.preventDefault();
		const text = input.trim();
		if (!text || busy) return;
		setInput("");
		sendMessage({ text });
	}

	return (
		<main style={{ maxWidth: 820, margin: "0 auto", padding: 24 }}>
			<div
				style={{
					display: "flex",
					gap: 12,
					marginBottom: 16,
					flexWrap: "wrap",
				}}
			>
				<label>
					Agent{" "}
					<select
						value={agentId}
						onChange={(e) => setAgentId(e.target.value as AgentId)}
					>
						{agentOptions.map((a) => (
							<option key={a.id} value={a.id}>
								{a.name}
							</option>
						))}
					</select>
				</label>
				<label>
					Model{" "}
					<select value={model} onChange={(e) => setModel(e.target.value)}>
						{MODELS.map((m) => (
							<option key={m} value={m}>
								{m}
							</option>
						))}
					</select>
				</label>
			</div>

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: 12,
					minHeight: 360,
					border: "1px solid #333",
					borderRadius: 12,
					padding: 16,
				}}
			>
				{messages.length === 0 ? (
					<p style={{ opacity: 0.6 }}>Start the conversation below.</p>
				) : (
					messages.map((m) => (
						<div key={m.id}>
							<strong>{m.role === "user" ? "You" : "Agent"}</strong>
							{m.parts.map((part, i) => {
								if (part.type === "text") {
									return <p key={i} style={{ whiteSpace: "pre-wrap" }}>{part.text}</p>;
								}
								const label = part.type.replace("tool-", "🔧 ");
								return (
									<pre
										key={i}
										style={{ opacity: 0.7, fontSize: 12, overflowX: "auto" }}
									>
										{label}
									</pre>
								);
							})}
						</div>
					))
				)}
			</div>

			<form
				onSubmit={onSend}
				style={{ display: "flex", gap: 8, marginTop: 16 }}
			>
				<input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Ask the agent…"
					style={{ flex: 1 }}
				/>
				{busy ? (
					<Button type="button" onClick={() => stop()}>
						Stop
					</Button>
				) : (
					<Button type="submit" disabled={!input.trim()}>
						Send
					</Button>
				)}
			</form>
		</main>
	);
}

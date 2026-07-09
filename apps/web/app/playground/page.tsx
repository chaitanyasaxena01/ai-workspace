"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useMemo, useState } from "react";

import { AGENT_LIST, type AgentId } from "@workspace/ai/agents";
import { Badge, Button } from "@workspace/ui";

import { AppShell } from "../../components/AppShell";
import { EmptyState } from "../../components/playground/EmptyState";
import { MessageList } from "../../components/playground/MessageList";
import { MODEL_OPTIONS } from "../../lib/models";

export default function PlaygroundPage() {
	const [agentId, setAgentId] = useState<AgentId>("helper");
	const [model, setModel] = useState(MODEL_OPTIONS[0]!.id);
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
	const selectedAgent = useMemo(
		() => AGENT_LIST.find((a) => a.id === agentId) ?? AGENT_LIST[0]!,
		[agentId],
	);
	const selectedModel = useMemo(
		() => MODEL_OPTIONS.find((m) => m.id === model) ?? MODEL_OPTIONS[0]!,
		[model],
	);

	async function onSend(e?: React.FormEvent) {
		e?.preventDefault();
		const text = input.trim();
		if (!text || busy) return;
		setInput("");
		sendMessage({ text });
	}

	return (
		<AppShell contained={false} className="flex flex-col">
			<div className="flex min-h-0 flex-1 flex-col border-t border-border lg:flex-row">
				<aside className="flex w-full shrink-0 flex-col gap-5 overflow-y-auto border-b border-border bg-surface/50 p-4 lg:w-80 lg:border-b-0 lg:border-r">
					<div>
						<p className="m-0 text-xs font-medium text-muted">Agent</p>
						<div className="mt-2 flex flex-col gap-2" role="listbox" aria-label="Agents">
							{AGENT_LIST.map((agent) => {
								const active = agent.id === agentId;
								const tools =
									agent.tools === "*" ? "all tools" : agent.tools.join(", ");
								return (
									<button
										key={agent.id}
										type="button"
										role="option"
										aria-selected={active}
										disabled={busy}
										onClick={() => setAgentId(agent.id)}
										className={[
											"cursor-pointer rounded-[12px] border px-3 py-3 text-left transition-colors",
											"disabled:cursor-not-allowed disabled:opacity-50",
											active
												? "border-primary/40 bg-primary-soft"
												: "border-border bg-bg/40 hover:border-border-strong hover:bg-surface-2",
										].join(" ")}
									>
										<div className="flex items-center justify-between gap-2">
											<span className="text-sm font-semibold text-ink">
												{agent.name}
											</span>
											{active ? <Badge tone="primary">active</Badge> : null}
										</div>
										<p className="mt-1 mb-0 text-xs leading-relaxed text-muted">
											{agent.description}
										</p>
										<p className="mt-2 mb-0 font-mono text-[10px] text-muted/90">
											{tools}
										</p>
									</button>
								);
							})}
						</div>
					</div>

					<div>
						<label className="flex flex-col gap-1.5">
							<span className="text-xs font-medium text-muted">Model</span>
							<select
								value={model}
								disabled={busy}
								onChange={(e) => setModel(e.target.value)}
								className="field"
							>
								{MODEL_OPTIONS.map((m) => (
									<option key={m.id} value={m.id}>
										{m.label} · {m.provider}
										{m.requiresKey ? " (key required)" : ""}
									</option>
								))}
							</select>
						</label>
						<p className="mt-2 mb-0 break-all font-mono text-[10px] leading-relaxed text-muted">
							{selectedModel.id}
						</p>
					</div>

					<div className="mt-auto hidden rounded-[12px] border border-border bg-bg/50 p-3 lg:block">
						<p className="m-0 text-xs font-medium text-ink">How it works</p>
						<p className="mt-1 mb-0 text-xs leading-relaxed text-muted">
							UI → JWT → Cloudflare Worker → streamText + tools. Agent and model
							changes apply on the next message.
						</p>
					</div>
				</aside>

				<section className="flex min-h-[60vh] flex-1 flex-col lg:min-h-0">
					<div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
						<div className="min-w-0">
							<h1 className="m-0 truncate text-sm font-semibold tracking-tight text-ink">
								{selectedAgent.name}
								<span className="font-normal text-muted">
									{" "}
									· {selectedModel.label}
								</span>
							</h1>
							<p className="m-0 truncate text-xs text-muted">
								{selectedAgent.description}
							</p>
						</div>
						<Badge tone={busy ? "accent" : "muted"}>
							{busy ? "streaming" : "idle"}
						</Badge>
					</div>

					<div className="flex-1 overflow-y-auto px-4 py-5">
						{messages.length === 0 ? (
							<EmptyState onSuggest={setInput} />
						) : (
							<MessageList messages={messages} busy={busy} />
						)}
					</div>

					<form
						onSubmit={onSend}
						className="border-t border-border bg-surface/40 p-4"
					>
						<div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-end">
							<textarea
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter" && !e.shiftKey) {
										e.preventDefault();
										void onSend();
									}
								}}
								placeholder="Ask the agent… (Enter to send)"
								rows={2}
								className="field field-area flex-1"
							/>
							{busy ? (
								<Button type="button" variant="danger" onClick={() => stop()}>
									Stop
								</Button>
							) : (
								<Button type="submit" disabled={!input.trim()}>
									Send
								</Button>
							)}
						</div>
					</form>
				</section>
			</div>
		</AppShell>
	);
}

import Link from "next/link";

import { AGENT_LIST } from "@workspace/ai/agents";
import { Badge, Button, Panel } from "@workspace/ui";

export default function DashboardPage() {
	return (
		<div className="space-y-8">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h1 className="m-0 text-2xl font-semibold tracking-tight text-ink">
						Dashboard
					</h1>
					<p className="mt-2 mb-0 max-w-xl text-sm leading-relaxed text-muted">
						Orientation for the AI Agent Playground. Jump into a live session or
						review what each agent can do.
					</p>
				</div>
				<Link href="/playground">
					<Button>Open Playground</Button>
				</Link>
			</div>

			<section className="grid gap-3 sm:grid-cols-3">
				<Panel title="Runtime">
					<p className="m-0 text-sm leading-relaxed text-muted">
						Agents run on a Cloudflare Worker. Auth.js JWTs are verified at the
						edge before any model call.
					</p>
				</Panel>
				<Panel title="Streaming">
					<p className="m-0 text-sm leading-relaxed text-muted">
						Responses and tool invocations stream over the AI SDK UI-message
						protocol in real time.
					</p>
				</Panel>
				<Panel title="Providers">
					<p className="m-0 text-sm leading-relaxed text-muted">
						Workers AI (binding + REST), OpenAI, and Anthropic via a single
						model-spec string.
					</p>
				</Panel>
			</section>

			<section>
				<div className="mb-3 flex items-center justify-between">
					<h2 className="m-0 text-sm font-semibold tracking-tight text-ink">
						Agents
					</h2>
					<Link
						href="/dashboard/settings"
						className="text-xs text-muted hover:text-primary"
					>
						Settings →
					</Link>
				</div>
				<div className="grid gap-3 sm:grid-cols-3">
					{AGENT_LIST.map((agent) => (
						<div
							key={agent.id}
							className="rounded-[var(--radius)] border border-border bg-surface p-4"
						>
							<div className="flex items-center justify-between gap-2">
								<h3 className="m-0 text-sm font-semibold text-ink">
									{agent.name}
								</h3>
								<Badge tone="muted">{agent.id}</Badge>
							</div>
							<p className="mt-2 mb-0 text-sm leading-relaxed text-muted">
								{agent.description}
							</p>
							<p className="mt-3 mb-0 font-mono text-[10px] text-muted">
								tools: {agent.tools === "*" ? "*" : agent.tools.join(", ")}
							</p>
						</div>
					))}
				</div>
			</section>
		</div>
	);
}

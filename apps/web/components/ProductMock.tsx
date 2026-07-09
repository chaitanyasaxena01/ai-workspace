/**
 * Static product frame for the landing page (Linear / Vercel style product shot).
 * Decorative only — not interactive.
 */
export function ProductMock() {
	return (
		<div
			aria-hidden
			className="relative overflow-hidden rounded-xl border border-border bg-surface shadow-[var(--shadow)]"
		>
			{/* Window chrome */}
			<div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
				<span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
				<span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
				<span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
				<span className="ml-2 font-mono text-[10px] text-muted">
					playground · helper · llama-3.3
				</span>
				<span className="ml-auto rounded-md border border-accent/30 bg-accent-soft px-1.5 py-0.5 text-[10px] text-accent">
					streaming
				</span>
			</div>

			<div className="grid min-h-[280px] sm:min-h-[320px] grid-cols-[7.5rem_1fr] sm:grid-cols-[9.5rem_1fr]">
				{/* Rail */}
				<div className="space-y-2 border-r border-border bg-bg/60 p-2.5 sm:p-3">
					<div className="rounded-lg border border-primary/35 bg-primary-soft px-2 py-2">
						<p className="m-0 text-[11px] font-semibold text-ink">Helper</p>
						<p className="m-0 mt-0.5 text-[10px] text-muted">all tools</p>
					</div>
					<div className="rounded-lg border border-border px-2 py-2">
						<p className="m-0 text-[11px] font-semibold text-muted">Coder</p>
					</div>
					<div className="rounded-lg border border-border px-2 py-2">
						<p className="m-0 text-[11px] font-semibold text-muted">Researcher</p>
					</div>
				</div>

				{/* Chat */}
				<div className="flex flex-col gap-3 p-3 sm:p-4">
					<div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md border border-primary/25 bg-primary-soft px-3 py-2 text-[11px] leading-relaxed text-ink sm:text-xs">
						Use the calculator for (12+8)*3
					</div>

					<div className="max-w-[95%] space-y-2 rounded-2xl rounded-bl-md border border-border bg-bg/50 px-3 py-2">
						<div className="rounded-lg border border-accent/30 bg-accent-soft px-2 py-1.5">
							<p className="m-0 font-mono text-[10px] text-accent">
								⚙ calculator · done
							</p>
							<p className="m-0 mt-1 font-mono text-[10px] text-ink/80">
								{"{ expression: \"(12+8)*3\", result: 60 }"}
							</p>
						</div>
						<p className="m-0 text-[11px] leading-relaxed text-ink sm:text-xs">
							The result is <span className="font-semibold text-primary">60</span>.
						</p>
					</div>

					<div className="mt-auto flex items-center gap-2 rounded-lg border border-border bg-bg/40 px-2.5 py-2">
						<span className="flex-1 text-[11px] text-muted">Ask the agent…</span>
						<span className="rounded-md bg-primary px-2 py-1 text-[10px] font-medium text-primary-fg">
							Send
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

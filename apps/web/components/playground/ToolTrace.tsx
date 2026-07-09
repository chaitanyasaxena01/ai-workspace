"use client";

type ToolTraceProps = {
	type: string;
	// biome-ignore lint/suspicious/noExplicitAny: AI SDK tool part shapes vary
	part: any;
};

function pretty(value: unknown): string {
	if (value == null) return "—";
	if (typeof value === "string") return value;
	try {
		return JSON.stringify(value, null, 2);
	} catch {
		return String(value);
	}
}

export function ToolTrace({ type, part }: ToolTraceProps) {
	const toolName =
		part.toolName ??
		(type.startsWith("tool-") ? type.slice(5) : type.replace(/^tool-/, ""));
	const state = part.state as string | undefined;
	const input = part.input ?? part.args;
	const output = part.output ?? part.result;
	const errorText = part.errorText as string | undefined;

	const running =
		state === "input-streaming" ||
		state === "input-available" ||
		state === "partial-call" ||
		state === "call";

	return (
		<details
			className="group my-2 overflow-hidden rounded-[10px] border border-accent/30 bg-accent-soft open:bg-surface-2"
			open={Boolean(output) || Boolean(errorText)}
		>
			<summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2 text-xs font-medium text-accent select-none [&::-webkit-details-marker]:hidden">
				<span className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-accent/35 bg-bg/50 font-mono text-[10px] text-accent">
					⚙
				</span>
				<span className="font-mono text-[12px] text-ink">{toolName}</span>
				{running && !output && !errorText ? (
					<span className="text-muted animate-pulse">running…</span>
				) : null}
				{errorText ? (
					<span className="text-danger">error</span>
				) : output ? (
					<span className="text-success">done</span>
				) : null}
				<span className="ml-auto text-muted transition-transform group-open:rotate-180">
					▾
				</span>
			</summary>
			<div className="space-y-2 border-t border-border/80 px-3 py-2 font-mono text-[11px] leading-relaxed">
				{input != null ? (
					<div>
						<div className="mb-0.5 text-[10px] font-sans tracking-wide text-muted">
							Input
						</div>
						<pre className="m-0 overflow-x-auto whitespace-pre-wrap break-all text-ink/90">
							{pretty(input)}
						</pre>
					</div>
				) : null}
				{output != null ? (
					<div>
						<div className="mb-0.5 text-[10px] font-sans tracking-wide text-muted">
							Output
						</div>
						<pre className="m-0 overflow-x-auto whitespace-pre-wrap break-all text-primary">
							{pretty(output)}
						</pre>
					</div>
				) : null}
				{errorText ? <div className="text-danger">{errorText}</div> : null}
			</div>
		</details>
	);
}

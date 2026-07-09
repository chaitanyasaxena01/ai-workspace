"use client";

type EmptyStateProps = {
	onSuggest: (text: string) => void;
};

const SUGGESTIONS = [
	{
		label: "Run the calculator",
		text: "Use the calculator tool to compute (12+8)*3 and tell me the result.",
	},
	{
		label: "Ask for a code tip",
		text: "Explain when to use Promise.all vs sequential awaits in TypeScript.",
	},
	{
		label: "Smoke test",
		text: "Reply with exactly one word: pong",
	},
];

export function EmptyState({ onSuggest }: EmptyStateProps) {
	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-12 text-center">
			<div className="max-w-md">
				<h2 className="m-0 text-lg font-semibold tracking-tight text-ink">
					Start a conversation
				</h2>
				<p className="mt-2 mb-0 text-sm leading-relaxed text-muted">
					Pick an agent and model on the left, then send a message. Tool calls
					show up as amber traces in the stream.
				</p>
			</div>
			<div className="flex flex-wrap justify-center gap-2">
				{SUGGESTIONS.map((s) => (
					<button
						key={s.label}
						type="button"
						onClick={() => onSuggest(s.text)}
						className="cursor-pointer rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted transition-colors hover:border-primary/40 hover:bg-surface-2 hover:text-ink"
					>
						{s.label}
					</button>
				))}
			</div>
		</div>
	);
}

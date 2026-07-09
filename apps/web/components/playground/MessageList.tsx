"use client";

import type { UIMessage } from "ai";
import { useEffect, useRef } from "react";

import { ToolTrace } from "./ToolTrace";

type MessageListProps = {
	messages: UIMessage[];
	busy: boolean;
};

export function MessageList({ messages, busy }: MessageListProps) {
	const endRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
	}, [messages, busy]);

	if (messages.length === 0) {
		return null;
	}

	return (
		<div className="flex flex-col gap-4">
			{messages.map((m) => {
				const isUser = m.role === "user";
				return (
					<div
						key={m.id}
						className={[
							"flex max-w-[min(100%,42rem)] flex-col gap-1",
							isUser ? "items-end self-end" : "items-start self-start",
						].join(" ")}
					>
						<span className="px-1 text-[11px] font-medium text-muted">
							{isUser ? "You" : "Agent"}
						</span>
						<div
							className={[
								"rounded-2xl px-4 py-3 text-sm leading-relaxed",
								isUser
									? "rounded-br-md border border-primary/25 bg-primary-soft text-ink"
									: "w-full rounded-bl-md border border-border bg-surface text-ink",
							].join(" ")}
						>
							{m.parts.map((part, i) => {
								if (part.type === "text") {
									return (
										<p
											key={`${m.id}-t-${i}`}
											className="m-0 whitespace-pre-wrap"
										>
											{part.text}
										</p>
									);
								}
								if (
									part.type.startsWith("tool-") ||
									part.type === "dynamic-tool"
								) {
									return (
										<ToolTrace
											key={`${m.id}-tool-${i}`}
											type={part.type}
											part={part}
										/>
									);
								}
								if (part.type === "reasoning") {
									const text =
										"text" in part && typeof part.text === "string"
											? part.text
											: "";
									if (!text) return null;
									return (
										<details
											key={`${m.id}-r-${i}`}
											className="my-1 text-xs text-muted"
										>
											<summary className="cursor-pointer">Reasoning</summary>
											<p className="mt-1 mb-0 whitespace-pre-wrap opacity-80">
												{text}
											</p>
										</details>
									);
								}
								return null;
							})}
						</div>
					</div>
				);
			})}
			{busy ? (
				<div className="flex items-center gap-2 self-start px-1 text-xs text-muted">
					<span className="relative flex h-2 w-2">
						<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-40" />
						<span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
					</span>
					Agent working…
				</div>
			) : null}
			<div ref={endRef} />
		</div>
	);
}

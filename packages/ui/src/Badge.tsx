import type { HTMLAttributes, ReactNode } from "react";

type Tone = "default" | "primary" | "accent" | "muted" | "danger";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
	children: ReactNode;
	tone?: Tone;
};

const toneClass: Record<Tone, string> = {
	default: "bg-surface-2 text-muted border-border",
	primary: "bg-primary-soft text-primary border-primary/25",
	accent: "bg-accent-soft text-accent border-accent/30",
	muted: "bg-transparent text-muted border-border",
	danger: "bg-danger-soft text-danger border-danger/25",
};

export function Badge({
	children,
	tone = "default",
	className = "",
	...props
}: BadgeProps) {
	return (
		<span
			className={[
				"inline-flex items-center gap-1 rounded-md border px-2 py-0.5",
				"text-[11px] font-medium tracking-wide",
				toneClass[tone],
				className,
			]
				.filter(Boolean)
				.join(" ")}
			{...props}
		>
			{children}
		</span>
	);
}

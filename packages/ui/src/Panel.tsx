import type { HTMLAttributes, ReactNode } from "react";

type PanelProps = HTMLAttributes<HTMLDivElement> & {
	children: ReactNode;
	title?: string;
	description?: string;
	padded?: boolean;
};

export function Panel({
	children,
	title,
	description,
	padded = true,
	className = "",
	...props
}: PanelProps) {
	return (
		<div
			className={[
				"rounded-[var(--radius)] border border-border bg-surface shadow-[var(--shadow)]",
				padded ? "p-5" : "",
				className,
			]
				.filter(Boolean)
				.join(" ")}
			{...props}
		>
			{(title || description) && (
				<div className={children ? "mb-4" : ""}>
					{title ? (
						<h3 className="m-0 text-sm font-semibold tracking-tight text-ink">
							{title}
						</h3>
					) : null}
					{description ? (
						<p className="mt-1 mb-0 text-sm text-muted leading-relaxed max-w-[65ch]">
							{description}
						</p>
					) : null}
				</div>
			)}
			{children}
		</div>
	);
}

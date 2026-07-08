import type { HTMLAttributes, ReactNode } from "react";

type PanelProps = HTMLAttributes<HTMLDivElement> & {
	children: ReactNode;
};

export function Panel({ children, ...props }: PanelProps) {
	return (
		<div
			style={{
				border: "1px solid #333",
				borderRadius: 12,
				padding: 16,
				...props.style,
			}}
			{...props}
		>
			{children}
		</div>
	);
}

import type { ReactNode } from "react";

import { AppHeader } from "./AppHeader";

type AppShellProps = {
	children: ReactNode;
	/** Constrain content width (default true). Playground uses full width. */
	contained?: boolean;
	className?: string;
};

export function AppShell({
	children,
	contained = true,
	className = "",
}: AppShellProps) {
	return (
		<div className="flex min-h-screen flex-col">
			<AppHeader />
			<main
				className={[
					"flex-1 w-full",
					contained ? "mx-auto max-w-6xl px-4 py-8 sm:px-6" : "",
					className,
				]
					.filter(Boolean)
					.join(" ")}
			>
				{children}
			</main>
		</div>
	);
}

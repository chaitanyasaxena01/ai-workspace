"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@workspace/ui";

const NAV = [
	{ href: "/playground", label: "Playground" },
	{ href: "/dashboard", label: "Dashboard" },
];

export function AppHeader() {
	const pathname = usePathname();
	const { data: session, status } = useSession();
	const signedIn = Boolean(session?.user);

	return (
		<header className="sticky top-0 z-[var(--z-sticky)] border-b border-border/90 bg-bg/85 backdrop-blur-md">
			<div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
				<div className="flex min-w-0 items-center gap-6">
					<Link href="/" className="group flex shrink-0 items-center gap-2.5">
						<span
							aria-hidden
							className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-[11px] font-bold text-primary-fg"
						>
							AI
						</span>
						<span className="text-sm font-semibold tracking-tight text-ink transition-colors group-hover:text-primary">
							Agent Playground
						</span>
					</Link>

					<nav className="hidden items-center gap-1 sm:flex" aria-label="Main">
						{NAV.map((item) => {
							const active =
								pathname === item.href || pathname.startsWith(`${item.href}/`);
							return (
								<Link
									key={item.href}
									href={item.href}
									className={[
										"rounded-lg px-3 py-1.5 text-sm transition-colors",
										active
											? "bg-surface-2 text-ink"
											: "text-muted hover:bg-surface hover:text-ink",
									].join(" ")}
								>
									{item.label}
								</Link>
							);
						})}
					</nav>
				</div>

				<div className="flex shrink-0 items-center gap-2">
					{status === "loading" ? (
						<span className="text-xs text-muted" aria-live="polite">
							…
						</span>
					) : signedIn ? (
						<>
							<span className="hidden max-w-[140px] truncate text-xs text-muted md:inline">
								{session?.user?.email ?? session?.user?.name}
							</span>
							{pathname === "/" || pathname.startsWith("/dashboard") ? (
								<Link href="/playground">
									<Button size="sm">Playground</Button>
								</Link>
							) : null}
							<Button
								variant="ghost"
								size="sm"
								onClick={() => signOut({ callbackUrl: "/" })}
							>
								Sign out
							</Button>
						</>
					) : (
						<>
							{pathname !== "/login" ? (
								<Link href="/login">
									<Button variant="ghost" size="sm">
										Sign in
									</Button>
								</Link>
							) : null}
							<Link href="/login?callbackUrl=/playground">
								<Button size="sm">Get started</Button>
							</Link>
						</>
					)}
				</div>
			</div>
		</header>
	);
}

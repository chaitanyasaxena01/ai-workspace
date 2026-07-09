"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

import { Button, Panel } from "@workspace/ui";

export default function SettingsPage() {
	const { data: session } = useSession();
	const workerUrl =
		process.env.NEXT_PUBLIC_WORKER_URL ?? "http://localhost:8787";
	const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

	return (
		<div className="max-w-xl space-y-6">
			<div>
				<h1 className="m-0 text-2xl font-semibold tracking-tight text-ink">
					Settings
				</h1>
				<p className="mt-2 mb-0 text-sm leading-relaxed text-muted">
					Read-only view of this demo environment. Secrets stay on the server
					and Worker bindings.
				</p>
			</div>

			<Panel title="Session">
				<dl className="m-0 grid gap-3 text-sm">
					<div className="flex justify-between gap-4">
						<dt className="text-muted">Email</dt>
						<dd className="m-0 truncate text-right font-medium text-ink">
							{session?.user?.email ?? "Not signed in"}
						</dd>
					</div>
					<div className="flex justify-between gap-4">
						<dt className="text-muted">User id</dt>
						<dd className="m-0 max-w-[60%] truncate text-right font-mono text-xs text-ink">
							{session?.user?.id ?? "—"}
						</dd>
					</div>
				</dl>
				<div className="mt-4">
					{session?.user ? (
						<Button
							variant="secondary"
							size="sm"
							onClick={() => signOut({ callbackUrl: "/" })}
						>
							Sign out
						</Button>
					) : (
						<Link href="/login">
							<Button variant="secondary" size="sm">
								Sign in
							</Button>
						</Link>
					)}
				</div>
			</Panel>

			<Panel title="Endpoints">
				<dl className="m-0 grid gap-3 text-sm">
					<div>
						<dt className="text-xs text-muted">App URL</dt>
						<dd className="m-0 mt-1 break-all font-mono text-xs text-ink">
							{appUrl}
						</dd>
					</div>
					<div>
						<dt className="text-xs text-muted">Worker URL</dt>
						<dd className="m-0 mt-1 break-all font-mono text-xs text-ink">
							{workerUrl}
						</dd>
					</div>
					<div>
						<dt className="text-xs text-muted">Agent proxy</dt>
						<dd className="m-0 mt-1 font-mono text-xs text-ink">
							/api/agent → Worker /v1/agent
						</dd>
					</div>
				</dl>
			</Panel>

			<p className="m-0 text-sm text-muted">
				<Link href="/dashboard" className="text-primary hover:underline">
					← Back to dashboard
				</Link>
			</p>
		</div>
	);
}

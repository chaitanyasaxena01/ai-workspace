"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { Badge, Button, Panel } from "@workspace/ui";

function LoginForm() {
	const router = useRouter();
	const params = useSearchParams();
	const callbackUrl = params.get("callbackUrl") ?? "/playground";
	const [email, setEmail] = useState("demo@playground.dev");
	const [password, setPassword] = useState("demo");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError(null);
		const res = await signIn("credentials", {
			email,
			password,
			redirect: false,
		});
		setLoading(false);
		if (res?.error) {
			setError("Sign in failed. Enter a non-empty email and try again.");
			return;
		}
		router.push(callbackUrl);
	}

	return (
		<Panel className="w-full max-w-md">
			<div className="mb-5">
				<Badge tone="primary">Demo auth</Badge>
				<h1 className="mt-3 mb-1 text-xl font-semibold tracking-tight text-ink">
					Sign in
				</h1>
				<p className="m-0 max-w-[42ch] text-sm leading-relaxed text-muted">
					Portfolio demo — any non-empty email works. Auth.js issues a JWT; the
					Worker verifies it before agents run.
				</p>
			</div>

			<form onSubmit={onSubmit} className="flex flex-col gap-4">
				<label className="flex flex-col gap-1.5 text-sm">
					<span className="text-muted">Email</span>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						autoComplete="email"
						required
						className="field"
					/>
				</label>
				<label className="flex flex-col gap-1.5 text-sm">
					<span className="text-muted">Password</span>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						autoComplete="current-password"
						className="field"
					/>
				</label>

				{error ? (
					<p
						role="alert"
						className="m-0 rounded-lg border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger"
					>
						{error}
					</p>
				) : null}

				<Button type="submit" disabled={loading} className="w-full">
					{loading ? "Signing in…" : "Continue to playground"}
				</Button>
			</form>

			<p className="mt-5 mb-0 text-center text-sm text-muted">
				<Link href="/" className="text-primary hover:underline">
					← Back home
				</Link>
			</p>
		</Panel>
	);
}

export default function LoginPage() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
			<div className="mb-8 flex items-center gap-2.5">
				<span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-fg">
					AI
				</span>
				<span className="text-sm font-semibold tracking-tight text-ink">
					Agent Playground
				</span>
			</div>
			<Suspense fallback={<p className="text-sm text-muted">Loading sign-in…</p>}>
				<LoginForm />
			</Suspense>
		</main>
	);
}

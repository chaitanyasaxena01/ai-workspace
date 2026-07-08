"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { Button } from "@workspace/ui";

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
			setError("Sign in failed. Try again.");
			return;
		}
		router.push(callbackUrl);
	}

	return (
		<form
			onSubmit={onSubmit}
			style={{
				display: "flex",
				flexDirection: "column",
				gap: 12,
				width: 320,
				padding: 24,
				border: "1px solid #333",
				borderRadius: 12,
			}}
		>
			<h2>Sign in</h2>
			<label>
				Email
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					style={{ width: "100%" }}
				/>
			</label>
			<label>
				Password
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					style={{ width: "100%" }}
				/>
			</label>
			{error ? <p style={{ color: "red" }}>{error}</p> : null}
			<Button type="submit" disabled={loading}>
				{loading ? "Signing in…" : "Sign in"}
			</Button>
		</form>
	);
}

export default function LoginPage() {
	return (
		<main
			style={{
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Suspense fallback={<p>Loading…</p>}>
				<LoginForm />
			</Suspense>
		</main>
	);
}

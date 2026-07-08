import Link from "next/link";

import { Button } from "@workspace/ui";

export default function Home() {
	return (
		<main
			style={{
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				gap: 24,
			}}
		>
			<h1>AI Agent Playground</h1>
			<p>Pick an agent, chat, and watch it think → call tools → respond.</p>
			<div style={{ display: "flex", gap: 12 }}>
				<Link href="/playground">
					<Button>Open Playground</Button>
				</Link>
				<Link href="/login">
					<Button>Sign in</Button>
				</Link>
			</div>
		</main>
	);
}

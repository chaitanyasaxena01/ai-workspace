import Link from "next/link";

export default function DashboardPage() {
	return (
		<div>
			<h1>Dashboard</h1>
			<p>Welcome to the AI Agent Playground dashboard.</p>
			<nav style={{ marginTop: 16, display: "flex", gap: 12 }}>
				<Link href="/dashboard/settings">⚙️ Settings</Link>
				<Link href="/playground">🤖 Playground</Link>
			</nav>
		</div>
	);
}

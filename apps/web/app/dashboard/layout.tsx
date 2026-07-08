export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div
			style={{
				border: "6px solid blue",
				padding: "20px",
			}}
		>
			<h2>🔵 Dashboard Layout</h2>

			{children}
		</div>
	);
}

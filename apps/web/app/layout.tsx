export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body
				style={{
					padding: "30px",
					border: "6px solid red",
					margin: 0,
				}}
			>
				<h1>🔴 Root Layout</h1>

				{children}
			</body>
		</html>
	);
}

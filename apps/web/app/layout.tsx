import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";

import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-geist-mono",
});

export const metadata: Metadata = {
	title: {
		default: "AI Agent Playground",
		template: "%s · AI Agent Playground",
	},
	description:
		"Edge-first multi-agent playground: pick an agent, stream tool calls, and run models on Cloudflare Workers with Auth.js JWT auth.",
	openGraph: {
		title: "AI Agent Playground",
		description:
			"Watch agents think → call tools → respond. Next.js + Cloudflare Worker + Vercel AI SDK.",
		type: "website",
	},
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
			<body className="min-h-screen bg-bg font-sans text-ink antialiased">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}

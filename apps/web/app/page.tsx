import Link from "next/link";

import { auth } from "@workspace/auth";
import { Badge, Button, Panel } from "@workspace/ui";

import { AppShell } from "../components/AppShell";
import { HomeCta } from "../components/HomeCta";
import { ProductMock } from "../components/ProductMock";

const PATH = [
	{
		title: "Next.js UI",
		body: "Pick an agent and model. Chat streams over the AI SDK UI-message protocol.",
	},
	{
		title: "Auth.js JWT",
		body: "Session cookie becomes a signed JWT. The Worker verifies it before any LLM call.",
	},
	{
		title: "Cloudflare Worker",
		body: "Hono edge runtime runs streamText with tools on Workers AI and KV.",
	},
	{
		title: "Tools & stream",
		body: "Calculator, web fetch, notes — multi-step tool use streams back live.",
	},
];

const CAPS = [
	{
		title: "Multi-agent",
		body: "Researcher, Coder, and Helper — each with its own system prompt and tool allow-list.",
	},
	{
		title: "Multi-provider",
		body: "Workers AI binding, OpenAI, and Anthropic via a single model-spec string.",
	},
	{
		title: "Live tool traces",
		body: "See tool name, arguments, and results inline while the agent is still streaming.",
	},
	{
		title: "Edge-first",
		body: "Agent runtime on Cloudflare Workers; UI on Vercel. JWT gated at the edge.",
	},
];

const STACK = [
	"Next.js 16",
	"Cloudflare Workers",
	"Hono",
	"Auth.js",
	"Vercel AI SDK",
	"Workers AI",
	"Turborepo",
	"TypeScript",
];

export default async function Home() {
	const session = await auth();
	const signedIn = Boolean(session?.user);

	return (
		<AppShell>
			{/* Hero — Linear / Vercel style: sharp outcome + product frame */}
			<section className="grid items-center gap-10 pb-16 pt-6 sm:pt-10 lg:grid-cols-[1fr_1.05fr] lg:gap-12 lg:pb-20">
				<div className="flex max-w-xl flex-col gap-5">
					<div className="flex flex-wrap items-center gap-2">
						<span className="text-sm font-medium text-primary">
							Edge agent console
						</span>
						{signedIn ? (
							<Badge tone="primary">Signed in</Badge>
						) : (
							<Badge tone="muted">Demo auth</Badge>
						)}
					</div>

					<h1 className="m-0 text-[2.15rem] font-semibold leading-[1.1] tracking-tight text-ink sm:text-[2.75rem]">
						Agents that think, call tools, and stream — at the edge.
					</h1>

					<p className="m-0 max-w-[42ch] text-base leading-relaxed text-muted sm:text-lg">
						{signedIn ? (
							<>
								Welcome back
								{session?.user?.name || session?.user?.email
									? `, ${session.user.name ?? session.user.email}`
									: ""}
								. Jump into the playground or review agents on the dashboard.
							</>
						) : (
							<>
								Next.js UI, Cloudflare Worker runtime, Auth.js JWT gate — a
								portfolio-ready multi-agent playground with real tool traces.
							</>
						)}
					</p>

					<HomeCta signedIn={signedIn} />

					{!signedIn ? (
						<p className="m-0 text-xs text-muted">
							Any email works for demo sign-in. No credit card, no OAuth setup.
						</p>
					) : null}
				</div>

				<div className="relative">
					<div
						aria-hidden
						className="pointer-events-none absolute -inset-4 -z-10 rounded-2xl bg-primary/5 blur-2xl sm:-inset-6"
					/>
					<ProductMock />
				</div>
			</section>

			{/* Architecture strip */}
			<section className="border-t border-border py-14">
				<div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
					<div className="max-w-lg">
						<h2 className="m-0 text-xl font-semibold tracking-tight text-ink">
							How a request moves
						</h2>
						<p className="mt-2 mb-0 text-sm leading-relaxed text-muted">
							Same path recruiters care about: browser → JWT → edge worker →
							model + tools → stream.
						</p>
					</div>
					{signedIn ? (
						<Link href="/playground" className="text-sm text-primary hover:underline">
							Try it live →
						</Link>
					) : (
						<Link
							href="/login?callbackUrl=/playground"
							className="text-sm text-primary hover:underline"
						>
							Sign in to try →
						</Link>
					)}
				</div>

				<div className="grid gap-px overflow-hidden rounded-[var(--radius)] border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
					{PATH.map((item) => (
						<div key={item.title} className="bg-surface p-4 sm:p-5">
							<p className="m-0 text-sm font-semibold text-ink">{item.title}</p>
							<p className="mt-2 mb-0 text-sm leading-relaxed text-muted">
								{item.body}
							</p>
						</div>
					))}
				</div>
			</section>

			{/* Capabilities */}
			<section className="border-t border-border py-14">
				<div className="mb-8 max-w-lg">
					<h2 className="m-0 text-xl font-semibold tracking-tight text-ink">
						What you can demo
					</h2>
					<p className="mt-2 mb-0 text-sm leading-relaxed text-muted">
						Screenshot-ready surfaces: agent rail, model catalog, streaming
						bubbles, expandable tool traces.
					</p>
				</div>

				<div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
					<Panel className="!border-primary/25 !bg-primary-soft">
						<p className="m-0 text-xs font-medium text-primary">Signature</p>
						<h3 className="mt-2 mb-0 text-base font-semibold text-ink">
							{CAPS[2]!.title}
						</h3>
						<p className="mt-2 mb-0 max-w-[50ch] text-sm leading-relaxed text-muted">
							{CAPS[2]!.body} This is the product moment — not a chat bubble with
							a spinner.
						</p>
					</Panel>
					<div className="flex flex-col gap-3">
						{CAPS.filter((_, i) => i !== 2).map((item) => (
							<div
								key={item.title}
								className="rounded-[var(--radius)] border border-border bg-surface px-4 py-3"
							>
								<p className="m-0 text-sm font-semibold text-ink">{item.title}</p>
								<p className="mt-1 mb-0 text-sm leading-relaxed text-muted">
									{item.body}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Stack + final CTA */}
			<section className="border-t border-border py-12 pb-16">
				<p className="m-0 text-sm text-muted">Built with</p>
				<div className="mt-4 flex flex-wrap gap-2">
					{STACK.map((s) => (
						<Badge key={s} tone="muted">
							{s}
						</Badge>
					))}
				</div>

				<div className="mt-10 flex flex-col items-start gap-4 rounded-[var(--radius)] border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p className="m-0 text-base font-semibold text-ink">
							{signedIn ? "Ready when you are" : "See the full loop in under a minute"}
						</p>
						<p className="mt-1 mb-0 text-sm text-muted">
							{signedIn
								? "Open the playground and run a tool-calling agent."
								: "Sign in with any email, pick Helper, try the calculator prompt."}
						</p>
					</div>
					{signedIn ? (
						<Link href="/playground">
							<Button>Open Playground</Button>
						</Link>
					) : (
						<Link href="/login?callbackUrl=/playground">
							<Button>Get started</Button>
						</Link>
					)}
				</div>
			</section>
		</AppShell>
	);
}

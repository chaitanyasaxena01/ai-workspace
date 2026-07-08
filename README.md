# AI Agent Playground

An **AI Agent Playground** where you pick an agent (system prompt + tools), chat with it, and watch it **think → call tools → respond** in real time. The agent runtime runs on a **Cloudflare Worker** while the UI is deployed on **Vercel**, giving you an edge-first, multi-provider playground built on the **Vercel AI SDK** and **cloudflare ai gateway** also.

Authentication is handled by **Auth.js** — every request to the agent runtime is gated by a verifiable JWT.

---

## ✨ Features

- **Pick an agent** — Researcher, Coder, and Helper, each with its own system prompt and allowed tool set.
- **Live tool use** — agents can call a calculator, fetch web pages, and save/recall notes (persisted in Cloudflare KV).
- **Real-time streaming** — token-by-token responses and tool invocations stream over the AI SDK UI-message protocol.
- **Multi-provider** — OpenAI, Anthropic, and Cloudflare Workers AI via a single model-spec string (`"openai:gpt-4o-mini"`).
- **Secure by default** — Auth.js issues a JWT; the Cloudflare Worker verifies it at the edge before running any agent.
- **Monorepo** — shared, source-exported packages (`auth`, `ai`, `ui`, `env`) consumed by both runtimes with no build step.

---

## 🧱 Architecture

```
┌──────────────┐      HTTPS (Bearer JWT)      ┌─────────────────────────┐
│  Next.js 16  │  ─────────────────────────▶  │   Cloudflare Worker     │
│  (Vercel)    │   POST /v1/agent  (proxy)     │   (Hono + AI SDK)       │
│  UI + Auth   │  ◀─────────────────────────  │   streamText → LLM      │
└──────────────┘   UI-message stream           └─────────────────────────┘
```

| Layer        | Path            | Responsibility                                                        |
| ------------ | --------------- | --------------------------------------------------------------------- |
| Web app      | `apps/web`      | Next.js playground, Auth.js, `/api/agent` proxy to the Worker.       |
| Agent runtime| `apps/api`      | Hono Worker: verify JWT → run `streamText` → stream the response.    |
| Auth         | `packages/auth` | Auth.js config + runtime-agnostic JWT verification for the Worker.   |
| AI           | `packages/ai`   | Provider resolver, agent definitions, and tool implementations.      |
| UI           | `packages/ui`   | Shared React components (Button, Panel).                             |
| Env          | `packages/env`  | Typed, zod-validated environment schemas for both runtimes.          |

---

## 🛠 Tech Stack

- **Monorepo**: Turborepo + pnpm workspaces
- **Web**: Next.js 16 (App Router), React 19, Tailwind CSS v4
- **Agent runtime**: Cloudflare Workers, Hono
- **AI**: Vercel AI SDK (`ai` v5) — OpenAI, Anthropic, Cloudflare
- **Auth**: Auth.js (NextAuth v5), JWT session strategy
- **Language**: TypeScript (strict)

---

## 📦 Project Structure

```
.
├── apps/
│   ├── web/        # Next.js playground (Vercel)
│   └── api/        # Cloudflare Worker agent runtime (Hono)
├── packages/
│   ├── auth/       # @workspace/auth  — Auth.js + JWT verify
│   ├── ai/         # @workspace/ai    — providers, agents, tools
│   ├── ui/         # @workspace/ui    — shared components
│   ├── env/        # @workspace/env   — typed env schemas
│   └── typescript-config/
├── .github/workflows/ci.yml
├── turbo.json
└── pnpm-workspace.yaml
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+
- A Cloudflare account (for the Worker + KV)
- API keys for at least one provider (OpenAI / Anthropic)

### Install

```bash
pnpm install
```

### Configure environment

```bash
cp .env.example apps/web/.env.local      # web env (AUTH_SECRET, NEXT_PUBLIC_WORKER_URL, …)
cp .env.example apps/api/.dev.vars       # worker env (AUTH_SECRET, provider keys, …)
```

> For production Worker secrets use `wrangler secret put` instead of `.dev.vars`.

Generate `AUTH_SECRET` with:

```bash
npx auth secret
```

### Run locally

```bash
pnpm dev
```

- Web (Vite/Next dev): http://localhost:3000
- Worker (wrangler dev): http://localhost:8787

Sign in at `/login` (demo credentials are accepted by the Credentials provider), then open `/playground`.

### Build & typecheck

```bash
pnpm build
pnpm typecheck
pnpm lint
```

---

## 🌍 Deployment

| App    | Platform     | Command              |
| ------ | ------------ | -------------------- |
| `web`  | Vercel       | `pnpm deploy:web`    |
| `api`  | Cloudflare   | `pnpm deploy:api`    |

For the Worker, create the KV namespace and set its id in `apps/api/wrangler.toml`:

```bash
npx wrangler kv namespace create AGENT_KV
```

CI runs `install → lint → typecheck → build` on every push/PR (see `.github/workflows/ci.yml`).

---

## 📄 License

[MIT](./LICENSE)

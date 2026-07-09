# AI Agent Playground

## Summary

An edge-first multi-agent playground: pick an agent, stream tool calls, and run LLMs on a Cloudflare Worker with Auth.js JWT verification. Built as a Turborepo monorepo (Next.js UI + Hono Worker).

## Users

- Engineers and students demoing agent tooling
- Recruiters / hiring managers reviewing a portfolio project
- Developers exploring multi-provider + tool-use patterns

## Jobs to be done

1. Sign in quickly (demo credentials)
2. Choose agent + model
3. Chat and **see** tool traces (input → output)
4. Understand the architecture (resume-worthy narrative)

## Surfaces

| Route | Register | Job |
|-------|----------|-----|
| `/` | brand (landing) | Explain product + CTA |
| `/login` | product | Auth gate |
| `/playground` | product | Primary task surface |
| `/dashboard` | product | Orientation + agent overview |
| `/dashboard/settings` | product | Session + endpoints |

## Platform

web

## Register

mixed — marketing landing + authenticated product UI

## Constraints

- Keep API contracts (`/api/agent`, Worker `/v1/agent`, model-spec strings)
- No fake analytics
- Demo auth only (any email)
- Dark product UI justified: evening coding / live demo under dim ambient light

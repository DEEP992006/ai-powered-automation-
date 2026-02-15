# 05 — Technology Stack

---

## 5.1 Stack Overview (Quick Reference)

| Layer | Technology | You Know It? |
|-------|-----------|:------------:|
| **Framework** | Next.js 15 (App Router) | ✅ Yes |
| **Language** | TypeScript | ✅ Yes |
| **UI Library** | shadcn/ui + Tailwind CSS | Learn (easy) |
| **Workflow Canvas** | React Flow (`@xyflow/react`) | Learn (core feature) |
| **State Management** | Zustand | ✅ Yes |
| **Forms** | React Hook Form + Zod | Learn (easy) |
| **Data Fetching** | TanStack Query (React Query) | Learn (easy) |
| **Real-Time** | WebSocket (Socket.io or native WS) | ✅ Yes |
| **Code Editor** | Monaco Editor (for Code node) | Learn (easy) |
| **Charts** | Recharts | Learn (easy) |
| **API** | Next.js API Routes + tRPC | tRPC is new (learn) |
| **Database** | PostgreSQL | ✅ Yes |
| **ORM** | Drizzle ORM | ✅ Yes |
| **DB Hosting** | Neon (free tier) OR Supabase (free tier) | Learn (easy) |
| **Cache** | Redis (Upstash — free tier) | ✅ Yes |
| **Queue** | BullMQ + Redis | ✅ Yes |
| **Auth** | NextAuth.js v5 (Auth.js) | ✅ Yes |
| **Payments** | Stripe | Learn (medium) |
| **File Storage** | Cloudflare R2 (free tier) or S3 | Learn (easy) |
| **AI / LLM** | OpenAI API (GPT-4o-mini for cost) + LangChain | ✅ LangChain |
| **Email** | Resend (free tier 100/day) | Learn (easy) |
| **Containerization** | Docker + Docker Compose | ✅ Yes |
| **Hosting** | Decide later (Vercel/Railway/VPS) | — |
| **CI/CD** | GitHub Actions | Learn (easy) |
| **Monitoring** | Sentry (free tier) | Learn (easy) |
| **Analytics** | PostHog (free tier) or Plausible | Learn (easy) |

---

## 5.2 Frontend Stack — Detailed Decisions

### Next.js 15 (App Router)

**Why:** You already know it. Best React meta-framework. Handles routing, SSR, API routes, middleware.

| Consideration | Detail |
|--------------|--------|
| **Rendering strategy** | App pages (dashboard, builder) = Client-side rendering (SPA behavior). Public pages (landing, pricing) = Server-side rendering (SEO). |
| **API routes** | Use Next.js Route Handlers (`/app/api/...`) for backend API |
| **Middleware** | Auth checks, rate limiting, redirects |
| **Why not separate backend?** | For MVP, keep everything in one Next.js app. Simpler deployment, shared types. Split later if needed. |

### shadcn/ui + Tailwind CSS

**Why shadcn/ui over alternatives:**

| Library | Pros | Cons | Verdict |
|---------|------|------|---------|
| **shadcn/ui** | Copy-paste components (full control), Tailwind-based, Radix primitives, beautiful defaults, no package dependency | Need to add components manually | ✅ Pick this |
| Material UI | Large component library, enterprise feel | Heavy bundle, opinionated styling, hard to customize | ❌ |
| Chakra UI | Good DX, accessible | Different styling approach than Tailwind | ❌ |
| Ant Design | Massive component library | Very opinionated Chinese design system, heavy | ❌ |

**shadcn/ui components you'll use:**
- Button, Input, Select, Dialog, Dropdown Menu, Toast, Card, Table, Tabs, Badge, Avatar, Command (search), Sheet (slide-over), Tooltip, Popover, Skeleton (loading), Alert

**Learning time:** 1-2 days. It's just Tailwind + Radix. Read docs at ui.shadcn.com.

### React Flow (`@xyflow/react`)

**Why:** The only mature React library for node-based editors. Built for exactly this use case.

| Consideration | Detail |
|--------------|--------|
| **Version** | @xyflow/react (v12+, latest) |
| **License** | MIT for core. Pro features (paid) not needed for MVP. |
| **What it gives you** | Canvas, nodes, edges, handles, minimap, controls, zoom/pan, drag-drop, selection, auto-layout hooks |
| **What you build on top** | Custom node components, custom edge styles, node config panel, data flow logic |
| **Learning time** | 1 week dedicated. Work through all examples on reactflow.dev. |
| **Key concepts** | Nodes array, Edges array, `onNodesChange`, `onEdgesChange`, `onConnect`, custom node types |

**Resources:**
- Official docs: https://reactflow.dev
- Examples: https://reactflow.dev/examples
- Pro examples: https://pro.reactflow.dev (inspiration, don't need to buy)

### Zustand (State Management)

**Why:** You already know it. Lightweight, simple, perfect for React Flow state.

**Stores to create:**
| Store | Purpose |
|-------|---------|
| `useWorkflowStore` | Nodes, edges, selected node, workflow metadata, dirty state |
| `useAuthStore` | Current user, session info |
| `useConnectionStore` | Connected OAuth services |
| `useUIStore` | Sidebar state, modal state, theme, notifications |
| `useExecutionStore` | Current test execution state, live execution data |

### React Hook Form + Zod

**Why RHF:** Best form library for React. Minimal re-renders, easy validation.
**Why Zod:** Type-safe schema validation. Works with TypeScript, Drizzle, and tRPC.

**Where used:**
- Signup/login forms
- Node configuration forms (dynamic fields)
- Settings forms
- Contact form

**Learning time:** 2-3 hours. Read docs at react-hook-form.com and zod.dev.

### TanStack Query (React Query)

**Why:** Smart data fetching with caching, refetching, optimistic updates, loading/error states.

| vs Alternative | Why TanStack Query wins |
|---------------|----------------------|
| vs SWR | More features (mutations, invalidation, devtools) |
| vs plain fetch | No manual loading/error/cache state management |
| vs Redux Toolkit Query | Simpler, no Redux dependency |

**Where used:**
- Fetching workflows list
- Fetching executions
- Fetching connections
- All API calls (GET = query, POST/PUT/DELETE = mutation)

**Learning time:** 3-4 hours. Read tanstack.com/query.

### WebSocket (Socket.io)

**Why Socket.io over native WS:**

| Feature | Socket.io | Native WS |
|---------|-----------|-----------|
| Auto-reconnect | ✅ Built-in | ❌ Manual |
| Rooms/namespaces | ✅ Built-in | ❌ Manual |
| Fallback (polling) | ✅ Built-in | ❌ No |
| Event-based | ✅ Built-in | ❌ Manual |

**Where used:**
- Live execution progress (nodes turning green/red in real-time)
- Dashboard stats auto-update
- Notifications

**You already know WebSocket.** Socket.io is a thin wrapper. Learning time: 2 hours.

### Monaco Editor

**Why:** VS Code's editor component. For the "Code" node where users write JavaScript.

**Where used:** Only in the Code (JavaScript) node's configuration panel.

**Learning time:** 1-2 hours for basic setup. Use `@monaco-editor/react` wrapper.

### Recharts

**Why:** Simple, composable, React-based charting. Good for dashboards.

**Where used:**
- Dashboard: Execution success/failure chart (bar/line)
- Dashboard: Executions over time
- Settings/Billing: Usage meter
- Admin: System metrics

**Learning time:** 1-2 hours. recharts.org.

---

## 5.3 Backend Stack — Detailed Decisions

### API: Next.js Route Handlers + tRPC

**Decision: Use tRPC for type-safe API calls.**

| Approach | Pros | Cons |
|----------|------|------|
| **tRPC** | End-to-end type safety (no API schema to maintain), auto-complete, fast DX | New to learn, coupled to TypeScript client |
| REST (plain) | Simple, universal | Manual types for requests/responses, no auto-complete |
| GraphQL | Flexible queries, great tooling | Overkill for solo dev, complex setup |

**Why tRPC:** You're using Next.js + TypeScript end-to-end. tRPC eliminates the need to define API contracts — your backend types ARE your frontend types. Massive DX win for a solo developer.

**Learning time:** 3-4 hours. Read trpc.io. Watch Theo's YouTube tutorials.

**Structure:**
- tRPC router per domain: `workflowRouter`, `executionRouter`, `connectionRouter`, `userRouter`, `billingRouter`
- Use with TanStack Query integration (built-in)

**Keep REST for:**
- Webhook endpoints (`/api/webhook/[id]`) — external services POST here
- OAuth callbacks (`/api/auth/callback/[provider]`)
- Public API (Post-MVP)

### PostgreSQL + Neon

**Why PostgreSQL:** You know it. Relational data (users → workflows → executions) fits perfectly.

**Why Neon hosting:**

| Option | Free Tier | Pros | Cons |
|--------|-----------|------|------|
| **Neon** | 0.5 GB storage, autoscaling | Serverless (scale to zero), branching, generous free tier | Cold starts (minor) |
| Supabase | 500 MB, 2 projects | Includes auth, storage, realtime | More opinionated, you already have NextAuth |
| Railway | $5 credit/mo | Simple, integrated | Limited free tier |
| Self-hosted | Unlimited | Full control | DevOps overhead, cost |

**Pick: Neon** — Best free tier for PostgreSQL, serverless fits $0-25/mo budget, scales when needed.

### Drizzle ORM

**Why:** You already know it. Type-safe, lightweight, fast. Perfect with PostgreSQL + TypeScript.

**Key patterns:**
- Schema defined in TypeScript files
- Migrations via `drizzle-kit`
- Zod schema generation for validation (`drizzle-zod`)
- Relations defined explicitly

### Redis — Upstash

**Why Upstash:**

| Option | Free Tier | Pros | Cons |
|--------|-----------|------|------|
| **Upstash** | 10K commands/day, 256MB | Serverless, HTTP-based (no connection limits), REST API | Rate limited on free |
| Railway Redis | $5 credit | Persistent | Uses your credit |
| Self-hosted | Unlimited | Full control | DevOps overhead |

**Pick: Upstash** — Serverless, free tier, works with BullMQ via `@upstash/redis` or standard ioredis.

**What to cache:**
- User session data
- Workflow definitions (avoid DB reads on every execution)
- Integration metadata (API schemas, available actions)
- Rate limiting counters
- AI response caching (same prompt → cached response)

### BullMQ (Job Queue)

**Why:** You already know it. Production-grade job queue on Redis.

**What runs in the queue:**
| Job Type | Description |
|----------|-------------|
| `workflow.execute` | Execute a workflow (triggered by webhook, schedule, or manual) |
| `workflow.step` | Execute a single step within a workflow |
| `integration.poll` | Poll service for new events (for polling-based triggers) |
| `oauth.refresh` | Refresh expiring OAuth tokens |
| `notification.send` | Send email/in-app notifications |
| `cleanup.executions` | Clean up old execution logs |

**Worker architecture:**
- Separate worker process (or Next.js edge function, or same process for MVP)
- For MVP: Run BullMQ workers in the same Node.js process
- For scale: Separate worker containers

### NextAuth.js v5 (Auth.js)

**Why:** You specified it. Handles OAuth, sessions, JWT.

**Providers for auth (login):**
- Google OAuth
- GitHub OAuth
- Email/Password (Credentials provider)

**Note:** NextAuth for USER AUTHENTICATION (login/signup). Separate OAuth flow for INTEGRATION CONNECTIONS (connecting Gmail for workflows ≠ logging in with Google).

**Session strategy:** JWT (stateless, no DB session table needed for MVP)

### Stripe (Payments)

**Why:** Industry standard. Has a generous test mode. Handles subscriptions, invoices, webhooks.

**What you need:**
- Stripe Checkout for subscription signup
- Customer Portal for managing subscriptions
- Webhooks for subscription events (created, updated, cancelled, payment failed)
- Products: 4 tiers (Free, Starter, Pro, Business)

**Learning time:** 3-4 hours. Read stripe.com/docs. Use `stripe` npm package.

### Resend (Email)

**Why:** Modern email API, great DX, free 100 emails/day.

| Option | Free Tier | Pros | Cons |
|--------|-----------|------|------|
| **Resend** | 100/day, 3K/month | Beautiful API, React Email templates, great DX | 100/day limit |
| SendGrid | 100/day | Industry standard | Complex dashboard |
| AWS SES | 62K/month (with EC2) | Cheapest at scale | Complex setup, need AWS |
| Nodemailer + SMTP | Unlimited | Free | Need SMTP server |

**Pick: Resend** — Best DX for MVP. Use React Email for templates. Upgrade later if needed.

**Emails to send:**
- Email verification
- Password reset
- Workflow failure notification
- Weekly usage report
- Welcome email
- Upgrade/payment confirmation

### File Storage — Cloudflare R2

**Why R2:**

| Option | Free Tier | Pros | Cons |
|--------|-----------|------|------|
| **Cloudflare R2** | 10 GB, 1M reads, 100K writes/month | S3-compatible, no egress fees, generous free | Newer service |
| AWS S3 | 5 GB (12 months) | Industry standard | Egress fees, free tier expires |
| Vercel Blob | 1 GB | Integrated with Vercel | Very limited |

**What to store:**
- Execution logs (large JSON outputs)
- User avatars
- Exported workflow files

**Learning time:** 1-2 hours. S3-compatible API (use `@aws-sdk/client-s3`).

---

## 5.4 AI Stack

### OpenAI API (GPT-4o-mini)

**Why GPT-4o-mini:**

| Model | Cost (input/output per 1M tokens) | Quality | Speed |
|-------|-----------------------------------|---------|-------|
| **GPT-4o-mini** | $0.15 / $0.60 | Good enough for workflow generation | Fast |
| GPT-4o | $2.50 / $10.00 | Best | Slower |
| Claude 3.5 Sonnet | $3.00 / $15.00 | Excellent | Medium |
| Claude 3.5 Haiku | $0.25 / $1.25 | Good | Fast |

**Strategy:**
- **Default: GPT-4o-mini** — 95% of requests. Cheap, fast, good enough.
- **Fallback: GPT-4o** — For complex workflows that GPT-4o-mini fails on. User can retry with "smarter model."
- **Budget:** At $0.15/1M input tokens, 1000 workflow generations ≈ $0.50-2.00/month.

### LangChain.js

**Why:** You already know LangChain. Use LangChain.js (TypeScript version).

**What to use LangChain for:**
| Component | Purpose |
|-----------|---------|
| **Chat models** | Wrapper around OpenAI API |
| **Prompt templates** | Structured prompts for workflow generation |
| **Output parsers** | Parse LLM output into structured workflow JSON |
| **Chains** | Sequential: understand user intent → generate workflow → validate |
| **Memory** | Chat conversation history in AI panel |

**What NOT to use LangChain for:**
- Don't over-engineer with agents/tools for MVP
- Don't use vector stores (no RAG needed for MVP)
- Keep it simple: prompt → structured output → validate

---

## 5.5 DevOps & Infrastructure

### Docker + Docker Compose (Development)

**Why:** You know it. Local dev environment with all services.

**docker-compose.yml services:**
- `app` — Next.js development server
- `postgres` — PostgreSQL database
- `redis` — Redis for cache + BullMQ
- `worker` — BullMQ worker process (can be same as app for MVP)

### GitHub Actions (CI/CD)

**Why:** Free for public repos, 2000 min/month for private. Integrated with GitHub.

**Pipeline:**
1. On PR: Lint → Type check → Tests
2. On merge to main: Build → Deploy to staging
3. On tag/release: Deploy to production

**Learning time:** 2-3 hours. Read docs.github.com/actions.

### Sentry (Error Monitoring)

**Why:** Free tier (5K events/month). Catches frontend + backend errors. Stack traces, user context.

**Learning time:** 1 hour. Install `@sentry/nextjs`, configure DSN.

### PostHog (Analytics)

**Why:** Free tier (1M events/month). Open-source. Self-hostable. Feature flags, session replay.

| vs Alternative | Why PostHog |
|---------------|------------|
| vs Google Analytics | More privacy-friendly, product analytics focus |
| vs Mixpanel | Free tier is much more generous |
| vs Plausible | PostHog has feature flags, funnels, retention |

**What to track:**
- Page views, signups, workflow created, execution run, integration connected, plan upgraded, feature usage

**Learning time:** 1-2 hours. Read posthog.com/docs.

---

## 5.6 Full Dependency List (package.json preview)

### Core
- `next`, `react`, `react-dom`, `typescript`

### UI
- `tailwindcss`, `@tailwindcss/postcss`
- shadcn/ui components (copied in, no package)
- `@xyflow/react` (React Flow)
- `@monaco-editor/react`
- `recharts`
- `lucide-react` (icons)
- `sonner` (toasts)
- `class-variance-authority`, `clsx`, `tailwind-merge`

### Data & State
- `zustand`
- `@tanstack/react-query`
- `react-hook-form`, `@hookform/resolvers`, `zod`

### Backend
- `drizzle-orm`, `drizzle-kit`, `drizzle-zod`
- `@neondatabase/serverless` or `postgres` (pg driver)
- `@trpc/server`, `@trpc/client`, `@trpc/react-query`, `@trpc/next`
- `bullmq`, `ioredis`
- `next-auth`
- `stripe`
- `resend`
- `@aws-sdk/client-s3` (for R2)

### AI
- `langchain`, `@langchain/openai`, `@langchain/core`

### Real-Time
- `socket.io`, `socket.io-client`

### DevOps & Monitoring
- `@sentry/nextjs`
- `posthog-js`

### Dev Tools
- `eslint`, `prettier`, `drizzle-kit`

---

## 5.7 What You Need to Learn (Priority Order)

| Tech | Priority | Time | When | Resources |
|------|----------|------|------|-----------|
| **React Flow** | 🔴 Critical | 1 week | Before building | reactflow.dev/learn |
| **tRPC** | 🔴 Critical | 3-4 hours | Before building | trpc.io/docs, Theo's YouTube |
| **shadcn/ui** | 🟡 High | 1-2 days | Before building | ui.shadcn.com |
| **React Hook Form + Zod** | 🟡 High | 2-3 hours | While building | react-hook-form.com |
| **TanStack Query** | 🟡 High | 3-4 hours | While building | tanstack.com/query |
| **Stripe** | 🟡 High | 3-4 hours | Phase 3 | stripe.com/docs |
| **Neon (PostgreSQL hosting)** | 🟢 Easy | 1 hour | Setup phase | neon.tech/docs |
| **Upstash (Redis hosting)** | 🟢 Easy | 1 hour | Setup phase | upstash.com/docs |
| **Resend** | 🟢 Easy | 1 hour | While building | resend.com/docs |
| **Sentry** | 🟢 Easy | 1 hour | After MVP core | docs.sentry.io |
| **PostHog** | 🟢 Easy | 1 hour | After MVP core | posthog.com/docs |
| **GitHub Actions** | 🟢 Easy | 2 hours | Before deploy | docs.github.com/actions |
| **Cloudflare R2** | 🟢 Easy | 1-2 hours | When needed | developers.cloudflare.com |

**Total new learning: ~30-40 hours spread across 2-3 weeks.**
Most are thin wrappers around concepts you already know.

---

*Next: [06-integrations.md](06-integrations.md) — All integrations plan*

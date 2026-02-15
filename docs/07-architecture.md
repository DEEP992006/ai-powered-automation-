# 07 — System Architecture & Database Schema

---

## 7.1 Architecture Decision: Modular Monolith

**Decision: Start with a Modular Monolith inside Next.js, NOT microservices.**

| Approach | Verdict | Reasoning |
|----------|---------|-----------|
| **Modular Monolith** | ✅ Pick this | Single deployment, shared types, fast development. You're a solo dev. Split later if needed. |
| Microservices | ❌ Not now | Over-engineering for MVP. Adds network complexity, deployment overhead, debugging difficulty. |
| Serverless functions | ❌ Not now | Cold starts hurt execution latency. BullMQ needs persistent connection. |

**Architecture:** One Next.js app with clearly separated internal modules. If a module grows too large, extract it into a separate service.

---

## 7.2 High-Level Architecture

```
USERS (Browser)
    │
    │  HTTPS
    │
┌───▼───────────────────────────────────────────┐
│              NEXT.JS APPLICATION               │
│                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐ │
│  │  PAGES   │  │  tRPC    │  │  API ROUTES  │ │
│  │ (React)  │  │  ROUTER  │  │ (Webhooks,   │ │
│  │          │  │          │  │  OAuth,       │ │
│  │ Dashboard│  │ Workflow │  │  Stripe)      │ │
│  │ Builder  │  │ Execute  │  │              │ │
│  │ Settings │  │ Connect  │  │              │ │
│  └──────────┘  └────┬─────┘  └──────┬───────┘ │
│                     │               │          │
│  ┌──────────────────▼───────────────▼────────┐ │
│  │           SERVICE LAYER                    │ │
│  │                                            │ │
│  │  WorkflowService   ExecutionService        │ │
│  │  ConnectionService  IntegrationService     │ │
│  │  UserService        BillingService         │ │
│  │  AIService          NotificationService    │ │
│  └──────────────────┬────────────────────────┘ │
│                     │                          │
│  ┌──────────────────▼────────────────────────┐ │
│  │           DATA LAYER                       │ │
│  │                                            │ │
│  │  Drizzle ORM ──→ PostgreSQL (Neon)        │ │
│  │  Redis Client ──→ Redis (Upstash)         │ │
│  │  S3 Client ────→ Cloudflare R2            │ │
│  └───────────────────────────────────────────┘ │
│                                                │
│  ┌───────────────────────────────────────────┐ │
│  │        BACKGROUND WORKERS (BullMQ)        │ │
│  │                                            │ │
│  │  WorkflowExecutor   PollingWorker         │ │
│  │  OAuthRefresher     NotificationWorker    │ │
│  │  CleanupWorker                             │ │
│  └───────────────────────────────────────────┘ │
│                                                │
│  ┌───────────────────────────────────────────┐ │
│  │        REAL-TIME (Socket.io)              │ │
│  │                                            │ │
│  │  ExecutionProgress   Notifications        │ │
│  └───────────────────────────────────────────┘ │
│                                                │
│  ┌───────────────────────────────────────────┐ │
│  │        AI MODULE (LangChain)              │ │
│  │                                            │ │
│  │  WorkflowGenerator   ChatAssistant        │ │
│  │  PromptTemplates     OutputParsers        │ │
│  └───────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
         │           │           │
    ┌────▼───┐  ┌────▼───┐  ┌───▼────┐
    │ Neon   │  │Upstash │  │ OpenAI │
    │Postgres│  │ Redis  │  │  API   │
    └────────┘  └────────┘  └────────┘
```

---

## 7.3 Data Flow: User Creates and Runs a Workflow

**Step-by-step data flow:**

1. **User opens builder** → React Flow canvas loads → Zustand store initializes empty workflow
2. **User drags nodes** → Zustand updates `nodes[]` array → React Flow re-renders
3. **User connects nodes** → Zustand updates `edges[]` array
4. **User configures node** → Zustand updates `nodes[i].data` with config
5. **User clicks Save** → tRPC mutation `workflow.save` fires → Service layer validates → Drizzle inserts/updates `workflows` table in PostgreSQL
6. **User clicks Test** → tRPC mutation `workflow.test` → Service creates execution record → BullMQ enqueues `workflow.execute` job → Worker picks up job
7. **Worker executes** → Reads workflow JSON → Iterates through nodes in topological order → For each node: calls integration action → Stores step result in `execution_logs` table → Emits Socket.io event with step status
8. **Frontend receives** Socket.io events → Updates React Flow node colors (green/red) in real-time
9. **Execution completes** → Final status written to `executions` table → Socket.io emits completion event
10. **User sees result** → All nodes green → Success toast

**Data flow for live trigger (webhook example):**

1. **External service** POSTs to `https://app.flowpilot.com/api/webhook/wh_abc123`
2. **API route** receives request → Looks up workflow by webhook ID → Validates workflow is active
3. **Creates execution record** → Enqueues `workflow.execute` job with webhook payload as trigger data
4. **Worker executes** steps 7-9 above
5. **User sees** new execution in dashboard (if online)

---

## 7.4 Folder Structure

```
/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (public)/               # Public routes (no auth)
│   │   │   ├── page.tsx            # Landing page (/)
│   │   │   ├── features/page.tsx
│   │   │   ├── pricing/page.tsx
│   │   │   ├── integrations/page.tsx
│   │   │   ├── templates/page.tsx
│   │   │   ├── docs/[...slug]/page.tsx
│   │   │   └── contact/page.tsx
│   │   │
│   │   ├── (auth)/                 # Auth routes
│   │   │   ├── signin/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   ├── reset-password/page.tsx
│   │   │   └── verify-email/page.tsx
│   │   │
│   │   ├── (app)/                  # Authenticated app routes
│   │   │   ├── layout.tsx          # App layout (sidebar + topbar)
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── onboarding/page.tsx
│   │   │   ├── workflows/
│   │   │   │   ├── page.tsx        # Workflows list
│   │   │   │   ├── new/page.tsx    # Workflow builder (new)
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx    # Workflow detail
│   │   │   │       └── edit/page.tsx # Workflow builder (edit)
│   │   │   ├── executions/
│   │   │   │   ├── page.tsx        # Executions list
│   │   │   │   └── [id]/page.tsx   # Execution detail
│   │   │   ├── connections/page.tsx
│   │   │   ├── templates/page.tsx
│   │   │   ├── settings/
│   │   │   │   ├── profile/page.tsx
│   │   │   │   ├── billing/page.tsx
│   │   │   │   ├── notifications/page.tsx
│   │   │   │   ├── api-keys/page.tsx
│   │   │   │   └── security/page.tsx
│   │   │   └── help/page.tsx
│   │   │
│   │   ├── (admin)/                # Admin routes
│   │   │   ├── admin/page.tsx
│   │   │   ├── admin/users/page.tsx
│   │   │   └── admin/health/page.tsx
│   │   │
│   │   ├── api/                    # API routes (non-tRPC)
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── webhook/[id]/route.ts
│   │   │   ├── integrations/callback/[provider]/route.ts
│   │   │   ├── stripe/webhook/route.ts
│   │   │   └── trpc/[trpc]/route.ts
│   │   │
│   │   ├── layout.tsx              # Root layout
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/                 # Layout components
│   │   │   ├── app-sidebar.tsx
│   │   │   ├── app-topbar.tsx
│   │   │   ├── public-navbar.tsx
│   │   │   └── public-footer.tsx
│   │   │
│   │   ├── workflow/               # Workflow builder components
│   │   │   ├── workflow-canvas.tsx  # React Flow wrapper
│   │   │   ├── node-panel.tsx      # Left sidebar (drag nodes)
│   │   │   ├── config-panel.tsx    # Right sidebar (configure node)
│   │   │   ├── ai-chat-panel.tsx   # AI chat sidebar
│   │   │   ├── builder-topbar.tsx
│   │   │   ├── builder-bottombar.tsx
│   │   │   ├── nodes/              # Custom React Flow node types
│   │   │   │   ├── trigger-node.tsx
│   │   │   │   ├── action-node.tsx
│   │   │   │   ├── condition-node.tsx
│   │   │   │   ├── loop-node.tsx
│   │   │   │   ├── delay-node.tsx
│   │   │   │   ├── code-node.tsx
│   │   │   │   ├── http-node.tsx
│   │   │   │   └── merge-node.tsx
│   │   │   └── edges/
│   │   │       └── custom-edge.tsx
│   │   │
│   │   ├── dashboard/              # Dashboard components
│   │   │   ├── stats-cards.tsx
│   │   │   ├── recent-workflows.tsx
│   │   │   ├── recent-executions.tsx
│   │   │   └── usage-meter.tsx
│   │   │
│   │   └── shared/                 # Shared components
│   │       ├── data-table.tsx
│   │       ├── empty-state.tsx
│   │       ├── loading-skeleton.tsx
│   │       └── error-boundary.tsx
│   │
│   ├── server/                     # Server-side code
│   │   ├── trpc/
│   │   │   ├── router.ts           # Root tRPC router
│   │   │   ├── context.ts          # tRPC context (auth, db)
│   │   │   ├── trpc.ts             # tRPC init
│   │   │   └── routers/
│   │   │       ├── workflow.ts
│   │   │       ├── execution.ts
│   │   │       ├── connection.ts
│   │   │       ├── user.ts
│   │   │       ├── billing.ts
│   │   │       └── template.ts
│   │   │
│   │   ├── services/               # Business logic
│   │   │   ├── workflow.service.ts
│   │   │   ├── execution.service.ts
│   │   │   ├── connection.service.ts
│   │   │   ├── integration.service.ts
│   │   │   ├── ai.service.ts
│   │   │   ├── billing.service.ts
│   │   │   └── notification.service.ts
│   │   │
│   │   ├── db/
│   │   │   ├── index.ts            # Drizzle client
│   │   │   ├── schema/             # Drizzle schema files
│   │   │   │   ├── users.ts
│   │   │   │   ├── workflows.ts
│   │   │   │   ├── executions.ts
│   │   │   │   ├── connections.ts
│   │   │   │   ├── integrations.ts
│   │   │   │   └── billing.ts
│   │   │   └── migrations/         # Drizzle migrations
│   │   │
│   │   ├── queue/                  # BullMQ
│   │   │   ├── queues.ts           # Queue definitions
│   │   │   ├── workers/
│   │   │   │   ├── execution.worker.ts
│   │   │   │   ├── polling.worker.ts
│   │   │   │   ├── oauth-refresh.worker.ts
│   │   │   │   └── notification.worker.ts
│   │   │   └── jobs.ts             # Job type definitions
│   │   │
│   │   ├── integrations/           # Integration modules
│   │   │   ├── registry.ts         # Integration registry
│   │   │   ├── gmail/
│   │   │   │   ├── auth.ts
│   │   │   │   ├── triggers.ts
│   │   │   │   ├── actions.ts
│   │   │   │   ├── schema.ts
│   │   │   │   └── metadata.ts
│   │   │   ├── slack/
│   │   │   │   ├── auth.ts
│   │   │   │   ├── triggers.ts
│   │   │   │   ├── actions.ts
│   │   │   │   ├── schema.ts
│   │   │   │   └── metadata.ts
│   │   │   ├── notion/
│   │   │   ├── github/
│   │   │   ├── google-sheets/
│   │   │   ├── google-drive/
│   │   │   ├── google-calendar/
│   │   │   ├── discord/
│   │   │   ├── webhook/
│   │   │   └── http-request/
│   │   │
│   │   ├── ai/                     # AI module
│   │   │   ├── chains/
│   │   │   │   ├── workflow-generator.ts
│   │   │   │   └── chat-assistant.ts
│   │   │   ├── prompts/
│   │   │   │   ├── system-prompt.ts
│   │   │   │   └── workflow-prompt.ts
│   │   │   └── parsers/
│   │   │       └── workflow-parser.ts
│   │   │
│   │   └── lib/
│   │       ├── auth.ts             # NextAuth config
│   │       ├── redis.ts            # Redis client
│   │       ├── stripe.ts           # Stripe client
│   │       ├── resend.ts           # Email client
│   │       ├── s3.ts               # R2/S3 client
│   │       ├── encryption.ts       # Token encryption utils
│   │       └── socket.ts           # Socket.io server
│   │
│   ├── stores/                     # Zustand stores
│   │   ├── workflow-store.ts
│   │   ├── auth-store.ts
│   │   ├── connection-store.ts
│   │   ├── ui-store.ts
│   │   └── execution-store.ts
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── use-workflow.ts
│   │   ├── use-execution.ts
│   │   ├── use-connections.ts
│   │   └── use-socket.ts
│   │
│   ├── lib/                        # Shared utilities
│   │   ├── utils.ts                # General utils (cn, etc.)
│   │   ├── constants.ts
│   │   └── types.ts                # Shared TypeScript types
│   │
│   └── styles/
│       └── globals.css
│
├── public/
│   ├── images/
│   │   └── integrations/           # Integration logos
│   └── favicon.ico
│
├── drizzle.config.ts
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── docker-compose.yml
├── Dockerfile
├── .env.example
└── .env.local
```

---

## 7.5 Database Schema

### Table: `users`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | Primary key |
| `name` | varchar(255) | Display name |
| `email` | varchar(255) | Unique, indexed |
| `email_verified` | timestamp | When email was verified |
| `password_hash` | varchar(255) | Nullable (OAuth users don't have password) |
| `avatar_url` | varchar(500) | Profile picture |
| `timezone` | varchar(50) | Default: UTC |
| `role` | enum('user', 'admin') | Default: user |
| `plan` | enum('free', 'starter', 'pro', 'business') | Default: free |
| `onboarded` | boolean | Has completed onboarding? |
| `stripe_customer_id` | varchar(255) | Nullable |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

### Table: `accounts` (NextAuth)

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | Primary key |
| `user_id` | uuid | FK → users |
| `type` | varchar(50) | oauth, credentials |
| `provider` | varchar(50) | google, github, credentials |
| `provider_account_id` | varchar(255) | |
| `access_token` | text | |
| `refresh_token` | text | |
| `expires_at` | integer | |
| `token_type` | varchar(50) | |
| `scope` | text | |

### Table: `workflows`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | Primary key |
| `user_id` | uuid | FK → users, indexed |
| `name` | varchar(255) | |
| `description` | text | Nullable |
| `status` | enum('draft', 'active', 'paused', 'error') | Default: draft |
| `nodes` | jsonb | React Flow nodes array |
| `edges` | jsonb | React Flow edges array |
| `settings` | jsonb | Retry config, notifications, etc. |
| `trigger_type` | varchar(50) | webhook, schedule, manual, app |
| `trigger_config` | jsonb | Trigger-specific config |
| `webhook_id` | varchar(255) | Unique, nullable (for webhook triggers) |
| `cron_expression` | varchar(100) | Nullable (for schedule triggers) |
| `tags` | text[] | Array of tag strings |
| `execution_count` | integer | Default: 0 |
| `last_executed_at` | timestamp | Nullable |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

### Table: `executions`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | Primary key |
| `workflow_id` | uuid | FK → workflows, indexed |
| `user_id` | uuid | FK → users, indexed |
| `status` | enum('running', 'success', 'failed', 'cancelled') | |
| `trigger_type` | varchar(50) | What triggered this execution |
| `trigger_data` | jsonb | Trigger input data |
| `started_at` | timestamp | |
| `completed_at` | timestamp | Nullable |
| `duration_ms` | integer | Nullable |
| `error_message` | text | Nullable |
| `created_at` | timestamp | |

### Table: `execution_steps`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | Primary key |
| `execution_id` | uuid | FK → executions, indexed |
| `node_id` | varchar(255) | Node ID from workflow JSON |
| `node_type` | varchar(100) | e.g., action_slack, condition_if |
| `node_name` | varchar(255) | Display name |
| `status` | enum('running', 'success', 'failed', 'skipped') | |
| `input_data` | jsonb | Data received by this step |
| `output_data` | jsonb | Data produced by this step |
| `error_message` | text | Nullable |
| `started_at` | timestamp | |
| `completed_at` | timestamp | Nullable |
| `duration_ms` | integer | Nullable |
| `order_index` | integer | Execution order |

### Table: `connections`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | Primary key |
| `user_id` | uuid | FK → users, indexed |
| `provider` | varchar(50) | gmail, slack, notion, etc. |
| `provider_account_id` | varchar(255) | External account identifier |
| `provider_account_name` | varchar(255) | Display name (email, workspace name) |
| `access_token_encrypted` | text | AES-256 encrypted |
| `refresh_token_encrypted` | text | AES-256 encrypted |
| `token_expires_at` | timestamp | |
| `scopes` | text | Granted scopes |
| `status` | enum('active', 'expired', 'revoked') | Default: active |
| `metadata` | jsonb | Provider-specific metadata |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Unique constraint:** `(user_id, provider, provider_account_id)`

### Table: `webhook_subscriptions`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | Primary key |
| `workflow_id` | uuid | FK → workflows |
| `webhook_id` | varchar(255) | Unique public webhook ID |
| `secret` | varchar(255) | For HMAC validation |
| `is_active` | boolean | |
| `created_at` | timestamp | |

### Table: `templates`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | Primary key |
| `name` | varchar(255) | |
| `description` | text | |
| `category` | varchar(100) | Marketing, Productivity, DevOps, etc. |
| `nodes` | jsonb | Workflow nodes |
| `edges` | jsonb | Workflow edges |
| `integrations_required` | text[] | Array of provider names |
| `use_count` | integer | How many times imported |
| `is_featured` | boolean | Show on homepage |
| `created_at` | timestamp | |

### Table: `subscriptions` (Billing)

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | Primary key |
| `user_id` | uuid | FK → users |
| `stripe_subscription_id` | varchar(255) | |
| `stripe_price_id` | varchar(255) | |
| `plan` | enum('free', 'starter', 'pro', 'business') | |
| `status` | enum('active', 'cancelled', 'past_due', 'trialing') | |
| `current_period_start` | timestamp | |
| `current_period_end` | timestamp | |
| `cancel_at` | timestamp | Nullable |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

### Table: `usage`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | Primary key |
| `user_id` | uuid | FK → users, indexed |
| `period_start` | date | Start of billing period |
| `period_end` | date | End of billing period |
| `executions_count` | integer | Executions used this period |
| `ai_messages_count` | integer | AI chat messages used |
| `workflows_count` | integer | Active workflows count |

### Table: `audit_logs`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | Primary key |
| `user_id` | uuid | FK → users |
| `action` | varchar(100) | e.g., workflow.created, user.login, connection.added |
| `resource_type` | varchar(50) | workflow, connection, user, etc. |
| `resource_id` | uuid | |
| `metadata` | jsonb | Additional context |
| `ip_address` | varchar(45) | |
| `user_agent` | text | |
| `created_at` | timestamp | |

---

## 7.6 Database Indexes

| Table | Index | Purpose |
|-------|-------|---------|
| `users` | `email` (unique) | Fast login lookup |
| `workflows` | `user_id` | List user's workflows |
| `workflows` | `webhook_id` (unique) | Fast webhook trigger lookup |
| `workflows` | `status` | Filter active workflows |
| `executions` | `workflow_id` | List workflow's executions |
| `executions` | `user_id, created_at DESC` | Dashboard recent executions |
| `executions` | `status` | Filter by status |
| `execution_steps` | `execution_id` | List steps for execution |
| `connections` | `user_id, provider` | List user's connections by provider |
| `audit_logs` | `user_id, created_at DESC` | User activity history |
| `usage` | `user_id, period_start` | Current period lookup |

---

## 7.7 Security Architecture

| Concern | Approach |
|---------|----------|
| **Auth** | NextAuth.js with JWT sessions. Short-lived access tokens (1 hour), refresh via session callback. |
| **OAuth tokens** | AES-256-GCM encrypted at rest. Encryption key in environment variable (not in code). |
| **Passwords** | bcrypt with 12 salt rounds |
| **API auth** | tRPC procedures wrapped in auth middleware — check session JWT |
| **Webhook auth** | Optional HMAC signature validation for incoming webhooks |
| **Rate limiting** | Redis-based rate limiting on API endpoints. Free tier: 100 req/min. Paid: 1000 req/min. |
| **CORS** | Restricted to app domain only |
| **CSP** | Content Security Policy headers via Next.js middleware |
| **Data in transit** | HTTPS everywhere (enforced at hosting layer) |
| **Data at rest** | PostgreSQL encryption at Neon level + OAuth tokens encrypted by us |
| **Input validation** | Zod schemas on all tRPC procedures and API routes |
| **SQL injection** | Prevented by Drizzle ORM (parameterized queries) |
| **XSS** | React's default escaping + CSP headers |
| **Code node sandbox** | JavaScript code nodes run in isolated-vm (sandboxed, no filesystem/network access) |

---

*Next: [08-execution-and-ai.md](08-execution-and-ai.md) — Execution engine and AI strategy*

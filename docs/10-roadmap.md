# 10 — Development Roadmap

---

## 10.1 Phase Overview

| Phase | Duration | Focus |
|-------|----------|-------|
| **Phase 0** | Week 1-2 | Setup, learning, design |
| **Phase 1** | Week 3-6 | Core app: Auth, Dashboard, Database |
| **Phase 2** | Week 7-10 | Workflow Builder (React Flow) |
| **Phase 3** | Week 11-13 | Integrations (OAuth + Top 10 services) |
| **Phase 4** | Week 14-16 | Execution Engine (BullMQ + real-time) |
| **Phase 5** | Week 17-18 | AI Chat Assistant (LangChain) |
| **Phase 6** | Week 19-20 | Polish, testing, launch prep |
| **Launch** | Week 21 | Go live |

**Total: ~5 months for MVP (solo developer)**

---

## 10.2 Phase 0 — Setup & Learning (Weeks 1-2)

### Week 1: Project Setup

- [ ] Choose product name and buy domain
- [ ] Create GitHub repository (monorepo)
- [ ] Initialize Next.js 15 project with TypeScript
- [ ] Set up Tailwind CSS + shadcn/ui
- [ ] Install and configure Drizzle ORM
- [ ] Set up Neon PostgreSQL (free tier)
- [ ] Set up Upstash Redis (free tier)
- [ ] Set up Docker Compose for local development (PostgreSQL + Redis)
- [ ] Configure ESLint, Prettier
- [ ] Create `.env.example` with all required variables
- [ ] Set up basic folder structure (as defined in architecture doc)
- [ ] Create initial Drizzle schema (users, workflows, executions, connections)
- [ ] Run first migration

### Week 2: Learning + Design

- [ ] Learn React Flow (work through official tutorial and examples — 3 days)
- [ ] Learn tRPC basics (follow getting started guide — 1 day)
- [ ] Learn shadcn/ui patterns (install 10+ components, build test page — 1 day)
- [ ] Create wireframe designs for key pages (hand-drawn or Excalidraw):
  - Dashboard
  - Workflow Builder layout
  - Workflows list
  - Connections page
- [ ] Define color scheme, typography, spacing tokens
- [ ] Set up NextAuth with Google + GitHub + Credentials provider (test auth works)

**Success criteria:** Project runs locally. Auth works. Database connected. React Flow renders on a test page.

---

## 10.3 Phase 1 — Core App (Weeks 3-6)

### Week 3: Auth + Layout + tRPC

- [ ] Build root layout with theme provider
- [ ] Build public navbar (logo, links, Sign In / Get Started buttons)
- [ ] Build public footer
- [ ] Build auth pages: `/signin`, `/signup`, `/forgot-password`, `/reset-password`
- [ ] Wire up NextAuth completely (Google OAuth, GitHub OAuth, Credentials)
- [ ] Email verification flow (with Resend)
- [ ] Set up tRPC with Next.js App Router
- [ ] Create tRPC context (inject db, session, user)
- [ ] Create `userRouter` with basic procedures (getProfile, updateProfile)
- [ ] Auth middleware for tRPC (protected procedures)

### Week 4: App Layout + Dashboard

- [ ] Build app layout: sidebar navigation + top bar
- [ ] Sidebar items: Dashboard, Workflows, Executions, Connections, Templates, Settings
- [ ] User dropdown (avatar, settings, logout)
- [ ] Build Dashboard page:
  - Stats cards (total workflows, executions, success rate, connections)
  - Recent workflows table
  - Recent executions table
  - Quick action buttons (Create Workflow, Connect Service)
  - Empty state for new users
- [ ] Create `workflowRouter` (list, get, create, update, delete)
- [ ] Create `executionRouter` (list, get, getSteps)
- [ ] Wire up dashboard with real data from tRPC

### Week 5: Workflows List + Details

- [ ] Build `/workflows` list page:
  - Data table with: name, status, trigger type, last executed, executions count
  - Search and filter (by status)
  - Row actions: Edit, Duplicate, Run, Pause/Resume, Delete
  - Pagination
  - Empty state
- [ ] Build `/workflows/[id]` detail page:
  - Workflow info header (name, status, description)
  - Read-only React Flow preview of the workflow
  - Execution history table for this workflow
  - Settings tab (name, description, tags, retry settings)
  - Action buttons (Edit, Run Now, Pause, Delete)

### Week 6: Settings + Onboarding

- [ ] Build Settings pages:
  - `/settings/profile` — Name, email, avatar, timezone, delete account
  - `/settings/billing` — Current plan, usage stats, upgrade buttons (Stripe integration placeholder)
  - `/settings/notifications` — Email notification toggles
  - `/settings/security` — Change password, active sessions
  - `/settings/api-keys` — "Coming Soon" placeholder
- [ ] Build `/onboarding` page:
  - Step 1: Welcome
  - Step 2: Select interests (categories)
  - Step 3: Connect first service (show top 5 integrations)
  - Step 4: Try a template or start fresh
- [ ] Onboarding flow only shows on first login (check `onboarded` flag)
- [ ] Build public pages (static, content-focused):
  - Landing page (hero, how it works, features, CTA)
  - Features page
  - Pricing page

**Phase 1 Success criteria:** User can sign up, see dashboard, manage profile, view workflow/execution lists (empty for now). Public pages live.

---

## 10.4 Phase 2 — Workflow Builder (Weeks 7-10)

### Week 7: React Flow Canvas Setup

- [ ] Set up React Flow on `/workflows/new` and `/workflows/[id]/edit`
- [ ] Create `useWorkflowStore` (Zustand) for builder state: nodes, edges, selectedNode, panelState
- [ ] Implement canvas: zoom, pan, minimap, controls, grid snap
- [ ] Create custom node component (base template): icon, name, status indicator, handles
- [ ] Create custom edge component with labels and delete button
- [ ] Implement node drag-and-drop from left panel to canvas
- [ ] Implement node-to-node connections (drag handle to handle)
- [ ] Implement node selection, multi-select, delete

### Week 8: Node Panel + Node Types

- [ ] Build left sidebar Node Panel:
  - Trigger section (Webhook, Schedule, Manual, App triggers)
  - Action section (grouped by service)
  - Logic section (If/Else, Switch, Loop, Delay, Stop)
  - Utility section (Set Variable, Transform, Code, HTTP Request, Merge, Error Handler)
  - Search bar to filter nodes
- [ ] Create individual node type components:
  - `TriggerNode` (different visual from action nodes)
  - `ActionNode` (shows integration icon + action name)
  - `ConditionNode` (diamond shape or dual-output card)
  - `LoopNode`
  - `DelayNode`
  - `CodeNode`
  - `HttpNode`
  - `MergeNode`
- [ ] Register node types with React Flow
- [ ] Drag from panel → creates node on canvas

### Week 9: Configuration Panel

- [ ] Build right sidebar Config Panel (opens on node click)
- [ ] Dynamic form generation based on node type:
  - Trigger configs (event selection, filters)
  - Action configs (account selection, action dropdown, parameter fields)
  - Condition configs (field, operator, value with AND/OR grouping)
  - Loop configs (input array selection)
  - Delay configs (duration + unit)
  - Code configs (Monaco editor embed)
  - HTTP configs (URL, method, headers, body, auth)
- [ ] Data mapping feature:
  - Click a field → shows available data from previous nodes
  - Display as `{{nodes.node_1.data.fieldName}}` pills/tags
  - Autocomplete for data paths
- [ ] Expression editor toggle on each field
- [ ] "Test This Step" tab (placeholder — functional in Phase 4)

### Week 10: Builder Polish + Save/Load

- [ ] Top bar: Workflow name (inline edit), Save, Test (placeholder), Activate/Deactivate, Settings
- [ ] Bottom bar: Zoom controls, Fit View, Minimap toggle, AI Chat button (placeholder)
- [ ] Auto-save every 30 seconds
- [ ] Manual save (Ctrl+S)
- [ ] Dirty state tracking (unsaved changes indicator)
- [ ] Save workflow to database (tRPC mutation: serialize nodes + edges + configs → store in `workflows` table)
- [ ] Load workflow from database (on page load, deserialize and render)
- [ ] Keyboard shortcuts (Ctrl+Z undo, Ctrl+C/V copy/paste, Delete, Ctrl+D duplicate)
- [ ] Right-click context menus (canvas and node)
- [ ] Auto-layout button (arrange nodes with dagre algorithm — `dagre` npm package)
- [ ] Validation before activate: at least 1 trigger + 1 action, all nodes configured

**Phase 2 Success criteria:** User can build a complete workflow visually — drag nodes, connect them, configure each node, save, and load. No execution yet.

---

## 10.5 Phase 3 — Integrations (Weeks 11-13)

### Week 11: OAuth Infrastructure + Google Services

- [ ] Build OAuth connection infrastructure:
  - `/api/integrations/callback/[provider]/route.ts` — Generic OAuth callback handler
  - `connection.service.ts` — Token exchange, encryption, storage, refresh
  - Token encryption with AES-256-GCM
  - Token refresh logic (check expiry before API calls)
- [ ] Build `/connections` page:
  - Connected services list (cards with logo, name, account, status)
  - "Connect New Service" modal (shows available integrations)
  - Test Connection button
  - Disconnect button (confirm modal)
  - Connection health indicators (green/red/yellow)
- [ ] Implement Google OAuth (shared credentials for Gmail, Sheets, Drive, Calendar):
  - Google Cloud Console project setup
  - OAuth consent screen configuration
  - Scopes management
- [ ] Build Gmail integration module (auth, triggers, actions, schema, metadata)
- [ ] Build Google Sheets integration module
- [ ] Build Google Drive integration module
- [ ] Build Google Calendar integration module

### Week 12: Slack + Discord + GitHub

- [ ] Build Slack integration module:
  - Slack App setup (bot token, event subscriptions)
  - OAuth flow
  - Triggers: New message, DM, Reaction
  - Actions: Send message, DM, Create channel
- [ ] Build Discord integration module:
  - Discord Bot setup
  - OAuth + Bot token flow
  - Triggers: New message, Member joined
  - Actions: Send message, Create channel, Add role
- [ ] Build GitHub integration module:
  - GitHub App or OAuth App setup
  - OAuth flow
  - Triggers: New issue, New PR, Push, Star
  - Actions: Create issue, Comment, Create PR, Add label
- [ ] Build Webhook integration module:
  - Generate unique webhook URLs
  - Handle incoming POST/GET requests
  - Parse body (JSON, form data)
  - Authentication options (none, API key, HMAC)
- [ ] Build HTTP Request integration module:
  - Universal HTTP client
  - Support all methods, headers, body types
  - Auth options (none, basic, bearer, API key)

### Week 13: Remaining MVP Integrations + Templates

- [ ] Build Notion integration module
- [ ] Build Telegram integration module
- [ ] Build Airtable integration module
- [ ] Build Trello integration module
- [ ] Build Linear integration module
- [ ] Wire up all integrations to the builder's Node Panel:
  - When user has a connected service → Show triggers/actions in panel
  - When not connected → Show "Connect [Service]" badge
- [ ] Build Templates system:
  - Create 10 starter templates (hardcoded in DB seed)
  - Build `/templates` page (public + authenticated versions)
  - "Use Template" → Clone workflow to user's account → Open in builder
  - Template detail modal with read-only React Flow preview

**Phase 3 Success criteria:** User can connect 10+ services via OAuth, browse integrations, use templates, and see integration nodes in the builder.

---

## 10.6 Phase 4 — Execution Engine (Weeks 14-16)

### Week 14: BullMQ Setup + Basic Execution

- [ ] Set up BullMQ queues and workers:
  - `workflow-execution` queue
  - `workflow-polling` queue
  - `oauth-refresh` queue
  - `notifications` queue
- [ ] Build execution engine core:
  - Parse workflow JSON (nodes + edges)
  - Build execution graph (topological sort)
  - Execute nodes sequentially following edges
  - Pass data between nodes (resolve `{{...}}` expressions)
  - Store results per step in `execution_steps` table
- [ ] Implement Manual Trigger:
  - User clicks "Run" → Create execution record → Enqueue job → Worker executes
- [ ] Implement Webhook Trigger:
  - `/api/webhook/[id]` route → Look up workflow → Enqueue job
  - Return 200 OK immediately
- [ ] Build Execution History page:
  - `/executions` — List all executions with filters
  - `/executions/[id]` — Execution detail with step-by-step logs

### Week 15: Advanced Triggers + Error Handling

- [ ] Implement Schedule Trigger:
  - BullMQ repeatable jobs with cron expressions
  - Create job on workflow activate, remove on deactivate
  - Timezone handling
- [ ] Implement App Triggers (polling):
  - Polling worker checks active workflows every 2-5 minutes
  - Compare with last state (stored in Redis)
  - Create execution if new data found
- [ ] Implement error handling:
  - Per-node error catching (try/catch)
  - Retry logic: exponential backoff (5s, 30s, 120s)
  - Configurable max retries (per workflow settings)
  - Error Handler node: catch errors, run fallback branch
  - Mark failed nodes, store error messages
- [ ] Implement condition nodes:
  - Evaluate conditions (equals, contains, greater than, etc.)
  - Follow correct branch (True/False)
  - Mark skipped branches
- [ ] Implement loop/for-each:
  - Iterate over arrays
  - Execute loop body per item
  - Collect outputs
- [ ] Implement delay node:
  - Use BullMQ delayed jobs
  - Resume after delay

### Week 16: Real-Time Updates + Execution Visualization

- [ ] Set up Socket.io server (alongside Next.js)
- [ ] Implement execution progress events:
  - Worker emits events via Redis pub/sub
  - Socket.io reads events and forwards to user's room
  - Events: step:start, step:complete, execution:complete
- [ ] Build real-time execution visualization in the builder:
  - When testing or when execution runs, nodes change color:
    - Blue pulsing = running
    - Green = success
    - Red = failed
    - Gray = not reached
    - Yellow = skipped
  - Animated edges (dashed moving line for data flow)
- [ ] Build `/executions/[id]` detail page:
  - React Flow canvas showing workflow with step statuses (colored nodes)
  - Step-by-step log panel: input/output JSON, status, duration, errors
  - "Retry from failed step" button
  - "Retry entire workflow" button
- [ ] Implement "Test" button in builder:
  - Execute workflow once with mock/real data
  - Show real-time progress on canvas
  - Show output of each step
- [ ] Usage tracking:
  - Increment execution count in `usage` table
  - Check limits before execution (reject if over limit)
  - Show usage in dashboard and billing page

**Phase 4 Success criteria:** Workflows actually execute. Triggers fire. Data flows between steps. Errors are handled. Real-time visual feedback in the builder.

---

## 10.7 Phase 5 — AI Chat Assistant (Weeks 17-18)

### Week 17: LangChain Setup + Workflow Generation

- [ ] Set up LangChain.js with OpenAI (GPT-4o-mini)
- [ ] Create system prompt with:
  - Available node types and their schemas
  - Workflow JSON structure definition
  - Rules (must have trigger, valid connections, etc.)
- [ ] Create output parser (Zod schema) for structured responses:
  - `message`: String (explanation for user)
  - `actions`: Array of `addNode`, `removeNode`, `addEdge`, `removeEdge`, `updateNodeData`
- [ ] Implement workflow generation chain:
  - User input → LLM → Parse response → Validate → Apply to canvas
- [ ] Implement validation pipeline:
  - Check: valid node types? Valid edges? Complete configs?
  - If invalid: re-prompt LLM with errors (up to 2 retries)
- [ ] Handle context injection:
  - Current workflow state (nodes/edges)
  - User's connected integrations
  - Conversation history (last 10 messages)

### Week 18: AI Chat Panel + Polish

- [ ] Build AI Chat Panel (right sidebar, toggled via 💬 button):
  - Chat message list (user messages + AI responses)
  - Text input at bottom with send button
  - Streaming response display (typing indicator)
  - "Clear conversation" button
- [ ] Wire up AI actions to Zustand store:
  - When AI returns `addNode` → Add to `nodes[]` in store → React Flow renders
  - When AI returns `addEdge` → Add to `edges[]`
  - When AI returns `updateNodeData` → Update node config
  - Auto-fit view after AI changes
- [ ] Implement specific AI capabilities:
  - "Add a [trigger/action]" → Adds node
  - "Connect [service]" → Checks if connected, adds node or prompts OAuth
  - "What does this workflow do?" → Reads nodes/edges, generates description
  - "Fix this error" → Takes error context, suggests fix
  - "Remove [node]" → Removes node and reconnects edges
- [ ] AI rate limiting:
  - Track messages in `usage` table
  - Enforce per-plan limits
  - Show remaining messages count in chat panel
- [ ] AI response caching:
  - Cache common requests in Redis (TTL: 1 hour)

**Phase 5 Success criteria:** User can chat with AI to create, modify, and understand workflows. AI generates valid workflow JSON that renders correctly on the canvas.

---

## 10.8 Phase 6 — Polish & Launch (Weeks 19-21)

### Week 19: Testing + Bug Fixes

- [ ] End-to-end testing of all user flows:
  - Signup → Onboarding → Create workflow → Execute → View results
  - OAuth connection for each integration
  - Each trigger type (webhook, schedule, manual, app)
  - Error scenarios (failed execution, expired token, rate limit)
  - Billing flow (upgrade, downgrade, cancel)
- [ ] Fix all bugs found
- [ ] Performance optimization:
  - Lazy load heavy components (React Flow, Monaco)
  - Optimize database queries (add missing indexes)
  - Image optimization (Next.js Image component for integration logos)
- [ ] Security review:
  - Test OAuth flows for vulnerabilities
  - Test webhook endpoints for injection
  - Verify token encryption
  - Rate limiting on all endpoints
  - Input validation on all forms

### Week 20: Stripe + Final Features

- [ ] Implement Stripe billing:
  - Create Stripe products and prices
  - Checkout flow (signup → Stripe hosted checkout → webhook confirms)
  - Customer portal (manage subscription, payment method, invoices)
  - Handle webhooks (subscription events)
  - Enforce plan limits (executions, workflows, AI messages)
  - Upgrade/downgrade flow in settings
- [ ] Implement email notifications:
  - Workflow failure notification
  - Welcome email
  - Weekly usage summary (optional)
- [ ] Build public Integrations page
- [ ] Build public Templates page
- [ ] SEO: meta tags, Open Graph, sitemap, robots.txt
- [ ] Documentation (basic — Getting Started, Integrations guide)

### Week 21: Launch

- [ ] Deploy to production hosting
- [ ] Set up custom domain + SSL
- [ ] Set up Sentry error monitoring
- [ ] Set up PostHog analytics
- [ ] Set up GitHub Actions CI/CD pipeline
- [ ] Seed production database (templates, admin user)
- [ ] Final smoke test on production
- [ ] Launch on Product Hunt
- [ ] Post on Hacker News, Reddit (/r/SaaS, /r/automation, /r/sideproject)
- [ ] Announce on Twitter/X
- [ ] Share in relevant Discord communities
- [ ] Monitor errors and metrics closely for first 48 hours

---

## 10.9 Post-MVP Roadmap (Months 6-12)

| Month | Focus | Key Features |
|-------|-------|-------------|
| **Month 6** | Stability + Growth | Bug fixes, performance, 5 more integrations, user feedback iteration |
| **Month 7** | More Integrations | Outlook, Teams, Jira, Shopify, Stripe — expand to 25 total |
| **Month 8** | Team Features | Workspace/org accounts, shared workflows, role-based access |
| **Month 9** | Advanced Builder | Sub-workflows (reusable), version history, import/export |
| **Month 10** | Developer Features | Public API, custom code improvements, CLI tool |
| **Month 11** | Marketplace | Community template marketplace, user-submitted templates |
| **Month 12** | Enterprise Prep | SSO/SAML, audit logs, compliance, SLA |

---

## 10.10 Long-Term Vision (Years 2-3)

| Year | Focus |
|------|-------|
| **Year 2** | Self-hosted option (Docker image), 100+ integrations, mobile companion app, integration SDK for third-party developers, advanced AI (agents that monitor and suggest automations), $50K+ MRR |
| **Year 3** | Enterprise offering, dedicated cloud instances, marketplace with paid templates/integrations, AI that learns from user patterns, $150K+ MRR |

---

*Next: [11-risk-and-kpis.md](11-risk-and-kpis.md) — Risk analysis, KPIs, and success metrics*

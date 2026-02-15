# 04 — User Flows

---

## 4.1 Website Navigation Flow

```
VISITOR LANDS ON SITE
│
├── / (Landing Page)
│   ├── Click "Get Started Free" ──→ /signup
│   ├── Click "Watch Demo" ──→ Modal with demo video
│   ├── Click "Features" ──→ /features
│   ├── Click "Pricing" ──→ /pricing
│   ├── Click "Integrations" ──→ /integrations
│   ├── Click "Templates" ──→ /templates
│   ├── Click "Docs" ──→ /docs
│   ├── Click "Contact" ──→ /contact
│   └── Click "Sign In" ──→ /signin
│
├── /signup ──→ Create account ──→ /onboarding
├── /signin ──→ Authenticate ──→ /dashboard
│
└── AUTHENTICATED USER
    │
    ├── /dashboard (Home)
    │   ├── Click "Create Workflow" ──→ /workflows/new
    │   ├── Click workflow name ──→ /workflows/[id]
    │   ├── Click execution ──→ /executions/[id]
    │   └── Click "Connect Service" ──→ /connections
    │
    ├── /workflows (List)
    │   ├── Click "New Workflow" ──→ /workflows/new
    │   ├── Click workflow name ──→ /workflows/[id]
    │   └── Click "Edit" ──→ /workflows/[id]/edit
    │
    ├── /workflows/new (Builder — React Flow)
    │   └── Save ──→ /workflows/[id]
    │
    ├── /workflows/[id] (Detail)
    │   ├── Click "Edit" ──→ /workflows/[id]/edit
    │   ├── Click "Run Now" ──→ Executes, shows /executions/[id]
    │   └── Click execution row ──→ /executions/[id]
    │
    ├── /executions (List all)
    │   └── Click execution ──→ /executions/[id]
    │
    ├── /executions/[id] (Detail + logs)
    │   ├── Click "Retry" ──→ Re-executes
    │   └── Click "View Workflow" ──→ /workflows/[id]
    │
    ├── /connections (My services)
    │   ├── Click "Connect New" ──→ OAuth popup ──→ returns to /connections
    │   ├── Click "Reconnect" ──→ OAuth popup
    │   └── Click "Disconnect" ──→ Confirm modal ──→ removes connection
    │
    ├── /templates
    │   └── Click "Use Template" ──→ Creates copy ──→ /workflows/[id]/edit
    │
    └── /settings/*
        ├── /settings/profile
        ├── /settings/billing
        ├── /settings/notifications
        ├── /settings/api-keys
        └── /settings/security
```

---

## 4.2 Flow 1: New User Signup → First Workflow

**Goal:** Get a new user from landing page to their first working automation.

| Step | Page | User Action | System Response |
|------|------|-------------|-----------------|
| 1 | `/` | Clicks "Get Started Free" | Navigates to `/signup` |
| 2 | `/signup` | Clicks "Continue with Google" | Google OAuth popup opens |
| 3 | Google popup | Grants permission | Popup closes, account created |
| 4 | `/onboarding` Step 1 | Sees "Welcome! Let's build your first automation" | Shows welcome screen |
| 5 | `/onboarding` Step 2 | Selects interests: "Marketing", "Productivity" | Stores preference, personalizes templates |
| 6 | `/onboarding` Step 3 | Clicks "Connect Gmail" | Gmail OAuth flow → returns connected |
| 7 | `/onboarding` Step 3 | Clicks "Connect Slack" | Slack OAuth flow → returns connected |
| 8 | `/onboarding` Step 4 | Sees 3 recommended templates. Clicks "Email to Slack Notifier" | Creates workflow from template |
| 9 | `/workflows/[id]/edit` | Sees pre-configured workflow: Gmail Trigger → Slack Action | Builder loads with template nodes |
| 10 | Builder | Reviews config, clicks "Test" | Workflow runs with test data, shows green nodes |
| 11 | Builder | Clicks "Activate" | Workflow goes live. Success toast. |
| 12 | `/dashboard` | Sees active workflow in dashboard | Shows stats, recent executions |

**Time target:** Under 5 minutes from landing to first active workflow.

---

## 4.3 Flow 2: Creating a Workflow Manually (Visual Builder)

| Step | Page | User Action | System Response |
|------|------|-------------|-----------------|
| 1 | `/dashboard` | Clicks "Create New Workflow" | Navigates to `/workflows/new` |
| 2 | Builder | Sees empty canvas with "Drag a trigger node to start" placeholder | Left panel shows all node types |
| 3 | Builder | Drags "Gmail Trigger" from left panel onto canvas | Trigger node appears on canvas |
| 4 | Builder | Clicks the Gmail Trigger node | Right panel opens with config fields |
| 5 | Config panel | Selects connected Gmail account from dropdown | Account selected |
| 6 | Config panel | Selects event: "New Email Received" | Event configured |
| 7 | Config panel | Sets filter: From contains "@client.com" | Filter applied |
| 8 | Builder | Drags "If/Else" node onto canvas | Condition node appears |
| 9 | Builder | Drags from Gmail output handle to If/Else input handle | Edge created (connection line) |
| 10 | Builder | Clicks If/Else node | Config panel shows condition settings |
| 11 | Config panel | Sets condition: `{{trigger.data.subject}}` contains "invoice" | Condition configured |
| 12 | Builder | Drags "Google Sheets" action onto canvas | Google Sheets node appears |
| 13 | Builder | Connects If/Else "True" handle → Google Sheets input | Edge created on True branch |
| 14 | Builder | Clicks Google Sheets node | Config opens |
| 15 | Config panel | Selects account, action: "Add Row", selects sheet | Configures sheet |
| 16 | Config panel | Maps columns: Column A = `{{trigger.data.from}}`, Column B = `{{trigger.data.subject}}` | Data mapped |
| 17 | Builder | Drags "Slack" action node onto canvas | Slack node appears |
| 18 | Builder | Connects If/Else "True" handle → Slack input (parallel with Sheets) | Both Sheets and Slack run on True |
| 19 | Builder | Clicks Slack node, configures: channel=#invoices, message=mapped | Configured |
| 20 | Top bar | Clicks "Save" | Workflow saved. Toast: "Saved ✓" |
| 21 | Top bar | Clicks "Test" | Runs workflow with test/mock data |
| 22 | Canvas | Watches nodes turn green one by one with animation | Real-time execution visualization |
| 23 | Top bar | Clicks "Activate" | Workflow is live |
| 24 | `/workflows/[id]` | Sees workflow detail with execution history | Active status shown |

---

## 4.4 Flow 3: Creating a Workflow with AI Chat

| Step | Page | User Action | System Response |
|------|------|-------------|-----------------|
| 1 | `/workflows/new` | Clicks 💬 AI Chat button in bottom bar | AI chat panel opens on right side |
| 2 | Chat panel | Types: "When I get a new email from @client.com that has 'invoice' in the subject, add a row to my 'Invoices' Google Sheet and send a Slack message to #invoices" | AI processes the request |
| 3 | Chat panel | AI responds: "I'll create that workflow for you. Let me set it up..." | AI is thinking/streaming |
| 4 | Canvas | 4 nodes appear on canvas: Gmail Trigger → If/Else → Google Sheets + Slack (parallel) | Nodes auto-arranged, connected with edges |
| 5 | Chat panel | AI: "Done! I've created your workflow with: 1. Gmail trigger (filters @client.com), 2. Condition checking for 'invoice' in subject, 3. Google Sheets row addition, 4. Slack notification to #invoices. Want me to adjust anything?" | AI explains what it did |
| 6 | Builder | User clicks Gmail Trigger node to verify config | Config panel shows correct settings |
| 7 | Chat panel | Types: "Also add a Delay of 5 minutes before the Slack message" | AI processes |
| 8 | Canvas | Delay node appears between If/Else and Slack, edges re-routed | AI modified the workflow |
| 9 | Chat panel | AI: "Added! There's now a 5-minute delay before the Slack notification." | Confirmed |
| 10 | Top bar | Clicks "Test" | Workflow runs successfully |
| 11 | Top bar | Clicks "Activate" | Workflow goes live |

---

## 4.5 Flow 4: Connecting a New Service (OAuth)

| Step | Page | User Action | System Response |
|------|------|-------------|-----------------|
| 1 | `/connections` | Clicks "Connect New Service" | Modal opens with available integrations |
| 2 | Modal | Searches "Notion", clicks Notion card | Notion OAuth connection starts |
| 3 | Popup | Notion OAuth consent screen opens in popup | User sees Notion's auth page |
| 4 | Popup | User authorizes access to their Notion workspace | Popup closes |
| 5 | `/connections` | Notion appears in connected services with green status | Token stored securely |
| 6 | `/connections` | Success toast: "Notion connected successfully!" | Connection ready to use |

**Alternative entry:** User is in the builder, drags a Notion node, sees "Connect Notion" prompt, clicks it → OAuth flow starts inline.

---

## 4.6 Flow 5: Monitoring & Debugging a Failed Execution

| Step | Page | User Action | System Response |
|------|------|-------------|-----------------|
| 1 | — | Workflow execution fails | User receives email notification (if enabled) |
| 2 | Email | User clicks "View Execution" link in email | Opens `/executions/[id]` |
| 3 | `/executions/[id]` | Sees visual flow: Node 1 (green) → Node 2 (green) → Node 3 (red) | Failed node highlighted in red |
| 4 | Execution detail | Clicks failed node (Node 3 - Slack action) | Expands step log |
| 5 | Step log | Sees: Error: "channel_not_found — #invoies does not exist" | Clear error message |
| 6 | Step log | Realizes typo: "#invoies" instead of "#invoices" | Understands the issue |
| 7 | Top bar | Clicks "View Workflow" → "Edit" | Opens builder at `/workflows/[id]/edit` |
| 8 | Builder | Clicks Slack node, fixes channel name to "#invoices" | Corrected |
| 9 | Top bar | Clicks "Save" then "Test" | Workflow runs, all nodes green |
| 10 | `/executions/[id]` (original) | Clicks "Retry This Execution" | Re-runs with original trigger data, succeeds |

---

## 4.7 Flow 6: Using a Template

| Step | Page | User Action | System Response |
|------|------|-------------|-----------------|
| 1 | `/templates` | Browses templates, selects category "Productivity" | Template cards filtered |
| 2 | `/templates` | Clicks "Gmail → Google Sheets Logger" template | Template detail modal opens |
| 3 | Modal | Sees workflow preview (read-only React Flow), description, required integrations | Understands what it does |
| 4 | Modal | Clicks "Use This Template" | System checks if required services are connected |
| 5 | — | Gmail connected ✓, Google Sheets connected ✓ | All requirements met |
| 6 | `/workflows/[id]/edit` | Template imported as new workflow, opens in builder | User can customize |
| 7 | Builder | Adjusts Google Sheet selection, Gmail filter | Personalizes the template |
| 8 | Top bar | Saves and Activates | Workflow live |

**If service not connected:**
- Step 5: Google Sheets NOT connected
- Modal shows: "You need to connect Google Sheets first" + "Connect Now" button
- User connects → returns → can import template

---

## 4.8 Flow 7: Managing Workflows from Dashboard

| Step | Page | User Action | System Response |
|------|------|-------------|-----------------|
| 1 | `/dashboard` | Views stats: 5 active workflows, 123 executions today, 98% success rate | Overview at a glance |
| 2 | Dashboard | Notices one workflow showing "Error" status | Red dot on workflow row |
| 3 | Dashboard | Clicks workflow name | Goes to `/workflows/[id]` |
| 4 | `/workflows/[id]` | Sees last execution failed, clicks execution | Goes to `/executions/[id]` |
| 5 | `/executions/[id]` | Debugs the issue (see Flow 5) | Fixes and retries |
| 6 | `/dashboard` | Back to dashboard, wants to pause a workflow | Finds workflow in list |
| 7 | Dashboard | Clicks "⏸ Pause" on the workflow row | Workflow paused, trigger deactivated |
| 8 | Dashboard | Later clicks "▶ Resume" | Workflow active again |

---

## 4.9 Flow 8: Upgrading Plan

| Step | Page | User Action | System Response |
|------|------|-------------|-----------------|
| 1 | `/dashboard` | Sees usage warning: "450/500 executions used this month" | Yellow warning bar |
| 2 | Warning bar | Clicks "Upgrade Plan" | Navigates to `/settings/billing` |
| 3 | `/settings/billing` | Sees current plan (Free) and usage stats | Upgrade options shown |
| 4 | Billing page | Clicks "Upgrade to Starter ($9/mo)" | Opens Stripe checkout |
| 5 | Stripe checkout | Enters payment info, confirms | Payment processed |
| 6 | `/settings/billing` | Plan updated to Starter. New limits shown. | Confirmation email sent |

---

## 4.10 Flow 9: Webhook Trigger Setup

| Step | Page | User Action | System Response |
|------|------|-------------|-----------------|
| 1 | Builder | Drags "Webhook Trigger" onto canvas | Webhook node appears |
| 2 | Config panel | Sees unique webhook URL: `https://app.flowpilot.com/webhook/wh_abc123` | URL auto-generated |
| 3 | Config panel | Selects method: POST, auth: None | Configured |
| 4 | Config panel | Clicks "Copy URL" | URL copied to clipboard |
| 5 | External service | Pastes URL into external service's webhook config (e.g., Stripe webhook URL) | External service will POST to this URL |
| 6 | Builder | Clicks "Test Webhook" | System shows: "Listening for incoming webhook..." |
| 7 | External service | Triggers a test event (e.g., test payment in Stripe) | Stripe sends POST to webhook URL |
| 8 | Builder | Receives webhook data | Shows: "Webhook received! Here's the data:" + JSON preview |
| 9 | Builder | Adds action nodes after webhook trigger, configures | Builds rest of workflow |
| 10 | Top bar | Activates workflow | Webhook is live, ready to receive |

---

## 4.11 Flow 10: Deleting Account

| Step | Page | User Action | System Response |
|------|------|-------------|-----------------|
| 1 | `/settings/profile` | Scrolls to bottom, clicks "Delete Account" | Confirmation modal opens |
| 2 | Modal | Warning: "This will permanently delete your account, all workflows, executions, and connections. This cannot be undone." | Asks user to type "DELETE" to confirm |
| 3 | Modal | Types "DELETE", clicks confirm | Account deletion process starts |
| 4 | — | System deletes: OAuth tokens (revokes), workflows, executions, user data | All data removed |
| 5 | `/` | Redirected to homepage | Session ended |
| 6 | Email | Receives: "Your account has been deleted" confirmation email | Final communication |

---

## 4.12 Flow Summary — Page Transition Map

| From | Action | To |
|------|--------|----|
| `/` | Sign up | `/signup` |
| `/signup` | Complete signup | `/onboarding` |
| `/onboarding` | Finish onboarding | `/dashboard` |
| `/signin` | Login | `/dashboard` |
| `/dashboard` | Create workflow | `/workflows/new` |
| `/dashboard` | Click workflow | `/workflows/[id]` |
| `/dashboard` | Click execution | `/executions/[id]` |
| `/workflows` | New workflow | `/workflows/new` |
| `/workflows` | Click workflow | `/workflows/[id]` |
| `/workflows/[id]` | Edit | `/workflows/[id]/edit` |
| `/workflows/[id]` | Click execution | `/executions/[id]` |
| `/workflows/[id]/edit` | Save | Stay (toast) |
| `/workflows/new` | Save first time | `/workflows/[id]/edit` (URL updates) |
| `/executions` | Click execution | `/executions/[id]` |
| `/executions/[id]` | View workflow | `/workflows/[id]` |
| `/connections` | Connect new | OAuth popup → `/connections` |
| `/templates` | Use template | `/workflows/[id]/edit` |
| `/settings/*` | Navigate | `/settings/*` tabs |

---

*Next: [05-tech-stack.md](05-tech-stack.md) — Technology stack decisions*

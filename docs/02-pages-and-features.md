# 02 — All Pages & Their Features

---

## Overview

All pages divided into 3 groups:
1. **Public Pages** — No login required
2. **Auth Pages** — Login/signup flow
3. **App Pages** — Authenticated dashboard, builder, settings

Desktop-only for MVP. No mobile layout.

---

## PUBLIC PAGES

---

### Page 1: Landing Page (Homepage)

| Attribute | Detail |
|-----------|--------|
| **Route** | `/` |
| **Auth** | Not required |
| **Purpose** | Convert visitors into signups |

**Sections (top to bottom):**

1. **Hero Section**
   - Headline: Value proposition (e.g., "Build Automations Visually. Or Just Describe Them.")
   - Subheadline: One-liner explanation
   - CTA button: "Get Started Free"
   - Secondary CTA: "Watch Demo"
   - Hero image/animation: Animated workflow builder preview (React Flow screenshot or video)

2. **How It Works (3 steps)**
   - Step 1: "Describe or Build" — Show AI chat + visual builder
   - Step 2: "Connect Your Tools" — Show OAuth integration cards
   - Step 3: "Automate & Monitor" — Show execution dashboard

3. **Key Features Grid**
   - Visual Workflow Builder (React Flow)
   - AI Chat Assistant
   - 15+ Integrations
   - Real-time Execution Monitoring
   - Automatic Retries & Error Handling
   - Templates Library

4. **Integration Logos Bar**
   - Show logos of all supported services (Gmail, Slack, Notion, GitHub, etc.)
   - "And more coming..."

5. **Use Case Showcase**
   - 3-4 real-world examples with brief descriptions
   - "When I get a new order → notify team → update spreadsheet → email customer"

6. **Pricing Preview**
   - Quick tier comparison
   - CTA: "See Full Pricing"

7. **Testimonials / Social Proof**
   - (Post-launch) User quotes
   - (Pre-launch) "Join 500+ beta users" or waitlist count

8. **Footer**
   - Links: Features, Pricing, Docs, Blog, Contact
   - Social links
   - Copyright

**User Actions:**
- Click "Get Started Free" → `/signup`
- Click "Watch Demo" → Opens demo video modal
- Click "See Pricing" → `/pricing`
- Click integration logo → `/integrations`
- Navigate to any section via top navbar

---

### Page 2: Features Page

| Attribute | Detail |
|-----------|--------|
| **Route** | `/features` |
| **Auth** | Not required |
| **Purpose** | Deep dive into product capabilities |

**Sections:**

1. **Visual Workflow Builder**
   - Description of React Flow-based builder
   - Node types: Trigger, Action, Condition, Loop, Delay
   - Drag-and-drop, zoom, pan, minimap
   - Screenshot/GIF of builder in action

2. **AI Chat Assistant**
   - Describe what you want in plain English
   - AI suggests nodes, connections, configurations
   - Edit workflows conversationally
   - "Fix this error" capability

3. **Integrations**
   - List of all supported services
   - OAuth one-click connect
   - Custom webhook support
   - HTTP request node for any API

4. **Execution Engine**
   - Reliable execution with retries
   - Real-time progress tracking
   - Execution history and logs
   - Error notifications

5. **Templates**
   - Pre-built workflow templates
   - One-click import
   - Category browsing

6. **Security**
   - OAuth token encryption
   - Data encryption in transit/at rest
   - No credential storage in plain text

---

### Page 3: Pricing Page

| Attribute | Detail |
|-----------|--------|
| **Route** | `/pricing` |
| **Auth** | Not required |
| **Purpose** | Show pricing tiers, drive signups |

**Sections:**

1. **Pricing Toggle**: Monthly / Annual (annual = 2 months free)

2. **Pricing Cards** (3-4 tiers):

| Feature | Free | Starter ($9/mo) | Pro ($29/mo) | Business ($79/mo) |
|---------|------|-----------------|--------------|-------------------|
| Workflows | 5 | 25 | Unlimited | Unlimited |
| Executions/mo | 500 | 5,000 | 50,000 | 500,000 |
| Integrations | All | All | All | All |
| AI Chat | 20 msgs/day | 100 msgs/day | Unlimited | Unlimited |
| Execution History | 7 days | 30 days | 90 days | 1 year |
| Webhook Triggers | 2 | 10 | Unlimited | Unlimited |
| Priority Support | No | Email | Email + Chat | Dedicated |
| Custom Domains | No | No | Yes | Yes |
| API Access | No | Yes | Yes | Yes |

3. **FAQ Section**
   - "What counts as an execution?"
   - "Can I change plans?"
   - "What happens if I exceed limits?"
   - "Do you offer refunds?"

4. **CTA**: "Start Free — No Credit Card Required"

---

### Page 4: Integrations Page (Public)

| Attribute | Detail |
|-----------|--------|
| **Route** | `/integrations` |
| **Auth** | Not required |
| **Purpose** | Show all available integrations, drive signups |

**Sections:**

1. **Search Bar** — Filter integrations by name
2. **Category Filters** — Communication, Productivity, Developer, E-commerce, etc.
3. **Integration Cards Grid**
   - Each card: Logo, Name, Category, Short description, "Connect" badge
   - Click → Integration detail page or signup prompt
4. **"Request Integration" CTA** — Form to suggest new integrations
5. **Coming Soon Section** — Integrations in development

---

### Page 5: Templates Page

| Attribute | Detail |
|-----------|--------|
| **Route** | `/templates` |
| **Auth** | Not required |
| **Purpose** | Show pre-built workflow templates, inspire users |

**Sections:**

1. **Search Bar** — Search templates by keyword
2. **Category Filters** — Marketing, Sales, DevOps, Productivity, etc.
3. **Template Cards Grid**
   - Each card: Template name, description, integrations used (logos), "Use Template" button
   - Click → Template detail page (shows workflow preview)
4. **Popular Templates** — Top 10 most used
5. **CTA**: "Create Your Own" → Signup

---

### Page 6: Documentation

| Attribute | Detail |
|-----------|--------|
| **Route** | `/docs` |
| **Auth** | Not required |
| **Purpose** | Help users understand and use the platform |

**Structure:**

1. **Getting Started**
   - What is [Product Name]?
   - Creating your first automation
   - Understanding the workflow builder
   - Using AI chat assistant

2. **Workflow Builder Guide**
   - Node types explained
   - Triggers explained
   - Connecting nodes
   - Configuring nodes
   - Testing workflows
   - Using conditions and loops

3. **Integrations Guide**
   - How to connect a service
   - Per-integration documentation (each service)
   - Troubleshooting connections

4. **API Reference** (Post-MVP)
   - REST API endpoints
   - Authentication
   - Webhook setup

5. **FAQ / Troubleshooting**
   - Common errors and fixes
   - Contact support

**Implementation**: Static site generator (e.g., Next.js MDX pages or Fumadocs/Nextra)

---

### Page 7: Contact Page

| Attribute | Detail |
|-----------|--------|
| **Route** | `/contact` |
| **Auth** | Not required |
| **Purpose** | Let users reach out |

**Sections:**

1. **Contact Form**: Name, Email, Subject (dropdown: Bug, Feature Request, Sales, Other), Message
2. **Email Address**: support@[product].com
3. **Social Links**: Twitter/X, Discord, GitHub
4. **Response Time**: "We reply within 24 hours"

---

## AUTH PAGES

---

### Page 8: Sign Up

| Attribute | Detail |
|-----------|--------|
| **Route** | `/signup` |
| **Auth** | Not required (redirect if already logged in) |
| **Purpose** | Create new account |

**Features:**
- **NextAuth providers**: Google OAuth, GitHub OAuth, Email/Password
- **Form fields** (for email signup): Name, Email, Password, Confirm Password
- **Validations**: Email format, password strength (min 8 chars, 1 uppercase, 1 number)
- **Terms**: "By signing up, you agree to our Terms of Service and Privacy Policy"
- **Post-signup**: Redirect to `/onboarding` (first time) or `/dashboard` 
- **Link**: "Already have an account? Sign in"

---

### Page 9: Sign In

| Attribute | Detail |
|-----------|--------|
| **Route** | `/signin` |
| **Auth** | Not required |
| **Purpose** | Authenticate existing user |

**Features:**
- **NextAuth providers**: Google OAuth, GitHub OAuth, Email/Password
- **Form fields**: Email, Password
- **"Remember me"** checkbox
- **"Forgot password?"** link → `/forgot-password`
- **Post-login**: Redirect to `/dashboard`
- **Link**: "Don't have an account? Sign up"

---

### Page 10: Forgot Password

| Attribute | Detail |
|-----------|--------|
| **Route** | `/forgot-password` |
| **Auth** | Not required |
| **Purpose** | Reset password via email |

**Flow:**
1. User enters email
2. System sends reset link (valid 1 hour)
3. Success message: "Check your email for reset link"
4. Link goes to `/reset-password?token=xxx`

---

### Page 11: Reset Password

| Attribute | Detail |
|-----------|--------|
| **Route** | `/reset-password` |
| **Auth** | Not required (requires valid token) |
| **Purpose** | Set new password |

**Features:**
- New Password field
- Confirm Password field
- Token validation (expired? invalid?)
- Success → Redirect to `/signin`

---

### Page 12: Email Verification

| Attribute | Detail |
|-----------|--------|
| **Route** | `/verify-email` |
| **Auth** | Not required (requires valid token) |
| **Purpose** | Verify email address after signup |

**Flow:**
1. After signup, email sent with verification link
2. Click link → `/verify-email?token=xxx`
3. Token verified → Account activated → Redirect to `/onboarding`
4. Token invalid/expired → Show error + resend option

---

### Page 13: OAuth Callback

| Attribute | Detail |
|-----------|--------|
| **Route** | `/api/auth/callback/[provider]` |
| **Auth** | Handled by NextAuth |
| **Purpose** | Handle OAuth redirects from Google, GitHub |

**Notes:**
- Handled automatically by NextAuth
- No UI needed — it's a redirect route
- On success → `/dashboard` or `/onboarding`
- On error → `/signin` with error message

---

## APP PAGES (Authenticated)

---

### Page 14: Onboarding

| Attribute | Detail |
|-----------|--------|
| **Route** | `/onboarding` |
| **Auth** | Required (shown only on first login) |
| **Purpose** | Guide new user to first success |

**Steps (wizard):**

1. **Welcome Screen**
   - "Welcome, [Name]! Let's set up your first automation."
   - Skip option available

2. **What do you automate?** (optional survey)
   - Select categories: Marketing, Sales, DevOps, Support, Personal, Other
   - Purpose: Personalize template recommendations

3. **Connect Your First Service**
   - Show top 5 integrations (Gmail, Slack, Notion, Google Sheets, GitHub)
   - One-click OAuth connect
   - "Skip for now" option

4. **Try a Template or Build Your Own**
   - Show 3 recommended templates based on step 2
   - Or "Start from scratch" → `/workflows/new`

5. **Done!**
   - Redirect to `/dashboard`
   - Confetti animation or success message

---

### Page 15: Dashboard

| Attribute | Detail |
|-----------|--------|
| **Route** | `/dashboard` |
| **Auth** | Required |
| **Purpose** | Overview of all automations, quick actions, stats |

**Layout:**

**Top Bar:**
- Logo + product name (links to `/dashboard`)
- Search bar (search workflows by name)
- Notifications bell icon
- User avatar + dropdown (Settings, Billing, Logout)

**Sidebar Navigation:**
- Dashboard (active)
- Workflows
- Executions
- Connections
- Templates
- Settings
- Help

**Main Content:**

1. **Stats Cards Row**
   - Total Workflows (active/paused/draft)
   - Total Executions (today/this week/this month)
   - Success Rate (%)
   - Active Connections (count)

2. **Quick Actions**
   - "Create New Workflow" button (primary) → `/workflows/new`
   - "Import Template" button → `/templates`
   - "Connect Service" button → `/connections`

3. **Recent Workflows**
   - Table/list: Name, Status (Active/Paused/Draft/Error), Last Executed, Executions Count, Actions (Edit/Run/Pause/Delete)
   - Click workflow name → `/workflows/[id]`

4. **Recent Executions**
   - Table: Workflow Name, Status (Success/Failed/Running), Started At, Duration, Actions (View Logs)
   - Click → `/executions/[id]`

5. **Usage Meter** (for free tier users)
   - Executions used / limit
   - Workflows used / limit
   - "Upgrade" button if near limit

**Empty State:**
- If no workflows: "Create your first automation" with CTA button
- Show 3 suggested templates

---

### Page 16: Workflows List

| Attribute | Detail |
|-----------|--------|
| **Route** | `/workflows` |
| **Auth** | Required |
| **Purpose** | List all workflows, manage them |

**Features:**

1. **Top Bar**
   - "New Workflow" button → `/workflows/new`
   - Search input
   - Filter by: Status (All/Active/Paused/Draft/Error), Integration

2. **Workflows Table**
   - Columns: Name, Status badge, Trigger type, Last executed, Total executions, Created date
   - Row actions: Edit, Duplicate, Run manually, Pause/Resume, Delete
   - Bulk select + bulk actions (delete, pause, resume)

3. **Pagination** — 20 per page

4. **Empty State** — "No workflows yet. Create your first!" + template suggestions

---

### Page 17: Workflow Builder (React Flow)

| Attribute | Detail |
|-----------|--------|
| **Route** | `/workflows/new` and `/workflows/[id]/edit` |
| **Auth** | Required |
| **Purpose** | Visual workflow builder — THE core feature |

**This is the most complex page. Full spec in [03-workflow-builder.md](03-workflow-builder.md)**

**Key elements on this page:**
- React Flow canvas (center)
- Node panel / sidebar (left)
- Node configuration panel (right, opens on node click)
- AI chat panel (right, togglable)
- Top bar: Workflow name, Save, Test, Activate/Deactivate, Settings
- Bottom bar: Zoom controls, minimap toggle, execution status

---

### Page 18: Workflow Detail / View

| Attribute | Detail |
|-----------|--------|
| **Route** | `/workflows/[id]` |
| **Auth** | Required |
| **Purpose** | View a single workflow's details and execution history |

**Sections:**

1. **Header**
   - Workflow name (editable)
   - Status badge (Active/Paused/Draft)
   - Actions: Edit (→ builder), Run Now, Pause, Duplicate, Delete

2. **Workflow Preview**
   - Read-only React Flow canvas showing the workflow visually
   - Nodes with labels, connections visible

3. **Execution History (for this workflow)**
   - Table: Execution ID, Status, Started, Duration, Trigger Source
   - Click → `/executions/[id]`

4. **Settings Tab**
   - Trigger configuration
   - Retry settings
   - Notification preferences (notify on failure?)
   - Tags/labels

---

### Page 19: Executions List

| Attribute | Detail |
|-----------|--------|
| **Route** | `/executions` |
| **Auth** | Required |
| **Purpose** | View all workflow executions across all workflows |

**Features:**

1. **Filters**
   - By workflow (dropdown)
   - By status (Success/Failed/Running/Cancelled)
   - By date range

2. **Executions Table**
   - Columns: Execution ID, Workflow Name, Status, Trigger Type, Started, Duration
   - Click row → `/executions/[id]`

3. **Pagination** — 50 per page

4. **Auto-refresh** — Poll every 5 seconds for running executions (or WebSocket)

---

### Page 20: Execution Detail

| Attribute | Detail |
|-----------|--------|
| **Route** | `/executions/[id]` |
| **Auth** | Required |
| **Purpose** | Debug and view a single execution in detail |

**Sections:**

1. **Header**
   - Execution ID
   - Workflow name (link to workflow)
   - Overall status (Success/Failed/Running)
   - Started at, Duration, Trigger source

2. **Visual Execution Flow**
   - React Flow canvas showing the workflow
   - Each node colored by execution status:
     - Green = success
     - Red = failed
     - Gray = not reached
     - Blue = currently running
     - Yellow = skipped (condition not met)

3. **Step-by-Step Logs**
   - For each node executed:
     - Node name and type
     - Status
     - Input data (JSON, collapsible)
     - Output data (JSON, collapsible)
     - Duration
     - Error message (if failed)

4. **Actions**
   - "Retry from failed step" button
   - "Retry entire workflow" button
   - "View Workflow" link

---

### Page 21: Connections (My Integrations)

| Attribute | Detail |
|-----------|--------|
| **Route** | `/connections` |
| **Auth** | Required |
| **Purpose** | Manage connected services (OAuth tokens) |

**Features:**

1. **Connected Services List**
   - Each card: Service logo, name, connected email/account, connected date, status (Active/Expired)
   - Actions: Test Connection, Reconnect, Disconnect

2. **Add New Connection**
   - "Connect New Service" button
   - Opens modal/page with available integrations
   - Click integration → OAuth flow → Returns to `/connections`

3. **Connection Health**
   - Green dot = active, working
   - Red dot = token expired, needs reconnect
   - Yellow dot = rate limited

---

### Page 22: Templates Library (Authenticated)

| Attribute | Detail |
|-----------|--------|
| **Route** | `/templates` |
| **Auth** | Required |
| **Purpose** | Browse and import workflow templates |

**Features:**

1. **Search and Filter** — By category, by integration
2. **Template Cards** — Name, description, integrations used, "Use This Template" button
3. **Template Detail Modal**
   - Read-only React Flow preview
   - Description
   - What integrations are needed
   - "Import to My Workflows" button → Creates a copy in the user's account → Opens in builder

---

### Page 23: Settings — Profile

| Attribute | Detail |
|-----------|--------|
| **Route** | `/settings/profile` |
| **Auth** | Required |
| **Purpose** | Manage user profile |

**Features:**
- Edit name
- Email (read-only, verified badge)
- Avatar upload
- Timezone selection
- Language preference (English only for MVP)
- Delete account (with confirmation modal)

---

### Page 24: Settings — Billing

| Attribute | Detail |
|-----------|--------|
| **Route** | `/settings/billing` |
| **Auth** | Required |
| **Purpose** | Manage subscription and billing |

**Features:**
- Current plan display
- Usage stats (executions used / limit)
- Upgrade/downgrade buttons
- Payment method management (Stripe integration)
- Invoice history
- Cancel subscription

---

### Page 25: Settings — Notifications

| Attribute | Detail |
|-----------|--------|
| **Route** | `/settings/notifications` |
| **Auth** | Required |
| **Purpose** | Configure notification preferences |

**Features:**
- Email notifications toggle:
  - Workflow failures: On/Off
  - Daily execution summary: On/Off
  - Weekly usage report: On/Off
  - Product updates: On/Off
- In-app notifications toggle

---

### Page 26: Settings — API Keys

| Attribute | Detail |
|-----------|--------|
| **Route** | `/settings/api-keys` |
| **Auth** | Required |
| **Purpose** | Manage API keys for programmatic access (Post-MVP, show "Coming Soon" for MVP) |

**Features:**
- Generate new API key
- List existing keys (name, created date, last used, actions)
- Revoke key
- API documentation link

---

### Page 27: Settings — Security

| Attribute | Detail |
|-----------|--------|
| **Route** | `/settings/security` |
| **Auth** | Required |
| **Purpose** | Security settings |

**Features:**
- Change password
- Active sessions list (browser, last active, IP) with "Revoke" option
- Two-factor authentication (Post-MVP, show "Coming Soon")
- Login history (last 10 logins)

---

### Page 28: Help Center

| Attribute | Detail |
|-----------|--------|
| **Route** | `/help` |
| **Auth** | Required |
| **Purpose** | In-app help and support |

**Features:**
- Search help articles
- Quick links to docs
- Contact support form
- Report a bug
- Feature request form
- Link to community (Discord)

---

## ADMIN PAGES (Internal Use Only)

---

### Page 29: Admin Dashboard

| Attribute | Detail |
|-----------|--------|
| **Route** | `/admin` |
| **Auth** | Required (admin role only) |
| **Purpose** | System overview for platform operators |

**Features:**
- Total users (signups today/this week/this month)
- Total workflows (active/total)
- Total executions (today, success rate)
- Active connections by service
- System health indicators (API response time, queue depth, error rate)
- Revenue stats (if billing active)

---

### Page 30: Admin — User Management

| Attribute | Detail |
|-----------|--------|
| **Route** | `/admin/users` |
| **Auth** | Required (admin role only) |
| **Purpose** | Manage platform users |

**Features:**
- Users table: Name, Email, Plan, Workflows, Executions, Joined date, Status
- Search/filter users
- View user details
- Suspend/unsuspend user
- Impersonate user (for debugging)

---

### Page 31: Admin — System Health

| Attribute | Detail |
|-----------|--------|
| **Route** | `/admin/health` |
| **Auth** | Required (admin role only) |
| **Purpose** | Monitor system health |

**Features:**
- Service status: API, Database, Redis, Queue Workers, WebSocket
- Error rates per integration
- Queue depth and processing speed
- Recent errors log
- Integration health (which APIs are failing?)

---

## Page Count Summary

| Group | Pages | Count |
|-------|-------|-------|
| Public | Landing, Features, Pricing, Integrations, Templates, Docs, Contact | 7 |
| Auth | Signup, Signin, Forgot Password, Reset Password, Email Verify, OAuth Callback | 6 |
| App | Onboarding, Dashboard, Workflows List, Workflow Builder, Workflow Detail, Executions List, Execution Detail, Connections, Templates, Settings (Profile, Billing, Notifications, API Keys, Security), Help | 16 |
| Admin | Dashboard, Users, Health | 3 |
| **Total** | | **32** |

---

*Next: [03-workflow-builder.md](03-workflow-builder.md) — React Flow Workflow Builder deep dive*

# 06 — Integrations Plan

---

## 6.1 MVP Integrations (15 Services)

### Tier 1 — Launch Day (Build First)

| # | Service | Category | Auth Method | Complexity | Triggers | Actions | Why MVP |
|---|---------|----------|-------------|------------|----------|---------|---------|
| 1 | **Gmail** | Email | OAuth 2.0 (Google) | Medium | New email, New email matching filter | Send email, Reply, Search, Add label | Most requested automation trigger |
| 2 | **Google Sheets** | Productivity | OAuth 2.0 (Google) | Easy | New row added, Row updated | Add row, Update row, Read rows, Create sheet | Universal data store for non-technical users |
| 3 | **Slack** | Communication | OAuth 2.0 | Easy | New message in channel, New DM, Reaction added | Send message, Send DM, Create channel, Update message, Upload file | Top workplace communication tool |
| 4 | **Discord** | Communication | OAuth 2.0 + Bot Token | Medium | New message, Member joined, Reaction added | Send message, Create channel, Add role, Send embed | Large creator/dev community demand |
| 5 | **Notion** | Productivity | OAuth 2.0 | Medium | Page created, Database item added, Database item updated | Create page, Update page, Query database, Add database item | Popular productivity tool, complex API |
| 6 | **GitHub** | Developer | OAuth 2.0 | Easy | New issue, New PR, PR merged, New commit, Star added | Create issue, Close issue, Create comment, Create PR, Add label | Developer audience core tool |
| 7 | **Google Drive** | Storage | OAuth 2.0 (Google) | Easy | New file, File updated, File shared | Upload file, Create folder, Move file, Share file | File management in workflows |
| 8 | **Webhook (Incoming)** | Utility | None / API Key | Easy | Receive HTTP request | — (trigger only) | Allows connecting ANY service |
| 9 | **HTTP Request** | Utility | Various | Easy | — (action only) | GET, POST, PUT, DELETE to any URL | Universal connector for any API |
| 10 | **Google Calendar** | Productivity | OAuth 2.0 (Google) | Easy | New event, Event updated, Event starting soon | Create event, Update event, Delete event, Find events | Schedule-based workflows |

### Tier 2 — Week 2-3 After Core (Add Next)

| # | Service | Category | Auth Method | Complexity | Triggers | Actions | Why MVP |
|---|---------|----------|-------------|------------|----------|---------|---------|
| 11 | **Telegram** | Communication | Bot Token | Easy | New message, New member, Command received | Send message, Send photo, Send document, Pin message | Popular in dev/crypto communities |
| 12 | **Airtable** | Productivity | OAuth 2.0 / API Key | Medium | New record, Record updated | Create record, Update record, Search records, Delete record | Spreadsheet-database hybrid, popular with no-code users |
| 13 | **Trello** | Project Management | OAuth 1.0a | Medium | Card created, Card moved, Comment added | Create card, Move card, Add comment, Create list | Visual project management |
| 14 | **Twitter/X** | Social Media | OAuth 2.0 | Hard | New mention, New follower, New tweet matching keyword | Post tweet, Reply, Retweet, Like, Send DM | Social media automation demand |
| 15 | **Linear** | Developer | OAuth 2.0 / API Key | Easy | Issue created, Issue updated, Issue completed | Create issue, Update issue, Add comment | Modern dev team project management |

---

## 6.2 Post-MVP Integrations (Next 20 — Months 3-6)

### Priority 1 (Month 3-4)

| # | Service | Category | Why | Complexity |
|---|---------|----------|-----|------------|
| 16 | **Microsoft Outlook** | Email | Enterprise users, Office 365 ecosystem | Medium |
| 17 | **Microsoft Teams** | Communication | Enterprise communication | Medium |
| 18 | **Jira** | Project Management | Enterprise dev teams | Medium |
| 19 | **Shopify** | E-commerce | E-commerce automation is a huge use case | Medium |
| 20 | **Stripe** | Payments | Payment event automations (new charge, subscription, etc.) | Easy |

### Priority 2 (Month 4-5)

| # | Service | Category | Why | Complexity |
|---|---------|----------|-----|------------|
| 21 | **HubSpot** | CRM | Sales/marketing automation | Medium |
| 22 | **Mailchimp** | Email Marketing | Newsletter/campaign automation | Easy |
| 23 | **Typeform / Google Forms** | Forms | Form submission triggers | Easy |
| 24 | **Twilio** | SMS/Voice | SMS notifications in workflows | Easy |
| 25 | **OpenAI** | AI | AI processing within workflows (summarize, classify, generate) | Easy |

### Priority 3 (Month 5-6)

| # | Service | Category | Why | Complexity |
|---|---------|----------|-----|------------|
| 26 | **Asana** | Project Management | Alternative to Trello/Jira | Medium |
| 27 | **Dropbox** | Storage | File storage alternative | Easy |
| 28 | **Figma** | Design | Design team workflows | Medium |
| 29 | **Supabase** | Database | Database operations in workflows | Easy |
| 30 | **PostgreSQL / MySQL** | Database | Direct DB queries in workflows | Medium |
| 31 | **AWS S3** | Storage | Cloud storage operations | Easy |
| 32 | **Firebase** | Backend | Firestore/Auth event triggers | Medium |
| 33 | **Calendly** | Scheduling | Meeting booked triggers | Easy |
| 34 | **Zoom** | Communication | Meeting created/ended triggers | Medium |
| 35 | **WhatsApp Business** | Communication | Business messaging | Hard |

---

## 6.3 Long-Term Integrations (Months 6-12)

| Category | Services |
|----------|----------|
| **CRM** | Salesforce, Pipedrive, Zoho CRM |
| **E-commerce** | WooCommerce, BigCommerce, Gumroad, Lemonsqueezy |
| **Social Media** | Instagram, LinkedIn, TikTok, YouTube, Facebook Pages |
| **Marketing** | ConvertKit, Beehiiv, Substack, ActiveCampaign, Brevo |
| **Support** | Zendesk, Intercom, Freshdesk, Crisp |
| **Payments** | PayPal, Razorpay, Paddle |
| **Dev Tools** | GitLab, Bitbucket, Vercel, Netlify, Railway |
| **Communication** | Twitch, Matrix |
| **AI** | Anthropic Claude, Google Gemini, Replicate, Stability AI |
| **Productivity** | ClickUp, Monday.com, Basecamp, Todoist |
| **Analytics** | Google Analytics, Mixpanel, Amplitude |
| **No-Code** | Webflow, Bubble |

---

## 6.4 Per-Integration Specification Template

Below is the detailed spec for each MVP integration.

---

### Integration: Gmail

| Attribute | Detail |
|-----------|--------|
| **Auth** | OAuth 2.0 (Google Cloud Console) |
| **Scopes** | `gmail.readonly`, `gmail.send`, `gmail.modify`, `gmail.labels` |
| **API** | Gmail API v1 (REST) |
| **Rate Limits** | 250 quota units/second per user |
| **Webhook Support** | Yes (Google Pub/Sub push notifications for new emails) |
| **Free Tier Limits** | No limits on Gmail API itself (just Google Cloud quotas) |

**Triggers:**

| Trigger | Method | Config Fields |
|---------|--------|--------------|
| New Email Received | Webhook (Pub/Sub) or Polling (every 1-5 min) | Filter: From, Subject contains, Has attachment, Label |
| New Email Matching Search | Polling | Gmail search query (e.g., `from:@company.com is:unread`) |

**Actions:**

| Action | Config Fields | Output |
|--------|--------------|--------|
| Send Email | To, CC, BCC, Subject, Body (HTML/plain), Attachments | Message ID, Thread ID |
| Reply to Email | Thread ID (from trigger), Body | Message ID |
| Search Emails | Query, Max results | Array of email objects |
| Add Label | Message ID, Label name | Success/failure |
| Mark as Read/Unread | Message ID | Success/failure |

---

### Integration: Google Sheets

| Attribute | Detail |
|-----------|--------|
| **Auth** | OAuth 2.0 (Google Cloud Console, same project as Gmail) |
| **Scopes** | `spreadsheets`, `drive.file` |
| **API** | Google Sheets API v4 |
| **Rate Limits** | 300 requests/minute per project |
| **Webhook Support** | No (polling required) |

**Triggers:**

| Trigger | Method | Config Fields |
|---------|--------|--------------|
| New Row Added | Polling (every 1-5 min) | Spreadsheet ID, Sheet name |
| Row Updated | Polling | Spreadsheet ID, Sheet name, Column to watch |

**Actions:**

| Action | Config Fields | Output |
|--------|--------------|--------|
| Add Row | Spreadsheet ID, Sheet name, Column values (mapped) | Row number added |
| Update Row | Spreadsheet ID, Sheet, Row number, Column values | Updated row |
| Read Rows | Spreadsheet ID, Sheet, Range | Array of row data |
| Create Spreadsheet | Name | Spreadsheet ID, URL |
| Find Row | Spreadsheet, Sheet, Search column, Search value | Row data |

---

### Integration: Slack

| Attribute | Detail |
|-----------|--------|
| **Auth** | OAuth 2.0 (Slack App) |
| **Scopes** | `chat:write`, `channels:read`, `channels:history`, `users:read`, `files:write` |
| **API** | Slack Web API + Events API |
| **Rate Limits** | Tier 2: 20 requests/minute for most methods |
| **Webhook Support** | Yes (Events API with socket mode or HTTP endpoint) |

**Triggers:**

| Trigger | Method | Config Fields |
|---------|--------|--------------|
| New Message in Channel | Webhook (Events API) | Channel selection |
| New Direct Message | Webhook (Events API) | — |
| Reaction Added | Webhook (Events API) | Emoji filter (optional) |
| New Channel Created | Webhook (Events API) | — |

**Actions:**

| Action | Config Fields | Output |
|--------|--------------|--------|
| Send Message | Channel, Message text, Blocks (rich formatting) | Message timestamp |
| Send DM | User, Message | Message timestamp |
| Update Message | Channel, Message timestamp, New text | Updated timestamp |
| Create Channel | Channel name, Private? | Channel ID |
| Upload File | Channel, File, Title | File ID |
| Set Topic | Channel, Topic text | — |

---

### Integration: Discord

| Attribute | Detail |
|-----------|--------|
| **Auth** | OAuth 2.0 + Bot Token (user authorizes bot to their server) |
| **Scopes** | `bot`, `applications.commands`, `messages.read` |
| **API** | Discord API v10 |
| **Rate Limits** | 50 requests/second globally |
| **Webhook Support** | Yes (Gateway events via bot, or Discord webhooks) |

**Triggers:**

| Trigger | Method | Config Fields |
|---------|--------|--------------|
| New Message | Bot Gateway | Server, Channel |
| Member Joined | Bot Gateway | Server |
| Reaction Added | Bot Gateway | Server, Channel |

**Actions:**

| Action | Config Fields | Output |
|--------|--------------|--------|
| Send Message | Server, Channel, Message, Embed (optional) | Message ID |
| Create Channel | Server, Channel name, Category | Channel ID |
| Add Role | Server, User, Role | — |
| Send Embed | Server, Channel, Title, Description, Color, Fields | Message ID |

---

### Integration: Notion

| Attribute | Detail |
|-----------|--------|
| **Auth** | OAuth 2.0 (Notion Integration) |
| **Scopes** | Configured per integration in Notion |
| **API** | Notion API v2022-06-28 |
| **Rate Limits** | 3 requests/second |
| **Webhook Support** | No (polling required) |

**Triggers:**

| Trigger | Method | Config Fields |
|---------|--------|--------------|
| Database Item Created | Polling (every 2-5 min) | Database ID |
| Database Item Updated | Polling | Database ID |
| Page Created | Polling | Parent page ID |

**Actions:**

| Action | Config Fields | Output |
|--------|--------------|--------|
| Create Page | Parent (page/database), Title, Properties, Content blocks | Page ID, URL |
| Update Page | Page ID, Properties to update | Updated page |
| Query Database | Database ID, Filter, Sort | Array of pages/items |
| Add Database Item | Database ID, Properties | Item ID |
| Append Block | Page ID, Content blocks | Block IDs |

---

### Integration: GitHub

| Attribute | Detail |
|-----------|--------|
| **Auth** | OAuth 2.0 (GitHub App or OAuth App) |
| **Scopes** | `repo`, `issues`, `pull_requests` |
| **API** | GitHub REST API v3 + Webhooks |
| **Rate Limits** | 5000 requests/hour (authenticated) |
| **Webhook Support** | Yes (first-class webhook support) |

**Triggers:**

| Trigger | Method | Config Fields |
|---------|--------|--------------|
| New Issue | Webhook | Repository |
| New Pull Request | Webhook | Repository |
| PR Merged | Webhook | Repository |
| New Commit (Push) | Webhook | Repository, Branch |
| New Star | Webhook | Repository |
| Issue Comment | Webhook | Repository |

**Actions:**

| Action | Config Fields | Output |
|--------|--------------|--------|
| Create Issue | Repo, Title, Body, Labels, Assignees | Issue number, URL |
| Close Issue | Repo, Issue number | — |
| Add Comment | Repo, Issue/PR number, Comment body | Comment ID |
| Create PR | Repo, Title, Body, Head branch, Base branch | PR number |
| Add Label | Repo, Issue/PR number, Label names | — |
| Create Release | Repo, Tag, Name, Body | Release URL |

---

### Integration: Google Drive

| Attribute | Detail |
|-----------|--------|
| **Auth** | OAuth 2.0 (Google, same project as Gmail/Sheets) |
| **API** | Google Drive API v3 |
| **Webhook Support** | Yes (watch changes via Pub/Sub) |

**Triggers:** New file created, File updated, File shared with me
**Actions:** Upload file, Create folder, Move file, Copy file, Share file, Delete file

---

### Integration: Webhook (Incoming)

| Attribute | Detail |
|-----------|--------|
| **Auth** | None / Optional API Key header |
| **API** | Custom endpoint generated per workflow |

**How it works:**
1. System generates unique URL: `https://app.flowpilot.com/webhook/wh_[id]`
2. External service POSTs to this URL
3. Workflow triggers with request body as input data
4. Support: Query params, headers, JSON body, form data

---

### Integration: HTTP Request

| Attribute | Detail |
|-----------|--------|
| **Auth** | Configurable per request (None, Basic, Bearer, API Key, OAuth) |

**Config fields:** URL, Method, Headers, Query Params, Body (JSON/Form/Raw), Timeout, Follow redirects
**Output:** Response body, status code, headers

---

### Integration: Google Calendar

| Attribute | Detail |
|-----------|--------|
| **Auth** | OAuth 2.0 (Google) |
| **API** | Google Calendar API v3 |
| **Webhook Support** | Yes (push notifications) |

**Triggers:** New event created, Event updated, Event starting in X minutes
**Actions:** Create event, Update event, Delete event, Find free time slots, List events

---

## 6.5 OAuth Connection Flow (How Integrations Connect)

| Step | Detail |
|------|--------|
| 1 | User clicks "Connect [Service]" on `/connections` page or inside workflow builder |
| 2 | Frontend opens OAuth popup: `https://accounts.google.com/o/oauth2/v2/auth?client_id=...&redirect_uri=...&scope=...` |
| 3 | User grants permissions on the service's consent screen |
| 4 | Service redirects to our callback URL: `/api/integrations/callback/[provider]?code=xxx` |
| 5 | Backend exchanges authorization code for access token + refresh token |
| 6 | Tokens are encrypted (AES-256) and stored in `connections` database table |
| 7 | Popup closes, frontend receives success signal via `postMessage` or polling |
| 8 | Connection appears in user's connections list with green status |
| 9 | Access token used for all API calls. Refresh token used to get new access token when expired. |

**Token Refresh Strategy:**
- OAuth access tokens typically expire in 1 hour
- Before each API call, check if token expires in < 5 minutes
- If so, use refresh token to get new access token
- Store new tokens, update `connections` table
- If refresh fails (revoked), mark connection as "Expired" and notify user

---

## 6.6 Integration Architecture

**How integrations are structured in code:**

Each integration is a module with:
- `auth.ts` — OAuth configuration (scopes, URLs, token exchange)
- `triggers.ts` — Trigger definitions (webhook handlers, polling logic)
- `actions.ts` — Action definitions (API call functions)
- `schema.ts` — Zod schemas for input/output validation
- `metadata.ts` — Display info (name, icon, description, available triggers/actions)

**Adding a new integration requires:**
1. Create the module with the 5 files above
2. Register in the integration registry
3. Add OAuth credentials to environment variables
4. Add to the UI integration list

**Goal:** Adding a new integration should take 2-4 hours per service.

---

*Next: [07-architecture.md](07-architecture.md) — System architecture and database schema*

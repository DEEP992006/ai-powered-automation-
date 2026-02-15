# 01 — Product Overview & Vision

---

## 1.1 Product Names (5 Options)

| # | Name | Reasoning |
|---|------|-----------|
| 1 | **FlowPilot** | "Flow" = workflows, "Pilot" = AI guiding you. Short, memorable, implies autopilot for your tasks. |
| 2 | **AutoForge** | "Auto" = automation, "Forge" = build/create. Strong brand, implies crafting powerful automations. |
| 3 | **NodeBridge** | Directly references the node-based visual builder and connecting (bridging) services together. |
| 4 | **PipelineAI** | Clear what it does — AI-powered pipelines/workflows. Professional, enterprise-friendly. |
| 5 | **Synkra** | Short, unique, sounds like "sync" — implies syncing services together seamlessly. |

## 1.2 Taglines

| Name | Tagline Options |
|------|----------------|
| FlowPilot | "Build automations. Not code." / "Your workflows on autopilot." / "Connect everything. Automate anything." |
| AutoForge | "Forge your automation empire." / "Where ideas become workflows." / "Automation, forged by AI." |
| NodeBridge | "Bridge your tools. Automate your work." / "Connect. Automate. Scale." / "The bridge between your apps." |
| PipelineAI | "AI-powered workflow automation." / "From idea to automation in seconds." / "Smart pipelines for smart teams." |
| Synkra | "Sync your workflow. Free your time." / "Intelligent automation, simplified." / "Your tools, finally in sync." |

## 1.3 Elevator Pitch (30 seconds)

> "Most automation platforms force you to manually drag, configure, and debug every step. Our platform lets you visually build workflows with a powerful node-based editor — or just describe what you want in plain English and let AI build it for you. We connect 15+ services out of the box, handle OAuth automatically, execute workflows reliably with retries and real-time monitoring, and cost a fraction of Zapier. It's n8n's power meets AI intelligence, in a modern interface anyone can use."

## 1.4 Problem Statement

**What pain points are we solving:**

1. **Automation is tedious** — Current tools require manually connecting every node, mapping every field, understanding API structures. Non-technical users give up. Technical users waste time.

2. **Expensive at scale** — Zapier charges per task execution. A moderately active business easily hits $100+/month. Small teams and indie hackers are priced out.

3. **Poor error handling** — When workflows break (API changes, auth expires, rate limits hit), most platforms give cryptic errors. Users don't know what went wrong or how to fix it.

4. **No AI-native experience** — Existing platforms bolt on AI as an afterthought (Zapier's AI is limited). None offer a true "describe what you want" experience alongside a full visual builder.

5. **Integration lock-in** — Platforms gate integrations behind expensive tiers. Users can't connect their full stack without upgrading.

## 1.5 Solution Overview

| Problem | Our Solution |
|---------|-------------|
| Automation is tedious | Visual node builder (React Flow) with drag-and-drop + AI chat assistant that can generate/modify workflows from natural language |
| Expensive at scale | Generous free tier, flat pricing (not per-execution), self-host option planned |
| Poor error handling | Real-time execution monitoring, clear error messages, automatic retries, execution replay |
| No AI-native experience | Built-in AI chat panel in the workflow builder — ask it to add nodes, fix errors, explain workflows |
| Integration lock-in | All integrations available on free tier (limits on execution count, not integration count) |

## 1.6 Unique Value Proposition

**"The only automation platform where you can visually build AND conversationally create workflows — with real-time monitoring, smart error recovery, and pricing that doesn't punish growth."**

What makes us different from:
- **vs Zapier**: Visual node builder (not linear), AI assistant, 10x cheaper, real-time monitoring
- **vs n8n**: Better UI/UX, AI assistant, managed hosting option, modern tech stack
- **vs Make**: AI-powered workflow generation, better error handling, simpler pricing
- **vs Workato/Tray.io**: Accessible to non-enterprise users, modern UI, AI-first

## 1.7 Three-Year Vision

| Timeframe | Goal |
|-----------|------|
| **Month 0-6** | Launch MVP with 15 integrations, visual builder + AI chat, gain first 500 users |
| **Month 6-12** | 30+ integrations, team features, marketplace for community templates, 5,000 users |
| **Year 2** | 100+ integrations, self-hosted option, enterprise features, API for developers, 50,000 users |
| **Year 3** | AI agents that proactively suggest automations, integration SDK for third-party developers, 200,000+ users, $1M+ ARR |

## 1.8 Target Audience (MVP)

**Primary: Solo users — freelancers, indie hackers, small business owners, developers**

| Attribute | Detail |
|-----------|--------|
| Age | 22-45 |
| Role | Freelancer, indie hacker, solopreneur, developer, small business owner |
| Technical level | Beginner to intermediate (can use tools like Notion, Slack, but may not code) |
| Pain | Spending 5-10 hours/week on repetitive tasks they could automate |
| Budget | $0-30/month for automation tools |
| Current tools | Maybe tried Zapier (too expensive), IFTTT (too limited), or manual processes |

**5 Customer Personas:**

### Persona 1: "Dev-Freelancer Raj"
- **Role**: Freelance web developer, solo
- **Pain**: Manually sends invoices, follows up on emails, updates project trackers across 5 tools
- **Goal**: Automate client communication and project management workflows
- **Tech level**: High (can code, comfortable with APIs)
- **Budget**: $0-15/month
- **Usage**: Connects GitHub → Slack → Notion → Gmail. Trigger: new commit → notify client → update board

### Persona 2: "E-commerce Emma"
- **Role**: Runs a Shopify store solo
- **Pain**: Manually tracks orders, sends follow-up emails, updates inventory spreadsheets
- **Goal**: Automate order processing and customer communication
- **Tech level**: Low (uses Shopify admin, Google Sheets, email)
- **Budget**: $10-25/month
- **Usage**: Shopify order → Google Sheets → email customer → Slack notification

### Persona 3: "Content Creator Carlos"
- **Role**: YouTube creator and blogger
- **Pain**: Cross-posting content, tracking analytics, managing sponsors
- **Goal**: Automate content distribution and sponsor communication
- **Tech level**: Medium (uses many tools, can follow tutorials)
- **Budget**: $0-10/month
- **Usage**: New YouTube video → tweet → update Notion → email newsletter list

### Persona 4: "Startup Sarah"
- **Role**: Solo founder of a SaaS startup
- **Pain**: Doing everything — support, marketing, ops — manually
- **Goal**: Automate lead nurturing, support ticket routing, metrics reporting
- **Tech level**: Medium-high (technical founder)
- **Budget**: $15-30/month
- **Usage**: New signup → Slack alert → add to CRM → send welcome email → schedule follow-up

### Persona 5: "Agency Alex"
- **Role**: Runs a small marketing agency (solo or 2-3 people)
- **Pain**: Managing multiple client accounts, reporting, social scheduling
- **Goal**: Automate client reporting and social media workflows
- **Tech level**: Medium
- **Budget**: $20-30/month
- **Usage**: Google Analytics data → generate report → email client → update project board

## 1.9 Market Opportunity

| Metric | Estimate |
|--------|----------|
| **TAM** (Total Addressable Market) | $15B — Global workflow automation market (2025) |
| **SAM** (Serviceable Available) | $3B — SMB and individual automation segment |
| **SOM** (Serviceable Obtainable) | $5M — Realistic capture in 3 years targeting indie/SMB segment |

**Why now:**
1. LLMs are good enough to understand natural language → workflow translation
2. Remote work explosion increased tool fragmentation (average worker uses 9+ SaaS tools)
3. Zapier's pricing has pushed cost-conscious users to seek alternatives
4. n8n proved there's massive demand for open-source/affordable automation
5. AI hype cycle means users actively WANT AI-powered tools

---

*Next: [02-pages-and-features.md](02-pages-and-features.md) — All pages and their features*

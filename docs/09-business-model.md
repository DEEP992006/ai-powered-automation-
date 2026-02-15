# 09 — Business Model & Pricing

---

## 9.1 Pricing Model: Hybrid (Flat + Usage)

**Decision: Flat monthly price with execution limits per tier. NOT per-execution pricing.**

| Why Not Per-Execution (Zapier model) | Why Flat + Limits (Our model) |
|--------------------------------------|-------------------------------|
| Users fear unpredictable bills | Users know exactly what they'll pay |
| Discourages usage (people avoid automations to save money) | Encourages usage within limits |
| Complex billing | Simple billing |
| Zapier users complain about this constantly | Competitive advantage |

---

## 9.2 Pricing Tiers

### Free

| Item | Detail |
|------|--------|
| **Price** | $0/month |
| **Target** | Hobbyists, evaluators, students |
| **Workflows** | 5 active |
| **Executions** | 500/month |
| **Integrations** | All available |
| **AI Chat** | 20 messages/day |
| **History** | 7 days |
| **Triggers** | Webhook (2), Schedule (15 min minimum), Manual |
| **Support** | Community (Discord) + Docs |
| **Purpose** | Get users hooked, build habit, social proof |

### Starter — $9/month ($7/month annual)

| Item | Detail |
|------|--------|
| **Price** | $9/month (or $84/year) |
| **Target** | Freelancers, indie hackers with a few automations |
| **Workflows** | 25 active |
| **Executions** | 5,000/month |
| **Integrations** | All |
| **AI Chat** | 100 messages/day |
| **History** | 30 days |
| **Triggers** | Webhook (10), Schedule (5 min minimum), Manual, App |
| **Support** | Email (48h response) |
| **Extras** | API access |

### Pro — $29/month ($24/month annual)

| Item | Detail |
|------|--------|
| **Price** | $29/month (or $288/year) |
| **Target** | Power users, small business owners |
| **Workflows** | Unlimited |
| **Executions** | 50,000/month |
| **Integrations** | All |
| **AI Chat** | Unlimited |
| **History** | 90 days |
| **Triggers** | All types, unlimited webhooks, 1 min schedule |
| **Support** | Email (24h response) + Chat |
| **Extras** | API access, custom domains, priority execution |

### Business — $79/month ($66/month annual)

| Item | Detail |
|------|--------|
| **Price** | $79/month (or $792/year) |
| **Target** | Growing businesses, agencies |
| **Workflows** | Unlimited |
| **Executions** | 500,000/month |
| **Integrations** | All |
| **AI Chat** | Unlimited |
| **History** | 1 year |
| **Triggers** | All, 1 min schedule |
| **Support** | Dedicated email (12h) + Chat |
| **Extras** | Everything in Pro + advanced logging, audit trail, SSO (future) |

---

## 9.3 Revenue Projections

### Assumptions

| Assumption | Value |
|------------|-------|
| Monthly organic signups (Month 1) | 100 |
| Monthly signup growth rate | 30% month-over-month |
| Free-to-Starter conversion | 5% |
| Free-to-Pro conversion | 2% |
| Free-to-Business conversion | 0.5% |
| Monthly churn (paid) | 5% |
| Average time to convert (free → paid) | 2 weeks |

### Month-by-Month (Year 1) — Moderate Scenario

| Month | New Signups | Total Users | Starter | Pro | Business | MRR |
|-------|-------------|-------------|---------|-----|----------|-----|
| 1 | 100 | 100 | 5 | 2 | 0 | $103 |
| 2 | 130 | 226 | 11 | 4 | 1 | $254 |
| 3 | 169 | 387 | 19 | 8 | 2 | $489 |
| 4 | 220 | 594 | 30 | 12 | 3 | $786 |
| 5 | 286 | 859 | 43 | 17 | 4 | $1,129 |
| 6 | 371 | 1,195 | 60 | 24 | 6 | $1,564 |
| 7 | 483 | 1,624 | 81 | 32 | 8 | $2,093 |
| 8 | 628 | 2,170 | 108 | 43 | 11 | $2,764 |
| 9 | 816 | 2,866 | 143 | 57 | 14 | $3,618 |
| 10 | 1,061 | 3,758 | 188 | 75 | 19 | $4,709 |
| 11 | 1,379 | 4,901 | 245 | 98 | 24 | $6,109 |
| 12 | 1,793 | 6,372 | 318 | 127 | 32 | $7,917 |

**Year 1 Total Revenue: ~$31,500**
**End of Year 1 ARR: ~$95,000**

### Year 2-3 Projections

| Metric | End Year 1 | End Year 2 | End Year 3 |
|--------|-----------|-----------|-----------|
| Total Users | 6,400 | 40,000 | 150,000 |
| Paid Users | 477 | 4,000 | 15,000 |
| MRR | $7,900 | $52,000 | $195,000 |
| ARR | $95,000 | $624,000 | $2,340,000 |

---

## 9.4 Cost Projections (MVP Phase)

### Monthly Infrastructure Costs

| Service | Free Tier | When You'll Pay | Cost When Paying |
|---------|-----------|-----------------|-----------------|
| **Neon (PostgreSQL)** | 0.5 GB free | ~1,000 users | $19/month (Launch plan) |
| **Upstash (Redis)** | 10K commands/day | ~500 active workflows | $10/month (Pay-as-you-go) |
| **OpenAI API** | Pay per use | Day 1 | $2-10/month at MVP scale |
| **Resend (Email)** | 100/day free | ~3,000 emails/month | $20/month |
| **Cloudflare R2** | 10 GB free | ~6 months | $0.015/GB-month |
| **Sentry** | 5K events/month free | ~2,000 users | $26/month (Team plan) |
| **PostHog** | 1M events/month free | ~50,000 users | $0 for long time |
| **Vercel** (if used) | Hobby free | Commercial use | $20/month (Pro) |
| **Domain** | — | Day 1 | $12/year |
| **Stripe** | 2.9% + $0.30 per txn | First paid user | ~3% of revenue |

### Monthly Cost at Different Stages

| Stage | Users | Monthly Cost |
|-------|-------|-------------|
| **MVP Launch** | 0-100 | $5-15/month |
| **Month 3** | 300+ | $20-40/month |
| **Month 6** | 1,000+ | $50-80/month |
| **Month 12** | 5,000+ | $150-300/month |

**Key insight:** At $0-25/month budget, you can comfortably run MVP for 3-6 months before meaningful costs kick in. By that time, paid users should cover costs.

---

## 9.5 Break-Even Analysis

| Scenario | Break-Even Month | Assumptions |
|----------|-----------------|-------------|
| **Conservative** | Month 10-12 | 50 signups/month, 4% conversion |
| **Moderate** | Month 7-8 | 100 signups/month, 7% conversion |
| **Aggressive** | Month 4-5 | 200 signups/month, 10% conversion |

**Break-even requires:** ~$300/month revenue to cover infrastructure costs
- That's ~33 Starter users OR ~10 Pro users OR mix

---

## 9.6 Stripe Implementation Plan

| Feature | Detail |
|---------|--------|
| **Products** | 4 products in Stripe: Free, Starter, Pro, Business |
| **Prices** | Monthly + Annual for each (8 prices total) |
| **Checkout** | Stripe Checkout (hosted page — saves building payment forms) |
| **Portal** | Stripe Customer Portal (hosted — manages subscription, payment method, invoices) |
| **Webhooks** | Listen for: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed` |
| **Metering** | Track executions and AI messages in our `usage` table. Enforce limits in application code, NOT in Stripe. |

---

*Next: [10-roadmap.md](10-roadmap.md) — Development roadmap and phases*

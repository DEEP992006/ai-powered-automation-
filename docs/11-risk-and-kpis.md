# 11 — Risk Analysis & KPIs

---

## 11.1 Technical Risks

### Risk 1: AI Generates Invalid or Broken Workflows

| Attribute | Detail |
|-----------|--------|
| **Probability** | High |
| **Impact** | Medium |
| **Description** | LLM produces node configs that don't match API schemas, invalid connections, or missing required fields |
| **Mitigation** | 1. Strict Zod validation on all AI output. 2. Re-prompt LLM with specific errors (up to 2 retries). 3. If still invalid, ask user to manually adjust. 4. Build regression test suite of 50+ prompt→workflow pairs. 5. Improve prompts over time based on failure patterns. |

### Risk 2: OAuth Token Expiry / Revocation

| Attribute | Detail |
|-----------|--------|
| **Probability** | High |
| **Impact** | Medium |
| **Description** | User's OAuth tokens expire or get revoked, breaking active workflows |
| **Mitigation** | 1. Proactive token refresh (refresh before expiry). 2. Background job checks token validity every hour. 3. If refresh fails, mark connection as "expired" and notify user immediately. 4. Execution engine catches auth errors and pauses workflow instead of failing silently. |

### Risk 3: Integration API Breaking Changes

| Attribute | Detail |
|-----------|--------|
| **Probability** | Medium |
| **Impact** | High |
| **Description** | Third-party services (Google, Slack, etc.) change their APIs, breaking our integration code |
| **Mitigation** | 1. Pin API versions where possible (e.g., Gmail API v1). 2. Monitor integration error rates — spike = possible breaking change. 3. Build integration tests that run daily against real APIs. 4. Abstract integration code behind interfaces — easy to update implementation. |

### Risk 4: BullMQ / Redis Failures

| Attribute | Detail |
|-----------|--------|
| **Probability** | Low |
| **Impact** | High |
| **Description** | Redis goes down → queue stops → no workflow executions |
| **Mitigation** | 1. Upstash has built-in redundancy (managed service). 2. Implement dead-letter queue for failed jobs. 3. Health check endpoint monitors Redis connectivity. 4. Alert on queue depth exceeding threshold. 5. For critical workflows, log trigger events to PostgreSQL as backup — can replay after recovery. |

### Risk 5: Execution Engine Performance at Scale

| Attribute | Detail |
|-----------|--------|
| **Probability** | Medium (at scale) |
| **Impact** | High |
| **Description** | Too many concurrent executions overwhelm the worker, causing delays and timeouts |
| **Mitigation** | 1. BullMQ concurrency limits per worker (start at 10). 2. Priority queues (paid users first). 3. Execution timeout limits per plan. 4. Horizontal scaling: spin up more worker instances. 5. Monitor queue depth and processing time. |

### Risk 6: Data Leaks Between Users

| Attribute | Detail |
|-----------|--------|
| **Probability** | Low |
| **Impact** | Critical |
| **Description** | Bug allows one user to access another user's workflows, executions, or OAuth tokens |
| **Mitigation** | 1. Every database query includes `WHERE user_id = ?`. 2. tRPC middleware enforces user context on all procedures. 3. Code review checklist: "Does this query filter by user?" 4. OAuth tokens encrypted with per-user salt. 5. Security audit before launch. |

### Risk 7: Code Node Sandbox Escape

| Attribute | Detail |
|-----------|--------|
| **Probability** | Low |
| **Impact** | Critical |
| **Description** | User-written JavaScript in Code nodes escapes sandbox and accesses server filesystem/network |
| **Mitigation** | 1. Use `isolated-vm` package (V8 isolate — no access to Node.js APIs). 2. CPU time limit (5 seconds per execution). 3. Memory limit (50MB per isolate). 4. No network access from sandbox. 5. No filesystem access. 6. Whitelist only safe globals (`JSON`, `Math`, `Date`, `String`, `Array`). |

### Risk 8: WebSocket Connection Limits

| Attribute | Detail |
|-----------|--------|
| **Probability** | Medium (at scale) |
| **Impact** | Medium |
| **Description** | Too many WebSocket connections on a single server exceed limits |
| **Mitigation** | 1. For MVP, single server handles hundreds of connections easily. 2. At scale, use Socket.io Redis adapter for multi-server. 3. Disconnect idle connections after 10 minutes. 4. Client implements auto-reconnect. |

### Risk 9: OpenAI API Downtime / Rate Limits

| Attribute | Detail |
|-----------|--------|
| **Probability** | Medium |
| **Impact** | Medium (AI feature only) |
| **Description** | OpenAI API is temporarily unavailable or rate limits hit |
| **Mitigation** | 1. AI chat is a secondary feature — visual builder always works without AI. 2. Implement retry with exponential backoff for OpenAI calls. 3. Show clear message: "AI is temporarily unavailable. You can continue building manually." 4. Consider adding Anthropic as fallback provider (Post-MVP). |

### Risk 10: Database Performance Degradation

| Attribute | Detail |
|-----------|--------|
| **Probability** | Medium (after 6+ months) |
| **Impact** | High |
| **Description** | Execution logs table grows massive, slowing queries |
| **Mitigation** | 1. Index all frequently queried columns. 2. Retention policy: delete/archive old execution logs per plan limits. 3. Partition `execution_steps` table by date (if needed). 4. Use connection pooling (Neon handles this). 5. Cache frequently accessed data in Redis. |

---

## 11.2 Business Risks

### Risk 1: "Too Late to Market"

| Attribute | Detail |
|-----------|--------|
| **Probability** | Medium |
| **Impact** | Medium |
| **Description** | Zapier, n8n, Make already dominate. Hard to win users. |
| **Mitigation** | We're not competing head-on. Our angle: AI-first + visual builder + cheaper pricing. Target underserved segment (indie hackers, freelancers priced out of Zapier). n8n is open-source but has poor UX — we offer better UX. |

### Risk 2: Low User Activation

| Attribute | Detail |
|-----------|--------|
| **Probability** | Medium |
| **Impact** | High |
| **Description** | Users sign up but never create a workflow or connect a service |
| **Mitigation** | 1. Guided onboarding (4-step wizard). 2. Pre-built templates (one-click import). 3. AI assistant lowers barrier ("just describe what you want"). 4. Track activation metrics from day 1 and iterate. 5. Send follow-up emails if user hasn't created first workflow in 48 hours. |

### Risk 3: Users Won't Pay

| Attribute | Detail |
|-----------|--------|
| **Probability** | Medium |
| **Impact** | High |
| **Description** | Free tier is too generous, no reason to upgrade |
| **Mitigation** | 1. Free tier limits are intentionally tight (5 workflows, 500 executions). 2. Enough to get value, not enough for serious use. 3. Show usage meter prominently. 4. Upsell at the right moments (when approaching limits). 5. AI chat messages as a conversion lever (20/day free, 100 on Starter). |

### Risk 4: High Churn

| Attribute | Detail |
|-----------|--------|
| **Probability** | Medium |
| **Impact** | High |
| **Description** | Paid users cancel after 1-2 months |
| **Mitigation** | 1. Focus on reliability — if workflows work consistently, users stay. 2. Engagement features (weekly reports, optimization suggestions). 3. Exit survey to understand reasons. 4. Improve based on feedback. 5. Annual pricing incentive (2 months free). |

### Risk 5: Solo Developer Burnout

| Attribute | Detail |
|-----------|--------|
| **Probability** | High |
| **Impact** | High |
| **Description** | 5-month solo build is grueling. Support burden adds up post-launch. |
| **Mitigation** | 1. Strict scope management — cut features ruthlessly for MVP. 2. Take breaks (don't work 7 days/week). 3. Plan to hire first team member by month 4-6 (if revenue supports it, even part-time). 4. Automate support with docs and self-serve. 5. Community forum (Discord) for peer support. |

---

## 11.3 Legal & Regulatory Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **GDPR compliance** | Medium | Privacy policy, data deletion on request, data processing agreements, EU data residency option (Neon has EU regions) |
| **OAuth Terms of Service** | Medium | Follow each provider's OAuth usage guidelines. Don't store tokens in logs. Use tokens only for authorized actions. |
| **Data breaches** | Critical | Encryption at rest and in transit. Minimal data collection. Regular security audits. Incident response plan. |
| **Service uptime liability** | Low | Terms of Service with "as-is" clause. No SLA guarantees until Enterprise tier. |

---

## 11.4 Key Performance Indicators (KPIs)

### User Acquisition Metrics

| Metric | Target (Month 3) | Target (Month 6) | Target (Month 12) |
|--------|------------------|------------------|-------------------|
| Monthly signups | 200 | 500 | 1,500 |
| Visitor-to-signup conversion | 3-5% | 5-8% | 8-12% |
| Cost per acquisition (CPA) | $0 (organic) | $0-5 | $5-15 |
| Top traffic sources | Product Hunt, Reddit, SEO | SEO, word-of-mouth | SEO, content, referrals |

### User Activation Metrics

| Metric | Target |
|--------|--------|
| % users who connect first integration | > 50% within 24 hours |
| % users who create first workflow | > 40% within 48 hours |
| % users who execute first workflow | > 30% within 72 hours |
| Time to first successful execution | < 10 minutes |
| Onboarding completion rate | > 70% |

### User Engagement Metrics

| Metric | Target |
|--------|--------|
| DAU/MAU ratio (stickiness) | > 20% |
| Workflows per user (avg) | > 3 |
| Executions per user/month (avg) | > 50 |
| AI chat messages per user/month | > 10 |
| Session duration (avg) | > 5 minutes |

### User Retention Metrics

| Metric | Target |
|--------|--------|
| Day 1 retention | > 60% |
| Day 7 retention | > 40% |
| Day 30 retention | > 25% |
| Monthly churn (paid) | < 5% |
| Monthly churn (free) | < 15% |

### Revenue Metrics

| Metric | Target (Month 6) | Target (Month 12) |
|--------|------------------|-------------------|
| Free-to-paid conversion | 5-7% | 7-10% |
| MRR | $1,500 | $8,000 |
| ARPU (paid users) | $15 | $18 |
| LTV (estimated) | $180 | $250 |
| LTV/CAC ratio | > 3:1 | > 5:1 |

### Product Health Metrics

| Metric | Target |
|--------|--------|
| Execution success rate | > 95% |
| Average execution time | < 10 seconds |
| API response time (p95) | < 500ms |
| Uptime | > 99.5% |
| Error rate | < 1% |
| Support tickets per 100 users | < 5/month |
| NPS score | > 40 |

---

## 11.5 What to Track — Implementation

| Tool | What It Tracks |
|------|---------------|
| **PostHog** | Page views, feature usage, funnel analysis, retention cohorts, user paths |
| **Sentry** | Errors, exceptions, performance, crash reports |
| **Custom (database)** | Executions, workflows, connections, revenue, usage per user |
| **Stripe Dashboard** | MRR, churn, subscriptions, revenue |
| **Google Search Console** | SEO traffic, keywords, rankings |

### Key Events to Track in PostHog

| Event | Properties |
|-------|-----------|
| `user_signed_up` | method (google/github/email) |
| `onboarding_completed` | steps_completed, time_taken |
| `integration_connected` | provider |
| `workflow_created` | trigger_type, node_count, from_template |
| `workflow_activated` | trigger_type |
| `workflow_executed` | status, duration, trigger_type |
| `ai_chat_message_sent` | message_length |
| `ai_workflow_generated` | node_count, success |
| `template_imported` | template_id |
| `plan_upgraded` | from_plan, to_plan |
| `plan_downgraded` | from_plan, to_plan |
| `plan_cancelled` | reason |

---

## 11.6 Resource Planning

### Solo Developer Timeline Reality Check

| Question | Answer |
|----------|--------|
| Can you build MVP alone? | Yes, in ~5 months with focused effort (30-40 hours/week) |
| Biggest bottleneck? | Integrations — each one takes 1-3 days including testing |
| What to cut if behind schedule? | AI chat (make it post-launch), reduce integrations to 8, skip templates |
| When to hire? | After first revenue OR month 4 (whichever comes first) |

### First Hires (When Revenue Supports It)

| Priority | Role | When | Why |
|----------|------|------|-----|
| 1 | Part-time frontend dev | Month 4-6 | Help build features while you focus on backend/infra |
| 2 | Part-time designer | Month 4-6 | Improve UI/UX, create marketing assets |
| 3 | Full-stack dev | Month 8-10 | Scale feature development, share on-call |
| 4 | DevOps (part-time) | Month 10-12 | Infrastructure, scaling, monitoring |

### Monthly Budget Breakdown

| Month | Infra | AI API | Tools | Marketing | Total |
|-------|-------|--------|-------|-----------|-------|
| 1-3 | $5-15 | $2-5 | $0-12 | $0 | $7-32 |
| 4-6 | $20-50 | $5-15 | $20 | $0-50 | $45-135 |
| 7-9 | $50-100 | $15-30 | $20 | $50-100 | $135-250 |
| 10-12 | $100-200 | $30-50 | $20 | $100-200 | $250-470 |

---

## 11.7 Top Recommendations

### Focus On First

1. **Nail the workflow builder experience** — This is the product. If the builder is great (fast, intuitive, reliable), users will stay. Spend 60% of development time here.
2. **Make integrations rock-solid** — Flaky integrations = users leave. Test OAuth flows exhaustively. Handle token refresh perfectly.
3. **Ship fast with 8-10 integrations** — Don't wait for 20. Launch with the top 10, add more based on user requests.

### Avoid / Defer

1. **Don't build a mobile app** — Desktop-only is fine for workflow building. Mobile adds massive scope.
2. **Don't build team features for MVP** — Solo users only. Team/org features are a 3-month project on their own.
3. **Don't over-invest in AI** — AI chat is a differentiator but the visual builder is the foundation. If AI is delayed, the product still works.

### Watch Out For

1. **Scope creep** — Every feature you add delays launch by 1-2 weeks. Be ruthless about MVP scope.
2. **Perfectionism on the landing page** — A good-enough landing page with a great product beats a perfect landing page with no product.
3. **Premature optimization** — Don't worry about scaling to 100K users when you have 10. Optimize when you feel pain, not before.

---

*See [README.md](../README.md) for the complete document index.*

# 08 — Execution Engine & AI Strategy

---

## 8.1 Execution Engine Overview

The execution engine is what makes workflows actually run. It takes a workflow definition (nodes + edges JSON) and executes each step in order, handling data flow, errors, retries, and real-time updates.

---

## 8.2 Trigger Types & How They Start Executions

### Webhook Trigger

| Aspect | Detail |
|--------|--------|
| **How it works** | External service sends HTTP request to our webhook URL |
| **URL format** | `https://app.[domain].com/api/webhook/[webhook_id]` |
| **Processing** | API route receives request → Validates webhook exists and workflow is active → Creates execution record → Enqueues BullMQ job |
| **Latency** | Request received → job enqueued in < 100ms → Respond 200 OK immediately |
| **Reliability** | If BullMQ is down, return 503 (external service will retry). Log to Redis as backup. |

### Schedule Trigger (Cron)

| Aspect | Detail |
|--------|--------|
| **How it works** | BullMQ Repeatable Jobs with cron expressions |
| **Implementation** | When workflow with schedule trigger is activated, create a BullMQ repeatable job with the cron expression |
| **When deactivated** | Remove the repeatable job from the queue |
| **Timezone** | Store user's timezone, convert cron to UTC |
| **Minimum interval** | Free tier: 15 minutes. Paid: 1 minute. |

### Manual Trigger

| Aspect | Detail |
|--------|--------|
| **How it works** | User clicks "Run" in the UI → tRPC mutation → Enqueue job |
| **Input data** | Optional: user can provide JSON input, or use empty `{}` |

### App Trigger (Polling-based)

| Aspect | Detail |
|--------|--------|
| **Services without webhooks** | Google Sheets, Notion — no native webhook support |
| **How it works** | Polling worker runs on schedule (every 2-5 minutes) → Calls service API to check for new items → Compares with last known state (stored in Redis) → If new items found, create execution |
| **Polling state** | Store last polled timestamp or last item ID in Redis per workflow |
| **Rate limiting** | Respect service API rate limits. Space out polls across users. |

### App Trigger (Webhook-based)

| Aspect | Detail |
|--------|--------|
| **Services with webhooks** | GitHub, Slack, Gmail (via Pub/Sub) |
| **How it works** | When workflow activated, register webhook/subscription with the external service → External service sends events to our endpoint → Process like Webhook Trigger |
| **When deactivated** | Unregister webhook/subscription with external service |

---

## 8.3 Execution Flow (Step by Step)

### Step 1: Job Received by Worker

BullMQ worker receives `workflow.execute` job with payload:
```
{
  workflowId: "wf_abc123",
  executionId: "exec_xyz789",
  triggerData: { ... },
  userId: "user_123"
}
```

### Step 2: Load Workflow Definition

- Read workflow from database (or Redis cache)
- Parse nodes and edges arrays
- Build execution graph (topological sort of nodes based on edges)

### Step 3: Execute Nodes in Order

**Execution algorithm:**

1. Start with the trigger node — its output = `triggerData`
2. Find all nodes connected to trigger node's output
3. For each connected node:
   a. Resolve input data (map data references like `{{nodes.trigger.data.subject}}` to actual values)
   b. Execute the node (call integration API, evaluate condition, etc.)
   c. Store result in execution context
   d. Emit Socket.io event: `{ executionId, nodeId, status: 'success'|'failed', data }`
   e. Write step record to `execution_steps` table
4. Find next nodes in graph and repeat
5. If node is a condition (If/Else):
   - Evaluate condition
   - Follow only the matching branch (True or False)
   - Mark skipped branch nodes as "skipped"
6. If node is a loop:
   - Iterate over input array
   - Execute loop body for each item
   - Collect outputs
7. If parallel branches exist (multiple nodes connected to same output handle):
   - Execute all branches in parallel (Promise.all)
   - Wait for all to complete
8. If merge node:
   - Wait for all incoming branches
   - Combine data

### Step 4: Handle Completion

- Update `executions` table: status = 'success' or 'failed', set completed_at, duration_ms
- Emit Socket.io completion event
- If failed and notifications enabled, enqueue notification job
- Update workflow stats (execution_count, last_executed_at)
- Update usage counters

---

## 8.4 Data Resolution Between Nodes

**How `{{nodes.node_1.data.subject}}` gets resolved:**

1. During execution, maintain an `executionContext` object:
   ```
   {
     nodes: {
       node_1: { data: { from: "user@email.com", subject: "Invoice #123", body: "..." } },
       node_2: { data: { result: true } }
     },
     variables: { ... },
     trigger: { data: { ... } }
   }
   ```

2. Before executing a node, scan all its config fields for `{{...}}` patterns
3. Replace each pattern with the actual value from `executionContext`
4. If referenced node hasn't executed yet (shouldn't happen with topological sort), throw error

**Supported expressions:**
- `{{nodes.[nodeId].data.[path]}}` — Reference node output
- `{{trigger.data.[path]}}` — Reference trigger data
- `{{variables.[name]}}` — Reference set variables
- `{{now}}` — Current timestamp
- `{{env.[name]}}` — Environment variables (Post-MVP)

---

## 8.5 Error Handling Strategy

### Per-Node Error Handling

| Error Type | Response |
|------------|----------|
| **API error (4xx)** | Mark node as failed. Store error. Check if retry-eligible. |
| **API error (5xx)** | Mark node as failed. Automatically retry (transient error). |
| **Timeout** | Mark node as failed. Configurable timeout (default 30 seconds per node). |
| **Auth error (401/403)** | Mark node as failed. Mark connection as expired. Notify user to reconnect. |
| **Rate limit (429)** | Wait for retry-after header, then retry. Up to 3 attempts. |
| **Invalid data** | Mark node as failed. Show which field had invalid data. |
| **Network error** | Retry up to 3 times with exponential backoff. |

### Retry Strategy

| Setting | Default | Configurable |
|---------|---------|:------------:|
| **Max retries** | 3 | ✅ (0-10) |
| **Retry delay** | Exponential backoff: 5s, 30s, 120s | ✅ |
| **Retry on** | 5xx errors, timeouts, network errors | ✅ |
| **Don't retry on** | 4xx errors (except 429), auth errors | ✅ |
| **Continue on error** | No (stop workflow) | ✅ (can set to continue) |

### Error Handler Node

User can place an Error Handler node after any action node:
- **On error**: Retry / Continue / Stop / Run fallback branch
- **Fallback branch**: Alternative actions if the main path fails
- **Example**: If Slack message fails → Send email instead

### Notification on Failure

- If workflow fails and `notifyOnFailure` is enabled in workflow settings:
  - Send email via Resend: "Your workflow [name] failed at step [node name]: [error message]"
  - In-app notification via Socket.io
  - Include link to execution detail page

---

## 8.6 Execution Concurrency & Limits

| Plan | Max Concurrent Executions | Max Execution Duration |
|------|--------------------------|----------------------|
| Free | 2 | 60 seconds |
| Starter | 5 | 120 seconds |
| Pro | 20 | 300 seconds |
| Business | 50 | 600 seconds |

**Queue priority:**
- Paid users get higher BullMQ priority than free users
- Real-time (webhook) triggers get higher priority than scheduled triggers
- Manual test executions get highest priority

---

## 8.7 Execution Logging

**What's logged per step:**
- Node ID, name, type
- Input data (JSON)
- Output data (JSON)
- Status (success/failed/skipped)
- Duration (ms)
- Error message (if failed)
- Timestamp

**Storage:**
- Recent executions (within retention period): `execution_steps` table in PostgreSQL
- Old executions: Archive to Cloudflare R2 as JSON files, delete from PostgreSQL

**Retention:**
| Plan | Execution History Retention |
|------|---------------------------|
| Free | 7 days |
| Starter | 30 days |
| Pro | 90 days |
| Business | 1 year |

---

## 8.8 AI Strategy

### What AI Does in the Product

| Feature | Description | LLM Model |
|---------|-------------|-----------|
| **Workflow Generation** | User describes workflow in English → AI generates nodes + edges + config | GPT-4o-mini |
| **Workflow Modification** | "Add a condition before Slack" → AI modifies existing workflow | GPT-4o-mini |
| **Workflow Explanation** | "What does this workflow do?" → AI explains in plain English | GPT-4o-mini |
| **Error Help** | "Fix this error" → AI suggests fixes based on error context | GPT-4o-mini |
| **Suggestions** | AI suggests improvements: "You could add error handling here" | GPT-4o-mini |

### Prompt Engineering Strategy

**System Prompt (always sent):**

The system prompt tells the LLM:
1. You are a workflow automation assistant
2. You can create/modify workflows by outputting structured JSON
3. Here are the available node types: [list all node types with their schemas]
4. Here are the user's connected integrations: [list]
5. Output format: JSON with `nodes[]` and `edges[]` arrays, matching our schema
6. Rules: Every workflow must start with one trigger. Nodes must be connected. Config must be valid.

**User Message (per request):**

The user's natural language input, plus context:
- Current workflow state (existing nodes/edges)
- Connected services
- Conversation history (last 10 messages)

**Output Parsing:**

1. LLM returns response with two parts:
   - `message`: Natural language explanation for the user
   - `actions`: Array of structured actions to apply to the canvas
2. Actions can be:
   - `addNode({ type, position, data })`
   - `removeNode(nodeId)`
   - `addEdge({ source, target, sourceHandle })`
   - `removeEdge(edgeId)`
   - `updateNodeData(nodeId, { data })`
3. Frontend applies these actions to Zustand store → React Flow re-renders

**Validation Pipeline:**
1. LLM generates workflow changes
2. Parse output (Zod validation on the structured response)
3. Validate: Are all referenced node types valid? Are edges valid? Are configs complete?
4. If invalid: Re-prompt LLM with error details (up to 2 retries)
5. If valid: Apply to canvas and respond to user

### AI Chat Conversation Flow

| User Says | AI Does |
|-----------|---------|
| "Add a Gmail trigger for new emails" | Adds Gmail trigger node to canvas, asks which account to use |
| "When the email is from @boss.com, send a Slack message to #urgent" | Adds If/Else condition + Slack action, connects them |
| "What does this workflow do?" | Reads current nodes/edges, generates English description |
| "The Slack message is failing with channel_not_found" | Suggests: "The channel name might be incorrect. Check if #urgent exists in your Slack workspace." |
| "Remove the delay node" | Removes the delay node, reconnects edges |
| "Add error handling" | Adds Error Handler node after each action node |

### AI Cost Management

| Strategy | Detail |
|----------|--------|
| **Model selection** | GPT-4o-mini for 95% of requests ($0.15/1M input) |
| **Prompt caching** | Cache system prompt (same for all users) — OpenAI supports prompt caching |
| **Response caching** | Cache common requests in Redis (e.g., "add a Gmail trigger" generates similar output) |
| **Rate limiting** | Free: 20 AI messages/day. Starter: 100/day. Pro+: Unlimited. |
| **Token limits** | Max 4000 tokens per response. Truncate conversation history to last 10 messages. |
| **Cost estimate** | 1000 daily AI messages × ~500 tokens avg = 500K tokens/day = ~$0.08/day = ~$2.50/month |

### AI Limitations (Be Honest with Users)

| Limitation | How We Handle |
|------------|---------------|
| AI might generate invalid configs | Validation pipeline catches errors, re-prompts or asks user |
| AI might not understand complex logic | Fallback: "I couldn't fully understand that. Can you break it into smaller steps?" |
| AI can't test workflows | AI suggests configs, user must Test to verify |
| AI doesn't know user's specific data | AI asks: "What's the channel name?" rather than guessing |

---

## 8.9 Real-Time Updates (Socket.io)

### Events Emitted

| Event | When | Data | Who Receives |
|-------|------|------|-------------|
| `execution:step:start` | Node starts executing | `{ executionId, nodeId, status: 'running' }` | User who owns the workflow |
| `execution:step:complete` | Node finishes | `{ executionId, nodeId, status: 'success'/'failed', data, error }` | Same user |
| `execution:complete` | Workflow finishes | `{ executionId, status, duration }` | Same user |
| `notification` | Any notification event | `{ type, message, link }` | Same user |
| `connection:status` | OAuth token expired | `{ connectionId, status: 'expired' }` | Same user |

### Implementation

- Socket.io server runs alongside Next.js (custom server or separate process)
- Users join a room based on their userId when they open the app
- Workers emit events to Redis pub/sub → Socket.io server reads and forwards to the correct user room
- Frontend listens with `useSocket()` hook → Updates Zustand stores → React re-renders

### Scaling Real-Time

For MVP (single server): Socket.io works as-is.
For scale: Use Socket.io Redis adapter (`@socket.io/redis-adapter`) so multiple server instances share the same event bus.

---

*Next: [09-business-model.md](09-business-model.md) — Pricing, monetization, and projections*

# 03 — Workflow Builder (React Flow) — Full Specification

---

## 3.1 Overview

The Workflow Builder is the core page of the platform. Built with **React Flow** (`@xyflow/react`). Users visually create automation workflows by adding nodes (triggers, actions, conditions) and connecting them with edges.

**Two entry points:**
- `/workflows/new` — New blank workflow
- `/workflows/[id]/edit` — Edit existing workflow

---

## 3.2 Page Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  TOP BAR                                                         │
│  [← Back] [Workflow Name (editable)] [Save] [Test] [Activate] [⚙]│
├───────────┬──────────────────────────────────┬───────────────────┤
│           │                                  │                   │
│  NODE     │                                  │   CONFIG PANEL    │
│  PANEL    │       REACT FLOW CANVAS          │   (or AI CHAT)   │
│  (Left    │                                  │   (Right sidebar) │
│  Sidebar) │       Drag & drop area           │                   │
│           │       Nodes + Edges              │   Opens when a    │
│  Lists    │                                  │   node is clicked │
│  all node │                                  │   OR AI chat is   │
│  types    │                                  │   toggled         │
│  to drag  │                                  │                   │
│           │                                  │                   │
├───────────┴──────────────────────────────────┴───────────────────┤
│  BOTTOM BAR                                                      │
│  [Zoom In] [Zoom Out] [Fit View] [Minimap Toggle] [AI Chat 💬]  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3.3 Top Bar

| Element | Behavior |
|---------|----------|
| **← Back** | Returns to `/workflows` or `/workflows/[id]`. Prompts "Unsaved changes" if dirty state. |
| **Workflow Name** | Inline editable text field. Default: "Untitled Workflow". Click to edit. |
| **Save** | Saves workflow to database (nodes, edges, positions, config). Shows "Saved ✓" toast. Auto-save every 30 seconds. |
| **Test** | Executes the workflow once with test data. Opens execution panel showing real-time step progress. |
| **Activate / Deactivate** | Toggle workflow on/off. Active = triggers are live. Requires at least 1 trigger + 1 action to activate. |
| **⚙ Settings** | Opens workflow settings drawer: Name, Description, Tags, Retry settings, Error notification toggle. |

---

## 3.4 Left Sidebar — Node Panel

**Purpose:** Lists all available node types that users can drag onto the canvas.

**Structure:**

### Trigger Nodes (Starting points — a workflow must start with one)
| Node | Description |
|------|-------------|
| **Webhook Trigger** | Receives incoming HTTP requests. Provides a unique URL. |
| **Schedule Trigger** | Runs on a cron schedule (every 5 min, hourly, daily, weekly, custom). |
| **Manual Trigger** | User manually clicks "Run" to execute. |
| **App Trigger** | Service-specific trigger (e.g., "New Gmail email", "New Slack message", "New GitHub issue"). Shown per connected integration. |

### Action Nodes (Do something)
| Node | Description |
|------|-------------|
| **Gmail** | Send email, Read email, Search emails, Reply to email |
| **Slack** | Send message, Create channel, Update message |
| **Notion** | Create page, Update page, Query database |
| **Google Sheets** | Add row, Update row, Read sheet, Create sheet |
| **GitHub** | Create issue, Close issue, Create PR, Add comment |
| **Discord** | Send message, Create channel |
| **HTTP Request** | Custom HTTP call to any API (GET/POST/PUT/DELETE) |
| **Email (SMTP)** | Send email via SMTP |
| ... | (One section per connected integration) |

### Logic Nodes
| Node | Description |
|------|-------------|
| **If/Else (Condition)** | Branch based on a condition. Two outputs: True path, False path. |
| **Switch** | Multiple conditions → multiple output paths. |
| **Loop / For Each** | Iterate over an array of items. |
| **Delay** | Wait X seconds/minutes/hours before proceeding. |
| **Stop** | End the workflow execution at this point. |

### Utility Nodes
| Node | Description |
|------|-------------|
| **Set Variable** | Set a variable value for later use. |
| **Transform Data** | Map/transform data between steps (rename fields, filter, format). |
| **Code (JavaScript)** | Run custom JavaScript code. Input/output JSON. |
| **Merge** | Combine data from multiple branches into one. |
| **Error Handler** | Catch errors from previous nodes and handle them (retry, notify, fallback). |

### How Node Panel Works:
- Nodes are **draggable**. User drags a node from the panel onto the canvas.
- Nodes are grouped by category (Triggers, Actions by service, Logic, Utility).
- Each node shows: Icon, Name, Brief description.
- Search/filter bar at top of panel to find nodes.
- If integration is not connected, node shows "Connect [Service]" badge — clicking opens OAuth flow.

---

## 3.5 React Flow Canvas — Center Area

### Canvas Features:

| Feature | Detail |
|---------|--------|
| **Drag nodes** | Move nodes freely on infinite canvas |
| **Connect nodes** | Drag from output handle to input handle to create edge |
| **Zoom** | Scroll wheel to zoom in/out. Min zoom 0.1, max zoom 2.0 |
| **Pan** | Click-drag on empty canvas to pan |
| **Select multiple** | Shift-click or drag-select box |
| **Delete** | Select node/edge → Delete key or right-click → Delete |
| **Copy/Paste** | Ctrl+C / Ctrl+V selected nodes |
| **Undo/Redo** | Ctrl+Z / Ctrl+Shift+Z |
| **Minimap** | Toggle minimap in bottom-right corner (React Flow's built-in MiniMap) |
| **Snap to grid** | Nodes snap to grid for alignment |
| **Auto-layout** | Button to auto-arrange nodes (dagre layout algorithm) |

### Node Appearance on Canvas:

Each node rendered as a card:
```
┌─────────────────────────┐
│  [Icon]  Node Name      │
│  Brief status/config    │
│                         │
│  ● Input Handle (top)   │
│  ● Output Handle(s)     │
│    (bottom)             │
└─────────────────────────┘
```

**Node States:**
| State | Visual |
|-------|--------|
| Default | White background, gray border |
| Selected | Blue border, slight shadow |
| Configured | Green dot indicator |
| Unconfigured | Orange dot indicator + "Click to configure" text |
| Error | Red border, error icon |
| Running (during test) | Blue pulsing animation |
| Success (during test) | Green background |
| Failed (during test) | Red background |

### Edge (Connection) Appearance:
- Default: Smooth bezier curve, gray color
- Animated (during execution): Dashed moving animation
- Type: `smoothstep` or `bezier` (configurable)
- Deletable: Click edge → shows delete button
- Labels: Optional edge labels for condition branches ("True" / "False")

### Right-Click Context Menu (on Canvas):
- Add Trigger Node
- Add Action Node
- Add Condition Node
- Paste
- Select All
- Fit View

### Right-Click Context Menu (on Node):
- Configure
- Duplicate
- Copy
- Delete
- Add Note

---

## 3.6 Right Sidebar — Node Configuration Panel

**Opens when a node on the canvas is clicked.**

### Structure:

```
┌──────────────────────────┐
│  [Service Icon] Node Name│
│  [X Close]               │
├──────────────────────────┤
│  Tab: Configure | Test   │
├──────────────────────────┤
│                          │
│  CONFIGURE TAB:          │
│                          │
│  Connection: [Dropdown]  │
│  (Select connected acct) │
│                          │
│  Action: [Dropdown]      │
│  (e.g., Send Message)    │
│                          │
│  Parameter Fields:       │
│  - Channel: [input]      │
│  - Message: [textarea]   │
│  - ...                   │
│                          │
│  Data Mapping:           │
│  Click field → shows     │
│  available data from     │
│  previous nodes          │
│                          │
├──────────────────────────┤
│  TEST TAB:               │
│                          │
│  [Run This Step] button  │
│  Shows output JSON       │
│  Shows error if failed   │
│                          │
└──────────────────────────┘
```

### Configuration Panel Features:

1. **Connection Selector**
   - Dropdown showing connected accounts for this service
   - "Add New Connection" option → Opens OAuth flow inline

2. **Action Selector**
   - Dropdown showing available actions (e.g., "Send Message", "Create Channel")
   - Changes parameter fields below based on selection

3. **Parameter Fields**
   - Dynamic fields based on selected action
   - Types: Text input, Textarea, Dropdown, Number, Boolean toggle, Date picker, JSON editor
   - **Data Mapping**: Click a field → shows a dropdown/panel listing all data output from previous nodes
     - Example: In a Slack "Send Message" node, the Message field can reference `{{trigger.data.email.subject}}`
     - Visual tag/pill for mapped data: `[Gmail → Subject]`

4. **Expression Editor** (in each field)
   - Click "Expression" toggle on any field
   - Write expressions: `{{nodes.gmail_trigger.data.from}}` or `{{$json.name}}`
   - Autocomplete for available data paths

5. **Test This Step**
   - Run only this node with mock/real data
   - Shows raw output JSON
   - Useful for debugging

---

## 3.7 Right Sidebar — AI Chat Panel

**Toggled via the 💬 button in the bottom bar. Replaces the config panel.**

### AI Chat Features:

| Feature | Detail |
|---------|--------|
| **Chat input** | Text input at bottom, send button |
| **Conversation history** | Scrollable chat messages (user + AI) |
| **What AI can do** | Add nodes to canvas, connect nodes, configure nodes, explain workflow, suggest improvements, fix errors |

### Example Conversations:

**User:** "Add a Gmail trigger that fires when I receive an email from @company.com"
**AI:** Adds a Gmail Trigger node configured with filter `from:@company.com`. Shows: "I've added a Gmail trigger. I'll filter emails from @company.com."

**User:** "Then send a Slack message to #general with the email subject"
**AI:** Adds Slack Action node, connects it to Gmail Trigger, configures channel=#general, message={{trigger.data.subject}}. Shows: "Done! Slack will post the email subject to #general."

**User:** "Add a condition — only notify if the email contains 'urgent'"
**AI:** Adds If/Else node between Gmail and Slack. Configures condition: `email.body contains 'urgent'`. Reconnects edges.

**User:** "What does this workflow do?"
**AI:** "This workflow monitors your Gmail for new emails. When an email arrives from @company.com and contains 'urgent' in the body, it sends the email subject as a Slack message to #general."

### AI Implementation Notes:
- AI has context of: current workflow state (nodes, edges, configs), available integrations, connected accounts
- AI can call functions: `addNode()`, `removeNode()`, `connectNodes()`, `configureNode()`, `addEdge()`
- These functions modify the React Flow state directly
- AI streams responses (not instant — shows typing indicator)
- Rate limited per plan tier

---

## 3.8 Bottom Bar

| Element | Behavior |
|---------|----------|
| **Zoom In (+)** | Zoom in on canvas |
| **Zoom Out (-)** | Zoom out on canvas |
| **Fit View** | Reset zoom/pan to fit all nodes in view |
| **Minimap Toggle** | Show/hide React Flow MiniMap component |
| **AI Chat 💬** | Toggle AI chat panel in right sidebar |
| **Execution Status** | Shows "Draft" / "Active" / "Last run: 5 min ago — Success" |

---

## 3.9 Node Types — Detailed Specifications

### 3.9.1 Trigger Nodes

**All workflows MUST start with exactly ONE trigger node.**

#### Webhook Trigger
- **Input:** None (it's a trigger)
- **Output:** Incoming HTTP request body, headers, query params
- **Config fields:**
  - HTTP Method: GET, POST, PUT, DELETE
  - Authentication: None, Basic Auth, Header Token
  - Response: Immediately (200 OK) or Wait for workflow to finish
- **Generated:** Unique webhook URL (e.g., `https://app.flowpilot.com/webhook/abc123`)
- **User copies this URL** to paste into external service

#### Schedule Trigger
- **Input:** None
- **Output:** `{ scheduledTime: "2025-01-15T10:00:00Z" }`
- **Config fields:**
  - Interval type: Every X minutes, Hourly, Daily, Weekly, Custom Cron
  - If minutely: Interval (5, 10, 15, 30)
  - If daily: Time of day, Timezone
  - If weekly: Day of week, Time
  - If cron: Cron expression input with helper

#### Manual Trigger
- **Input:** None
- **Output:** `{ manuallyTriggeredAt: "...", triggeredBy: "user@email.com" }`
- **Config:** None needed
- **Behavior:** User clicks "Run" in the builder or dashboard

#### App Trigger (per integration)
- **Input:** None
- **Output:** Event data from service
- **Config fields:**
  - Connected account (dropdown)
  - Event type (dropdown, specific to each service)
- **Examples:**
  - Gmail: "New email received" (filters: from, subject contains, label)
  - Slack: "New message in channel" (select channel)
  - GitHub: "New issue created" (select repo)
  - Google Sheets: "New row added" (select sheet)

### 3.9.2 Action Nodes (per Integration)

Each integration has multiple actions. Full list per integration in [06-integrations.md](06-integrations.md).

General structure for every action node:
- **Connection selector** — Which connected account to use
- **Action selector** — Which action (Send, Create, Update, Delete, Search, etc.)
- **Parameter fields** — Dynamic based on action
- **Data mapping** — Map fields from previous nodes
- **Output** — JSON response from the API

### 3.9.3 Logic Nodes

#### If/Else (Condition)
- **Input:** Data from previous node
- **Output:** Two handles — "True" and "False"
- **Config:**
  - Field to check (from input data, with autocomplete)
  - Operator: equals, not equals, contains, not contains, greater than, less than, is empty, is not empty, starts with, ends with, regex match
  - Value: Static value or mapped from another node
  - AND/OR: Add multiple conditions grouped with AND/OR logic

#### Switch
- **Input:** Data from previous node
- **Output:** Multiple handles (one per case + default)
- **Config:**
  - Field to evaluate
  - Case 1: Condition → Output 1
  - Case 2: Condition → Output 2
  - ...
  - Default → Default output

#### Loop / For Each
- **Input:** Array of items from previous node
- **Output:** Each item individually (loop body) → then merged output after loop
- **Config:**
  - Input array field (select from previous node output)
  - Batch size: Process 1 at a time or N at a time
  - Continue on error: Yes/No

#### Delay
- **Input:** Data from previous node (passes through)
- **Output:** Same data after delay
- **Config:**
  - Duration: Number + Unit (seconds, minutes, hours)
  - Or: Wait until specific time

#### Merge
- **Input:** Multiple inputs (from different branches)
- **Output:** Merged data
- **Config:**
  - Merge mode: Append (combine all), Combine by field (join), Wait for all (wait for all branches to complete)

### 3.9.4 Utility Nodes

#### Set Variable
- **Config:** Variable name, Value (static or mapped)
- **Output:** Variable is available in all subsequent nodes as `{{variables.varName}}`

#### Transform Data
- **Config:**
  - Operations: Rename field, Remove field, Add field, Convert type, Filter array, Sort array
  - Multiple operations can be chained
- **Output:** Transformed data

#### Code (JavaScript)
- **Config:**
  - Code editor (Monaco editor embedded)
  - Input is available as `$input` variable
  - Must return output via `return { result: ... }`
- **Output:** Whatever the code returns
- **Security:** Sandboxed execution (vm2 or isolated-vm)

#### HTTP Request
- **Config:**
  - URL, Method (GET/POST/PUT/DELETE/PATCH)
  - Headers (key-value pairs)
  - Query params (key-value pairs)
  - Body (JSON/Form/Raw)
  - Authentication: None, Basic Auth, Bearer Token, API Key
  - Timeout
- **Output:** Response body, status code, headers

#### Error Handler
- **Placed after any node** to catch its errors
- **Config:**
  - On error: Retry (with count and delay), Continue (ignore error), Stop workflow, Run fallback branch
- **Output:** Error details (message, code, stack)

---

## 3.10 Data Flow Between Nodes

### How Data Passes:

1. **Trigger fires** → outputs JSON data (e.g., `{ email: { from: "...", subject: "...", body: "..." } }`)
2. **Next node receives** this data as input
3. **User maps fields** in the config panel: "Message" field → click → select `{{nodes.trigger.data.email.subject}}`
4. **Node executes** using mapped data → outputs new JSON data
5. **Next node** receives output from step 4 as its input
6. **Repeat** until workflow ends

### Data Reference Format:
- `{{nodes.[nodeId].data.[fieldPath]}}` — Reference specific node's output
- `{{trigger.data.[fieldPath]}}` — Reference trigger data
- `{{variables.[varName]}}` — Reference set variables
- `{{env.[envName]}}` — Reference environment variables (Post-MVP)

### Data Preview:
- In the config panel, when mapping data, show a **preview** of actual data from the last test run
- If no test run, show schema/structure from the integration's API definition

---

## 3.11 Workflow JSON Schema

The workflow is stored in the database as a JSON structure:

```
{
  "id": "wf_abc123",
  "name": "Email to Slack Notifier",
  "status": "active",
  "nodes": [
    {
      "id": "node_1",
      "type": "trigger_gmail",
      "position": { "x": 100, "y": 200 },
      "data": {
        "connectionId": "conn_xyz",
        "event": "new_email",
        "filters": { "from": "@company.com" }
      }
    },
    {
      "id": "node_2",
      "type": "condition_if",
      "position": { "x": 400, "y": 200 },
      "data": {
        "conditions": [
          { "field": "{{nodes.node_1.data.subject}}", "operator": "contains", "value": "urgent" }
        ],
        "logic": "AND"
      }
    },
    {
      "id": "node_3",
      "type": "action_slack",
      "position": { "x": 700, "y": 100 },
      "data": {
        "connectionId": "conn_abc",
        "action": "send_message",
        "params": {
          "channel": "#general",
          "message": "Urgent email from {{nodes.node_1.data.from}}: {{nodes.node_1.data.subject}}"
        }
      }
    }
  ],
  "edges": [
    { "id": "edge_1", "source": "node_1", "target": "node_2" },
    { "id": "edge_2", "source": "node_2", "target": "node_3", "sourceHandle": "true" }
  ],
  "settings": {
    "retryOnFailure": true,
    "maxRetries": 3,
    "retryDelay": 60,
    "notifyOnFailure": true
  }
}
```

---

## 3.12 Builder Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + S` | Save workflow |
| `Ctrl + Z` | Undo |
| `Ctrl + Shift + Z` | Redo |
| `Ctrl + C` | Copy selected nodes |
| `Ctrl + V` | Paste |
| `Ctrl + A` | Select all |
| `Delete / Backspace` | Delete selected |
| `Ctrl + D` | Duplicate selected |
| `Space + Drag` | Pan canvas |
| `Ctrl + +` | Zoom in |
| `Ctrl + -` | Zoom out |
| `Ctrl + 0` | Fit view |
| `Ctrl + /` | Toggle AI chat |

---

## 3.13 Saving & State Management

| Aspect | Detail |
|--------|--------|
| **Auto-save** | Every 30 seconds if changes detected |
| **Manual save** | Ctrl+S or Save button |
| **Dirty state** | Track unsaved changes. Show dot indicator on Save button. Prompt on navigate away. |
| **State manager** | Zustand store for workflow builder state (nodes, edges, selected node, panel state) |
| **Persistence** | On save, POST entire workflow JSON to API. API validates and stores in PostgreSQL. |
| **Version history** | (Post-MVP) Store previous versions. Allow rollback. |

---

*Next: [04-user-flows.md](04-user-flows.md) — Complete user flows through the application*

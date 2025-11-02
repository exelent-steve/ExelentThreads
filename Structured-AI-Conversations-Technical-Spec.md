# Technical Specification: Multi-View AI Conversation Interface Demo

## Project Goal

Build a hardcoded, static demo showcasing a multi-view interface for structured AI conversations. No backend, no real AI calls—just a polished frontend demonstration using sample data.

**Deliverable:** Single-page application that runs in any modern browser, demonstrating four view modes for the same conversation data.

---

## Technology Stack

- **HTML5** - Single `index.html` file
- **CSS3** - Modern styling with Flexbox/Grid
- **Vanilla JavaScript** - No frameworks (keeps it simple for demo)
- **No dependencies** - Self-contained, works offline

---

## File Structure

```
/demo/
├── index.html          # Main HTML file
├── styles.css          # All styling
├── data.js             # Sample conversation data (JSON)
├── app.js              # Main application logic
├── conversation-view.js # Split-pane conversation view
├── table-view.js       # Spreadsheet/table view
├── board-view.js       # Kanban board view
├── utils.js            # Helper functions (date formatting, etc.)
└── README.md           # Instructions for running demo
```

---

## Data Model

### Topic Structure

```javascript
// data.js
const conversationData = {
  topics: [
    {
      id: "topic-1",                              // Unique identifier
      title: "Need both objectives AND summary?", // Display title
      status: "resolved",                         // open | in-progress | resolved | archived
      category: "architecture",                   // For grouping/filtering
      priority: "high",                           // high | medium | low
      created: "2024-11-01T10:00:00Z",           // ISO timestamp
      updated: "2024-11-01T14:30:00Z",           // ISO timestamp
      exchanges: [
        {
          id: "ex-1",
          speaker: "user",                        // user | claude
          timestamp: "2024-11-01T10:00:00Z",
          content: "Do we need both objectives AND a summary? Seems redundant."
        },
        {
          id: "ex-2",
          speaker: "claude",
          timestamp: "2024-11-01T10:05:00Z",
          content: "YES - Keep both. Objectives = specific measurable outcomes..."
        }
        // ... more exchanges
      ]
    }
    // ... more topics
  ],
  metadata: {
    projectName: "Document Generation System",
    lastUpdated: "2024-11-01T16:00:00Z",
    totalTopics: 15,
    totalExchanges: 47
  }
};
```

### Sample Data Set

Create 10-15 topics from Steve's CSV with varying:
- Status (mix of open, in-progress, resolved)
- Number of exchanges (2-8 per topic)
- Recent vs older timestamps
- Different categories (architecture, features, UX, data)

---

## UI Components

### Global Layout

```
┌─────────────────────────────────────────────────────────────┐
│ 🧠 Structured AI Conversations    [@] Login  [⚙] Settings  │
├─────────────────────────────────────────────────────────────┤
│ [Document Generation System]           [+ New Topic]  [↓ Export] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [💬 Conversation] [📊 Table] [📋 Board] [⏱️ Timeline]     │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                                                       │  │
│  │                                                       │  │
│  │          ACTIVE VIEW RENDERS HERE                   │  │
│  │                                                       │  │
│  │                                                       │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Header Elements:**
- Logo/branding
- Project selector dropdown (for demo, just shows current project)
- View switcher tabs
- New Topic button
- Export button (downloads JSON/CSV)
- Search/filter (optional for v1)

---

## View 1: Conversation View (Split-Pane)

### Layout

```
┌──────────────┬────────────────────────────────────────────────┐
│ Topics       │ Issue: Document length specification           │
│              │ Status: In Progress    Updated: 2 hours ago    │
│ ┌──────────┐ ├────────────────────────────────────────────────┤
│ │● Length   │ │ [You] 10:15 AM                                │
│ │  spec     │ │ Should we add target_length as a field?       │
│ │2 hrs ago  │ │                                                │
│ └──────────┘ │ [Claude] 10:20 AM                              │
│              │ Add target_length with: words count, pages...  │
│ ┌──────────┐ │                                                │
│ │  Variables│ │ [You] 1:30 PM                                 │
│ │  scope    │ │ Add it. However, I think we should take...   │
│ │4 hrs ago  │ │                                                │
│ └──────────┘ │ [Claude] 3:45 PM                               │
│              │ ✅ SMART APPROACH: Calculate both (1)...       │
│ ┌──────────┐ ├────────────────────────────────────────────────┤
│ │✓ Consol...│ │ ┌──────────────────────────────────────────┐ │
│ │  name     │ │ │ Type your message...                     │ │
│ │Resolved   │ │ │                                          │ │
│ └──────────┘ │ └──────────────────────────────────────────┘ │
│              │ [Send] [Add to topic ▼]                       │
│ + New Topic  │                                                │
└──────────────┴────────────────────────────────────────────────┘
```

### Features

**Left Sidebar (Topics List):**
- Show all topics sorted by: Recent activity (default), Alphabetical, Status
- Each topic card shows:
  - Status icon (● open, ◐ in-progress, ✓ resolved)
  - Topic title (truncated if long)
  - Relative time ("2 hours ago")
  - Unread indicator if updated
- Click topic to load it in main area
- Keyboard navigation: ↑/↓ arrows to switch topics
- Search filter at top

**Main Area (Conversation Thread):**
- Header showing:
  - Full topic title
  - Status badge with color coding
  - Last updated time
  - Options menu (Mark as resolved, Archive, etc.)
- Message bubbles:
  - User messages: aligned left, blue/gray
  - Claude messages: aligned right, purple/white
  - Timestamp on each message
  - Markdown rendering in Claude responses
- Input area at bottom:
  - Text input field
  - Send button
  - "Add to topic" dropdown (for demo, non-functional)

**Sort Options in Sidebar:**
- [ ] Recent Activity (default)
- [ ] Alphabetical A-Z
- [ ] Status (Open → In Progress → Resolved)
- [ ] Date Created (Oldest first)

### Implementation Notes

```javascript
// conversation-view.js

class ConversationView {
  constructor(data) {
    this.data = data;
    this.currentTopicId = data.topics[0].id; // Default to first topic
    this.sortBy = 'recent'; // recent | alpha | status | created
  }

  render() {
    // Build sidebar with topic cards
    // Build main conversation area
    // Attach event listeners
  }

  renderSidebar() {
    // Sort topics based on this.sortBy
    // Create topic cards with status icons
    // Add click handlers
  }

  renderConversation(topicId) {
    // Load topic data
    // Render header with title, status, time
    // Render all exchanges as message bubbles
    // Render input area
  }

  switchTopic(topicId) {
    this.currentTopicId = topicId;
    this.renderConversation(topicId);
    // Highlight active topic in sidebar
  }

  handleKeyboard(event) {
    // Arrow up/down to navigate topics
    // Enter to "send" message (just shows alert in demo)
  }
}
```

---

## View 2: Table View (Spreadsheet)

### Layout

```
┌────────────────────────────────────────────────────────────────────────────┐
│ [Filter: All ▼] [Status: All ▼] [Category: All ▼]        [Sort: Recent ▼] │
├──────┬─────────────────────┬────────────┬─────────────────────────────────┤
│Status│ Issue               │ Updated    │ Latest Exchange                 │
├──────┼─────────────────────┼────────────┼─────────────────────────────────┤
│  ◐   │ Document length...  │ 2 hrs ago  │ ✅ SMART APPROACH: Calculate...│
│  ●   │ Variables scope     │ 4 hrs ago  │ Extract from multiple sources...│
│  ✓   │ Consolidation name  │ 6 hrs ago  │ Document preparation is best... │
│  ●   │ Prompt complexity   │ 8 hrs ago  │ Test prompt complexity...       │
│  ✓   │ JSON variables...   │ 1 day ago  │ ✅ AGREED. Prompt will say...   │
│  ◐   │ Error handling      │ 1 day ago  │ Graceful fallbacks with conf... │
│  ●   │ Edit flow           │ 2 days ago │ Use INLINE editing like...      │
│  ✓   │ Readiness score     │ 2 days ago │ ✅ PROVENANCE & VALIDATION...   │
│  ◐   │ Batching strategy   │ 3 days ago │ Consolidation calculates...     │
│  ●   │ View modal          │ 3 days ago │ Will add new tabs/sections...   │
├──────┴─────────────────────┴────────────┴─────────────────────────────────┤
│ Showing 10 of 15 topics                                [< 1 2 >]  │
└────────────────────────────────────────────────────────────────────────────┘
```

### Features

**Table Columns:**
1. Status icon (◐, ●, ✓)
2. Issue/Topic title (click to expand or open in conversation view)
3. Updated (relative time)
4. Latest Exchange (preview of most recent message, truncated)
5. Category (optional, can be hidden)
6. # Exchanges (count)

**Interactions:**
- Click row to expand inline (shows all exchanges)
- Double-click row to switch to conversation view for that topic
- Click column headers to sort
- Filters at top:
  - Status: All | Open | In Progress | Resolved | Archived
  - Category: All | Architecture | Features | UX | Data
  - Time range: All time | Today | This week | This month

**Compact vs Expanded Mode:**
- Toggle button to switch between:
  - Compact: One row per topic (just latest message)
  - Expanded: Shows all exchanges inline

### Implementation Notes

```javascript
// table-view.js

class TableView {
  constructor(data) {
    this.data = data;
    this.expandedTopics = new Set(); // Track which rows are expanded
    this.filters = {
      status: 'all',
      category: 'all',
      timeRange: 'all'
    };
    this.sortColumn = 'updated'; // updated | title | status | created
    this.sortDirection = 'desc';
  }

  render() {
    // Render filter controls
    // Render table header with sortable columns
    // Render table rows
  }

  applyFilters() {
    // Filter topics based on this.filters
    return filteredTopics;
  }

  sortTopics(topics) {
    // Sort based on this.sortColumn and direction
    return sortedTopics;
  }

  toggleRowExpansion(topicId) {
    // Show/hide full exchange history inline
    if (this.expandedTopics.has(topicId)) {
      this.expandedTopics.delete(topicId);
    } else {
      this.expandedTopics.add(topicId);
    }
    this.render();
  }

  exportToCSV() {
    // Convert data to CSV format matching Steve's structure
    // Trigger download
  }
}
```

---

## View 3: Board View (Kanban)

### Layout

```
┌──────────────────┬──────────────────┬──────────────────┬───────────────┐
│ Open (4)         │ In Progress (3)  │ Resolved (7)     │ Archived (1)  │
├──────────────────┼──────────────────┼──────────────────┼───────────────┤
│ ┌──────────────┐ │ ┌──────────────┐ │ ┌──────────────┐ │ ┌───────────┐ │
│ │Variables     │ │ │Length spec   │ │ │Consolidation │ │ │Old topic  │ │
│ │scope         │ │ │              │ │ │name          │ │ │           │ │
│ │              │ │ │3 exchanges ● │ │ │              │ │ │           │ │
│ │2 exchanges   │ │ │Updated 2h ago│ │ │✓ Complete    │ │ └───────────┘ │
│ │Updated 4h ago│ │ └──────────────┘ │ │              │ │               │
│ └──────────────┘ │                  │ └──────────────┘ │               │
│                  │ ┌──────────────┐ │                  │               │
│ ┌──────────────┐ │ │Error         │ │ ┌──────────────┐ │               │
│ │Prompt        │ │ │handling      │ │ │JSON vars     │ │               │
│ │complexity    │ │ │              │ │ │guidance      │ │               │
│ │              │ │ │5 exchanges   │ │ │              │ │               │
│ │1 exchange    │ │ │Updated 1d ago│ │ │✓ Complete    │ │               │
│ │Updated 8h ago│ │ └──────────────┘ │ │              │ │               │
│ └──────────────┘ │                  │ └──────────────┘ │               │
│                  │ ┌──────────────┐ │                  │               │
│ [+ Add Topic]    │ │Batching      │ │ [Show more...▼]  │               │
│                  │ │strategy      │ │                  │               │
│                  │ │              │ │                  │               │
│                  │ │4 exchanges   │ │                  │               │
│                  │ │Updated 3d ago│ │                  │               │
│                  │ └──────────────┘ │                  │               │
└──────────────────┴──────────────────┴──────────────────┴───────────────┘
```

### Features

**Columns:**
- Open - New topics or unresolved issues
- In Progress - Actively being discussed
- Resolved - Decisions made, marked complete
- Archived - Old/inactive topics

**Cards:**
- Topic title (truncated if long)
- Exchange count
- Last updated time
- Priority indicator (color-coded border: red=high, yellow=medium, green=low)
- Click card to open in conversation view
- Drag and drop between columns (for demo, just show animation, don't persist)

**Column Headers:**
- Show count of topics in each column
- Collapse/expand column (hide cards, just show count)

**Interactions:**
- Click card → Opens conversation view for that topic
- Drag card between columns → Visual feedback (demo only, not functional)
- Hover card → Show preview tooltip with first exchange
- "+ Add Topic" in Open column

### Implementation Notes

```javascript
// board-view.js

class BoardView {
  constructor(data) {
    this.data = data;
    this.collapsedColumns = new Set(); // Track which columns are collapsed
  }

  render() {
    // Render 4 columns
    // Group topics by status
    // Render cards in each column
    // Add drag-drop visual effects (not functional)
  }

  renderColumn(status, topics) {
    // Column header with count
    // Cards sorted by updated time
    // Add topic button
  }

  renderCard(topic) {
    // Card with title, count, time
    // Color-coded priority border
    // Click handler
  }

  groupTopicsByStatus() {
    // Return object: { open: [], in-progress: [], resolved: [], archived: [] }
    const grouped = {
      open: [],
      'in-progress': [],
      resolved: [],
      archived: []
    };
    
    this.data.topics.forEach(topic => {
      grouped[topic.status].push(topic);
    });
    
    return grouped;
  }

  // Drag-drop is visual only for demo
  handleDragStart(event, topicId) {
    // Add visual feedback
  }

  handleDrop(event, newStatus) {
    // Show animation of card moving
    // Alert: "In real app, would update status"
  }
}
```

---

## View 4: Timeline View

**Note:** Timeline is integrated into Conversation View as a sort option, not a separate view mode.

### Implementation

In the Conversation View sidebar, add a "Timeline" sort option:

**When Timeline sort is active:**
- Show all exchanges from all topics in chronological order
- Each entry shows:
  - Timestamp
  - Topic title (clickable)
  - Speaker (User/Claude)
  - Message preview (truncated)

```
┌──────────────────────────────────────────────────────────┐
│ Sort: [Timeline ▼]                                       │
├──────────────────────────────────────────────────────────┤
│ 3:45 PM - Document length specification                 │
│ [Claude] ✅ SMART APPROACH: Calculate both...           │
│                                                          │
│ 1:30 PM - Document length specification                 │
│ [You] Add it. However, I think we should...             │
│                                                          │
│ 10:20 AM - Document length specification                │
│ [Claude] Add target_length with: words count...         │
│                                                          │
│ 10:15 AM - Document length specification                │
│ [You] Should we add target_length as a field?           │
│                                                          │
│ 10:05 AM - Need both objectives AND summary?            │
│ [Claude] YES - Keep both. Objectives = specific...      │
└──────────────────────────────────────────────────────────┘
```

Click any entry to jump to that topic in conversation view.

---

## Styling Guidelines

### Color Palette

```css
/* Primary colors */
--primary-blue: #2563eb;
--primary-purple: #7c3aed;
--primary-green: #10b981;

/* Status colors */
--status-open: #ef4444;      /* Red */
--status-progress: #f59e0b;  /* Amber */
--status-resolved: #10b981;  /* Green */
--status-archived: #6b7280;  /* Gray */

/* Background */
--bg-primary: #ffffff;
--bg-secondary: #f9fafb;
--bg-tertiary: #f3f4f6;

/* Text */
--text-primary: #111827;
--text-secondary: #6b7280;
--text-tertiary: #9ca3af;

/* Borders */
--border-light: #e5e7eb;
--border-medium: #d1d5db;
```

### Typography

```css
/* Font stack */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
             'Helvetica Neue', Arial, sans-serif;

/* Sizes */
--text-xs: 0.75rem;   /* 12px */
--text-sm: 0.875rem;  /* 14px */
--text-base: 1rem;    /* 16px */
--text-lg: 1.125rem;  /* 18px */
--text-xl: 1.25rem;   /* 20px */
--text-2xl: 1.5rem;   /* 24px */
```

### Component Styles

**Topic Cards (Sidebar):**
- Border radius: 8px
- Padding: 12px
- Hover: Slight shadow, background lightens
- Active: Blue border, bold title

**Message Bubbles:**
- User: Light gray background, rounded corners
- Claude: White background with purple left border
- Max width: 70% of container
- Padding: 12px 16px

**Buttons:**
- Primary: Blue background, white text
- Secondary: White background, gray border
- Height: 40px
- Border radius: 6px
- Hover: Slight darken

**Status Badges:**
- Pill shape (fully rounded)
- Small text (12px)
- Padding: 4px 10px
- Colors match status (red/amber/green/gray)

---

## Mock Interactions (Demo Behavior)

Since this is a static demo without real AI:

### "Send Message" Button
```javascript
// When user types and clicks Send
function handleSendMessage(message) {
  // Show the user's message immediately
  addMessageToUI(message, 'user');
  
  // Show typing indicator
  showTypingIndicator();
  
  // After 2 seconds, show mock Claude response
  setTimeout(() => {
    hideTypingIndicator();
    const mockResponse = "✅ Great point! [This is a demo response. In the real app, Claude would analyze your message and provide a thoughtful response.]";
    addMessageToUI(mockResponse, 'claude');
  }, 2000);
}
```

### "New Topic" Button
```javascript
function handleNewTopic() {
  // Show modal or inline form
  alert("In the real app, you'd enter a topic title here and start a new conversation thread.");
}
```

### "Export" Button
```javascript
function handleExport() {
  // Convert data to CSV format
  const csvContent = convertToCSV(conversationData);
  
  // Trigger download
  downloadFile(csvContent, 'conversations.csv', 'text/csv');
  
  // Also show options for JSON, Markdown formats
}
```

### "Mark as Resolved" Button
```javascript
function handleMarkResolved(topicId) {
  // Update topic status in local data
  const topic = findTopicById(topicId);
  topic.status = 'resolved';
  
  // Re-render views
  currentView.render();
  
  // Show toast notification
  showToast('Topic marked as resolved ✓');
}
```

---

## Sample Data (10-15 Topics)

**Pull from Steve's CSV:**
1. Need both objectives AND summary? (resolved, 4 exchanges)
2. Document length specification (in-progress, 4 exchanges)
3. Better word than 'Consolidation' (resolved, 2 exchanges)
4. JSON variables as guidance only (resolved, 2 exchanges)
5. Include summaries from lower-priority sources? (in-progress, 3 exchanges)
6. Content editability (open, 2 exchanges)
7. Generation strategy (batching) (resolved, 2 exchanges)
8. New things you didn't mention (in-progress, 5 exchanges)
9. Prompt complexity (open, 3 exchanges)
10. Error handling (in-progress, 4 exchanges)
11. View modal - showing new data (open, 2 exchanges)
12. General auto-run architecture (open, 1 exchange)

Mix timestamps from 2 hours ago to 3 days ago.

---

## Helper Functions (utils.js)

```javascript
// Format timestamps
function formatRelativeTime(timestamp) {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return then.toLocaleDateString();
}

// Format full timestamp
function formatFullTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit' 
  });
}

// Truncate text
function truncate(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Convert to CSV
function convertToCSV(data) {
  // Headers
  let csv = 'Issue,Status,Updated,Latest Exchange\n';
  
  // Rows
  data.topics.forEach(topic => {
    const latestExchange = topic.exchanges[topic.exchanges.length - 1];
    const row = [
      `"${topic.title}"`,
      topic.status,
      formatRelativeTime(topic.updated),
      `"${truncate(latestExchange.content, 100)}"`
    ];
    csv += row.join(',') + '\n';
  });
  
  return csv;
}

// Download file
function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

// Show toast notification
function showToast(message, duration = 3000) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
```

---

## Main Application Controller (app.js)

```javascript
// app.js - Main controller

class App {
  constructor() {
    this.data = conversationData; // From data.js
    this.currentView = 'conversation'; // conversation | table | board
    this.views = {};
    
    this.init();
  }

  init() {
    // Initialize all view classes
    this.views.conversation = new ConversationView(this.data);
    this.views.table = new TableView(this.data);
    this.views.board = new BoardView(this.data);
    
    // Attach global event listeners
    this.attachEventListeners();
    
    // Render initial view
    this.switchView('conversation');
  }

  attachEventListeners() {
    // View switcher tabs
    document.querySelectorAll('.view-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const viewName = e.target.dataset.view;
        this.switchView(viewName);
      });
    });
    
    // Export button
    document.getElementById('export-btn').addEventListener('click', () => {
      this.handleExport();
    });
    
    // New topic button
    document.getElementById('new-topic-btn').addEventListener('click', () => {
      this.handleNewTopic();
    });
  }

  switchView(viewName) {
    this.currentView = viewName;
    
    // Update active tab
    document.querySelectorAll('.view-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    document.querySelector(`.view-tab[data-view="${viewName}"]`).classList.add('active');
    
    // Clear container
    const container = document.getElementById('view-container');
    container.innerHTML = '';
    
    // Render new view
    this.views[viewName].render();
  }

  handleExport() {
    const csvContent = convertToCSV(this.data);
    downloadFile(csvContent, 'conversations.csv', 'text/csv');
    showToast('Exported to CSV ✓');
  }

  handleNewTopic() {
    alert('In the real app, you would enter a topic title and start a new conversation.');
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
```

---

## README.md

```markdown
# Multi-View AI Conversation Interface - Demo

A proof-of-concept demonstration of structured AI conversations with multiple view modes.

## Running the Demo

1. Open `index.html` in any modern web browser
2. No server or build process required
3. Works offline - all code is self-contained

## Features

- **4 View Modes:**
  - Conversation: Split-pane chat interface
  - Table: Spreadsheet-style overview
  - Board: Kanban status tracking
  - Timeline: Chronological activity feed

- **Mock Interactions:**
  - Click topics to view conversations
  - Send mock messages (simulated AI responses)
  - Mark topics as resolved
  - Export data to CSV

## Demo Limitations

This is a static demo with hardcoded data:
- No real AI integration
- No data persistence
- Simulated typing indicators and responses
- Drag-drop is visual only

## Technology

- Pure HTML/CSS/JavaScript
- No frameworks or dependencies
- ~1500 lines of code total

## File Structure

- `index.html` - Main page
- `styles.css` - All styling
- `data.js` - Sample conversation data
- `app.js` - Main application controller
- `conversation-view.js` - Split-pane view
- `table-view.js` - Spreadsheet view
- `board-view.js` - Kanban view
- `utils.js` - Helper functions

## Next Steps

To build a real version:
1. Add backend/database
2. Integrate Claude API (or ChatGPT/Gemini)
3. User authentication
4. Real-time updates
5. Collaboration features
```

---

## Development Checklist

### Phase 1: Foundation (Hour 1)
- [ ] Create file structure
- [ ] Build sample data from Steve's CSV
- [ ] Set up index.html with global layout
- [ ] Create base CSS with color palette and typography
- [ ] Implement view switcher tabs
- [ ] Test in browser

### Phase 2: Conversation View (Hour 2)
- [ ] Build sidebar with topic list
- [ ] Implement topic card rendering
- [ ] Build main conversation area
- [ ] Render message bubbles
- [ ] Add click handlers for topic switching
- [ ] Implement keyboard navigation
- [ ] Add sort options
- [ ] Test all interactions

### Phase 3: Table View (Hour 3)
- [ ] Build table header with columns
- [ ] Render table rows
- [ ] Implement row expansion
- [ ] Add filter controls
- [ ] Implement column sorting
- [ ] Test interactions

### Phase 4: Board View (Hour 4)
- [ ] Build 4-column layout
- [ ] Group topics by status
- [ ] Render cards in columns
- [ ] Add visual drag-drop feedback
- [ ] Implement column collapse
- [ ] Test card interactions

### Phase 5: Polish & Testing (Optional)
- [ ] Responsive design adjustments
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Add loading states/animations
- [ ] Optimize performance
- [ ] Write README
- [ ] Final QA

---

## Notes for Claude Code

- **Keep it simple** - This is a demo, not production code
- **No external libraries** - Pure vanilla JS
- **Mobile-first responsive** - Should work on tablets/phones
- **Accessibility basics** - Proper semantic HTML, keyboard navigation
- **Modern browser only** - Use ES6+, no IE support needed
- **Visual polish matters** - Smooth transitions, hover states, clean spacing

---

## Deliverable

A single folder containing:
- All source files
- README with instructions
- Sample data pre-populated
- Working demo viewable by opening index.html

Should look professional enough to show to potential investors/acquirers.

---

**Version:** 1.0  
**Last Updated:** November 2025  
**Estimated Build Time:** 3-4 hours

# ExelentThreads - CSV Workflow Demo (Phase 1)

This is the **CSV workflow** demo for ExelentThreads - Phase 1 implementation focusing on CSV import/export functionality.

## CSV Workflow

This demo implements a simpler workflow designed for external Claude Code integration:

```
1️⃣ Import CSV → 2️⃣ View & Edit Topics → 3️⃣ Export CSV → 4️⃣ Send to Claude Code
```

## Key Differences from Full Demo

### CSV-Specific Features

1. **📤 Export Selection Dialog** with 4 presets:
   - ⚡ Assigned to Claude (topics assigned specifically to AI)
   - 📂 All Open Topics (status = Open or In Progress)
   - 🌐 All Topics (full context export)
   - ✅ Custom Selection (manual checkbox selection)

2. **Assignee Field** - JIRA-like task assignment:
   - 🤖 Claude (AI will handle this)
   - 👤 Me (user is handling)
   - 👥 Team (requires team input)
   - ❓ Unassigned

3. **Last Responder Indicator**:
   - ⬅️ You replied last (user's turn to wait)
   - ➡️ Claude replied last (user's turn to respond)
   - 💬 No responses yet

4. **Import/Export Buttons** prominently in header
5. **CSV Workflow Banner** explaining the 4-step process

### What's NOT Included (vs Full Demo)

- No integrated AI chat (that's Phase 2)
- Export creates CSV file instead of inline AI conversation
- Import simulated (shows toast in demo)

## Features Retained from Full Demo

- All 5 views (Conversation, Table, Board, Timeline, Analytics)
- Topic detail modal
- Search and filtering
- Multi-project support
- Related topics
- Status/Priority/Category management
- Dark theme UI

## How to Run

Simply open `index.html` in a web browser:

```bash
open index.html
```

## CSV Format

Exported CSV follows this structure:

```csv
ID,Topic,Description,Status,Priority,Category,Assignee,Date_Created,Date_Updated,Your_Comments,Claude_Comments
INST,[INSTRUCTIONS FOR CLAUDE],"CRITICAL RULES FOR AI: (1) NEVER overwrite existing comment columns...",...
topic_abc123,"REST vs GraphQL",Technical decision,Open,High,Backend,Claude,2025-10-15,2025-10-28,,
```

### Fixed Columns (A-I)
1. **ID** - UUID format: `topic_abc123def456`
2. **Topic** - Title (max 200 chars)
3. **Description** - Full details
4. **Status** - Open | In Progress | Resolved | Closed
5. **Priority** - High | Medium | Low
6. **Category** - Technical, UX, Backend, etc.
7. **Assignee** - Me | Claude | Team | Unassigned
8. **Date_Created** - ISO format
9. **Date_Updated** - Auto-updated by app

### Expandable Columns (J+)
- Your_Comments, Claude_Comments, Your_Comments_2, Claude_Comments_2, etc.
- Each comment prefixed with timestamp: `YYYY-MM-DD HH:MM: `

## Export Behavior

**Assigned to Claude** (default):
- Filters: `WHERE assignee = 'Claude'`
- Typical count: ~13 topics in demo
- Use case: Send only topics requiring AI input

**All Open Topics**:
- Filters: `WHERE status IN ('Open', 'In Progress')`
- Use case: Focus on active work

**All Topics**:
- No filter
- Use case: Provide full context to AI

**Custom Selection**:
- Manual checkbox selection
- Use case: Specific topic subset

## Demo Data

Contains 45 sample topics with realistic assignee distribution:
- 13 topics assigned to **Claude** 🤖
- 10 topics assigned to **Me** 👤
- 10 topics assigned to **Team** 👥
- 12 topics **Unassigned** ❓

## Technical Implementation

### New Components Added

**HTML** (`index.html`):
- Export Selection Modal with preset options
- CSV Workflow Note banner
- Import/Export CSV buttons in header

**JavaScript** (`app.js`):
- `openExportSelectionModal()` - Populates modal with topic counts
- `handleCsvExport(preset)` - Filters and exports based on selection
- `generateCsvContent(topics)` - Creates properly formatted CSV
- CSV download with timestamped filename

**Data** (`data.js`):
- Added `assignee` field to all 45 topics
- Added `lastResponder` field (user | claude | none)

**CSS** (`styles.css`):
- Assignee badges styling (4 variants)
- Last Responder badges styling (3 variants)
- Export modal styling
- CSV workflow banner styling

**Views** (all view files updated):
- `conversation-view.js` - Badges in topic cards
- `table-view.js` - Assignee and Last Responder columns
- `board-view.js` - Badges in board cards
- `timeline-view.js` - Badges in timeline cards

## Next Steps

After testing this demo:

1. Implement real CSV parser (using papaparse)
2. Build Next.js app with database (SQLite + Drizzle ORM)
3. Add file watching for automatic CSV sync
4. Implement real CSV export with backup system
5. Add project management UI

See `../../Planning/TECHNICAL_SPEC.md` for complete implementation details.

## Relationship to Full Demo

- **demo-first-full** = Phase 2 (full AI chat integration)
- **demo-csv-workflow** = Phase 1 (CSV-based workflow)

Both demos share the same UI foundation. Phase 1 focuses on CSV management for external Claude Code usage. Phase 2 adds integrated AI chat with automatic topic extraction.

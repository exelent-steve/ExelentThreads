# ExelentThreads

A CSV-based topic management application designed for structured AI conversations with Claude Code integration.

## 🎯 Project Overview

ExelentThreads organizes AI conversations by **topic** rather than chronology, making it ideal for complex projects where you need to track multiple decisions, questions, and discussions simultaneously.

### The CSV Workflow (Phase 1)

```
1️⃣ Import CSV → 2️⃣ View & Edit Topics → 3️⃣ Export CSV → 4️⃣ Send to Claude Code
```

ExelentThreads provides a beautiful UI for managing CSV files containing topics and conversations. You assign topics to "Claude" like tasks in JIRA, export a filtered CSV, and send it to Claude Code for AI responses.

## 🚀 Quick Start

### Try the Demos

Two working demos are available - no installation required:

```bash
# CSV Workflow Demo (Phase 1 - recommended)
open demo/demo-csv-workflow/index.html

# Full Demo with Integrated AI (Phase 2 - future vision)
open demo/demo-first-full/index.html
```

See [`demo/README.md`](./demo/README.md) for detailed comparison.

## 📂 Project Structure

```
ExelentThreads/
├── demo/
│   ├── demo-csv-workflow/      # Phase 1: CSV workflow demo (⭐ current focus)
│   │   ├── index.html
│   │   ├── app.js
│   │   ├── data.js             # 45 sample topics with assignee field
│   │   ├── styles.css
│   │   └── README.md
│   │
│   ├── demo-first-full/        # Phase 2: Full AI chat demo (future)
│   │   └── ...
│   │
│   └── README.md               # Demo comparison guide
│
├── Planning/
│   ├── TECHNICAL_SPEC.md       # Complete implementation spec (3,400+ lines)
│   └── csv-workflow-questions.csv  # CSV template with 24 implementation Q&A
│
├── mockup-csv-workflow.html    # Visual mockup of CSV workflow
├── mockup-v2.html              # Visual mockup of Phase 2 (future)
└── README.md                   # This file
```

## ✨ Key Features

### CSV Workflow Features (Phase 1)

**📤 Export Selection Dialog**
- ⚡ Assigned to Claude - Export only topics assigned to AI
- 📂 All Open Topics - Export in-progress work
- 🌐 All Topics - Full context export
- ✅ Custom Selection - Manual checkbox selection

**🤖 Assignee Field** (JIRA-inspired)
- Assign topics to: Me | Claude | Team | Unassigned
- Filter exports by who should handle the work
- Visual badges in all views

**⬅️➡️ Last Responder Indicator**
- Shows whose "turn" it is in the conversation
- Track conversation flow at a glance

**5 Powerful Views**
- 💬 **Conversation View** - Chat-style interface
- 📊 **Table View** - Spreadsheet with sortable columns
- 📋 **Board View** - Kanban-style status columns
- 📅 **Timeline View** - Cascading waterfall visualization
- 📈 **Analytics Dashboard** - Decision patterns and insights

**Multi-Project Support**
- Manage multiple CSV files simultaneously
- Quick project switching in sidebar
- Each project = one CSV file

### Future Features (Phase 2)

- 🔮 Integrated AI chat (no external CSV workflow)
- 💬 Automatic topic extraction from conversations
- 📈 Smart suggestions with confidence scores
- ⚠️ Contradiction detection
- 🔗 Topic merge suggestions

## 📋 CSV File Format

### Fixed Columns (A-I)
```csv
ID,Topic,Description,Status,Priority,Category,Assignee,Date_Created,Date_Updated
topic_abc123,"REST vs GraphQL",Technical decision,Open,High,Backend,Claude,2025-10-15,2025-10-28
```

1. **ID** - UUID format: `topic_abc123def456`
2. **Topic** - Title (max 200 chars)
3. **Description** - Full details
4. **Status** - Open | In Progress | Resolved | Closed
5. **Priority** - High | Medium | Low
6. **Category** - Technical, UX, Backend, etc.
7. **Assignee** - Me | Claude | Team | Unassigned ⭐
8. **Date_Created** - ISO format
9. **Date_Updated** - Auto-updated by app

### Expandable Comment Columns (J+)
```csv
...,Your_Comments,Claude_Comments,Your_Comments_2,Claude_Comments_2
```

- Add new columns for each conversation round
- Never overwrite existing columns
- Each comment prefixed with timestamp: `YYYY-MM-DD HH:MM: `

### Instruction Row

Row 1 contains critical rules for Claude AI:
```csv
ID: INST
Topic: [INSTRUCTIONS FOR CLAUDE]
Description: "CRITICAL RULES FOR AI: (1) NEVER overwrite existing comment columns..."
```

See [`Planning/csv-workflow-questions.csv`](./Planning/csv-workflow-questions.csv) for complete template.

## 📖 Documentation

### Technical Specification

[`Planning/TECHNICAL_SPEC.md`](./Planning/TECHNICAL_SPEC.md) - Complete implementation guide (3,400+ lines)

Sections include:
1. Project Overview
2. CSV File Format Specification
3. Database Schema (Projects, Topics, Comments, Categories)
4. Data Flow & Sync Logic
5. UI Components & Layout
6. Views & Features (all 5 views)
7. Technical Architecture (Next.js + SQLite)
8. Export Selection Dialog ⭐
9. Assignee Field Implementation ⭐
10. Last Responder Indicator ⭐
11. Implementation Details (full code examples)
12. Error Handling & Validation
13. Testing Strategy
14. Security Considerations
15. Accessibility (a11y)
16. Deployment Guide
17. Future Enhancements

Any Claude Code instance can implement the entire application from this spec alone.

### CSV Template

[`Planning/csv-workflow-questions.csv`](./Planning/csv-workflow-questions.csv)

Contains 24 implementation questions with detailed answers covering:
- CSV structure decisions
- Multi-comment column strategy
- File watching approach
- Technology choices (Next.js + SQLite)
- Database schema
- Export/import behavior
- Assignee field usage ⭐

This CSV serves as both documentation and example - we're "eating our own cake."

## 🛠️ Tech Stack (Next.js Implementation)

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Shadcn/ui components

**Backend:**
- SQLite (local: exelentthreads.db)
- Drizzle ORM
- Optional: Turso (cloud SQLite)

**CSV Processing:**
- papaparse (parsing)
- chokidar (file watching)
- nanoid (UUID generation)

**Analytics:**
- recharts (dashboard visualizations)

## 🎯 Use Cases

**Software Development:**
```
Topics: API design, Database schema, Error handling, Deployment strategy
Assignee: Mix of Me (implementation) and Claude (architecture advice)
Workflow: Assign complex decisions to Claude, export, get AI input
```

**Product Management:**
```
Topics: Feature priorities, Pricing model, User research, Competitor analysis
Assignee: Team discussions, Claude for analysis
Workflow: Export open topics for weekly Claude Code review
```

**Research:**
```
Topics: Literature review, Methodology, Data analysis, Results interpretation
Assignee: Claude for synthesis, Me for manual work
Workflow: Feed all context to Claude, get comprehensive insights
```

## 📅 Implementation Roadmap

### ✅ Completed (Current Status)

- [x] Complete technical specification
- [x] CSV template with 24 Q&A
- [x] CSV workflow mockup
- [x] Full demo with 45 sample topics
- [x] CSV workflow demo with assignee/export features
- [x] Documentation (README files for all demos)

### 🚧 Next Steps (Phase 1 Implementation)

1. **Initialize Next.js Project**
   - Set up Next.js 14 with App Router
   - Configure Tailwind CSS + Shadcn/ui
   - Set up Drizzle ORM with SQLite

2. **Database & CSV Parser**
   - Implement database schema (4 tables)
   - Build CSV parser with papaparse
   - Create import/export logic with validation

3. **Core UI**
   - Implement all 5 views (Conversation, Table, Board, Timeline, Analytics)
   - Build topic detail modal
   - Add search/filter functionality

4. **CSV Workflow Features**
   - Export Selection Dialog with 4 presets
   - Assignee field management
   - Last responder tracking
   - File watching with chokidar

5. **Polish & Testing**
   - Error handling & validation
   - Backup system for exports
   - Testing across all features
   - Accessibility improvements

### 🔮 Future (Phase 2)

- Integrated AI chat with Claude API
- Automatic topic extraction from conversations
- Smart suggestions and contradiction detection
- Team collaboration features
- Mobile apps

## 🧪 Demo Data

Both demos include 45 realistic sample topics:

**Assignee Distribution:**
- 🤖 Claude: 13 topics (API design, database choices, architecture)
- 👤 Me: 10 topics (implementation tasks)
- 👥 Team: 10 topics (collaborative decisions)
- ❓ Unassigned: 12 topics (needs triage)

**Status Distribution:**
- Open: ~15 topics
- In Progress: ~12 topics
- Resolved: ~15 topics
- Closed: ~3 topics

**Categories:**
- Backend, Frontend, Database, UX, Technical, Planning, etc.

## 💡 Design Principles

1. **CSV as Source of Truth** - Simple, portable, version-controllable
2. **External AI Integration** - Use Claude Code separately (Phase 1)
3. **Multi-View Flexibility** - One data model, many visualizations
4. **JIRA-Inspired Assignment** - Assign topics like tasks
5. **Expandable Comments** - Never overwrite, always add columns
6. **Timestamp Everything** - Track when decisions were made

## 🤝 Contributing

This is currently a solo project, but the structure is designed to be clear:

1. **To suggest features:** Open an issue describing the use case
2. **To modify demos:** Edit files in `demo/` directories
3. **To improve spec:** Update `Planning/TECHNICAL_SPEC.md`
4. **To add sample data:** Modify CSV template or demo data.js files

## 📝 License

This project is currently unlicensed. All rights reserved.

## 🙋 Questions?

The project is self-documented:
- **How it works:** See `demo/README.md`
- **How to build it:** See `Planning/TECHNICAL_SPEC.md`
- **CSV format:** See `Planning/csv-workflow-questions.csv`
- **Visual design:** See `mockup-csv-workflow.html`

---

**Status:** Phase 1 Planning Complete ✅ | Implementation Ready 🚀
**Last Updated:** November 5, 2025
**Next Milestone:** Next.js MVP implementation

# ExelentThreads Demos

This folder contains two working demos of ExelentThreads, representing different phases of the project.

## 📂 demo-first-full/

**Phase 2: Full Version with Integrated AI Chat**

The complete ExelentThreads experience with integrated AI capabilities. This demo showcases all features including:
- 💬 Project AI Thread (integrated chat)
- 🔮 Ask AI Anything (natural language Q&A)
- 📈 Smart Suggestions with confidence scores
- ⚠️ Contradiction Detection
- 🔗 Topic Merge Suggestions

**Best for:** Seeing the full vision of ExelentThreads with AI chat integration.

[View Demo README](./demo-first-full/README.md)

## 📂 demo-csv-workflow/

**Phase 1: CSV Workflow (Current Implementation Focus)**

Simplified workflow designed for external Claude Code integration. Focuses on CSV import/export functionality:

```
Import CSV → View & Edit → Export CSV → Send to Claude Code
```

**Key CSV Features:**
- 📤 Export Selection Dialog (4 presets)
- 🤖 Assignee Field (Me/Claude/Team/Unassigned)
- ⬅️➡️ Last Responder Indicator
- 📋 CSV format with expandable comment columns

**Best for:** Understanding the CSV-based workflow and testing export functionality.

[View Demo README](./demo-csv-workflow/README.md)

## Running the Demos

Both demos are pure HTML/CSS/JavaScript - no build step required:

```bash
# Phase 2 - Full Demo
open demo-first-full/index.html

# Phase 1 - CSV Workflow
open demo-csv-workflow/index.html
```

## Key Differences

| Feature | CSV Workflow (Phase 1) | Full Demo (Phase 2) |
|---------|------------------------|---------------------|
| **AI Chat** | External (Claude Code) | Integrated |
| **Data Flow** | CSV Import/Export | Database + CSV |
| **Assignee Field** | ✅ Yes | ❌ No |
| **Export Selection** | ✅ Yes (4 presets) | ❌ Basic only |
| **Last Responder** | ✅ Yes | ❌ No |
| **5 Views** | ✅ Yes | ✅ Yes |
| **Analytics** | ✅ Yes | ✅ Yes |
| **Search/Filter** | ✅ Yes | ✅ Yes |

## Implementation Roadmap

1. ✅ **Current:** CSV Workflow Demo (this folder)
2. 🚧 **Next:** Build Next.js app from CSV Workflow spec
3. 🔮 **Future:** Add integrated AI chat (Phase 2)

## Technical Documentation

- **Technical Spec:** `../Planning/TECHNICAL_SPEC.md` (3,400+ lines)
- **CSV Template:** `../Planning/csv-workflow-questions.csv`
- **Mockup:** `../mockup-csv-workflow.html`

Both demos use the same UI foundation - only the data flow and AI integration differ.

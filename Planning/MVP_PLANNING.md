# ExelentThreads MVP Planning

## Current Discussion Breakdown (Meta Example!)

| Topic ID | Brief Description | Your Points | Claude's Response | Status |
|----------|-------------------|-------------|-------------------|--------|
| TOPIC-1 | Chat-first approach vs pre-created topics | Users chat naturally, don't create topics upfront. Subjects emerge organically during conversation. | ✅ AGREE - This is more natural. Current demo assumes topics exist, but real users just want to talk. Need to detect topics from chat flow. | Open |
| TOPIC-2 | Always-visible chat interface (left side) | Main chat with AI should be constantly open like ChatGPT, not behind a button. User always sees chat history. | ✅ AGREE - Much better UX. Left sidebar = chat interface. Right side = extracted topics/analytics. Chat is the primary interface. | Open |
| TOPIC-3 | AI-initiated topic extraction | AI realizes conversation has topics and asks user to convert/extract them, or link to existing topics when relevant. | ✅ GREAT IDEA - AI can say "I noticed we discussed 3 different things: [list]. Should I create topics for tracking?" User can accept/modify/reject. | Open |
| TOPIC-4 | Topic selection when sending messages | Option when sending chat to decide which topics to attach/update | ✅ USEFUL - But should be optional. Most chats just flow naturally. Power users can tag topics. AI can auto-suggest. | Open |
| TOPIC-5 | Document/Artifact editing with change tracking | AI creates doc (like Claude artifacts). User edits anywhere. Edits become tracked issues/topics. | ✅ POWERFUL - This is like Google Docs comments + issue tracking. Every edit/comment = potential topic. Great for reviewing specs, code, designs. | Open |
| TOPIC-6 | Data format: JSON vs CSV | Store conversations and topics in JSON format instead of CSV | ✅ DEFINITELY JSON - CSV can't handle nested conversations, metadata, relationships. JSON is standard for APIs. Can export to CSV for analysis. | Resolved |
| TOPIC-7 | MVP Scope: Focus on conversations + 1-2 analytics | Start small: main chat interface + simple analytics (topic count, patterns). Don't build everything. | ✅ SMART - Get something working fast. Core: Chat + Topic extraction + Simple list view. Analytics can be basic (counts, status, timeline). | Resolved |
| TOPIC-8 | Database: Turso (free SQLite-compatible) | Use Turso for database since it's free and you're familiar with it | ✅ EXCELLENT CHOICE - Turso is perfect for MVP: Free, SQLite compatible, edge database, easy schema. Can use Drizzle ORM for type safety. | Resolved |
| TOPIC-9 | AI: Offline models or Gemini free tier | Use local/offline AI models or Gemini free tier instead of expensive APIs | ✅ PRACTICAL - Gemini Flash 2.0 has 2M token context (massive!), free tier is generous. Can fallback to local models. Ollama for offline. | Resolved |
| TOPIC-10 | Real MVP vs polished mock | Build working app with you and Claude, not just a demo. Prove it works. | ✅ 100% AGREE - Working MVP > pretty mockup. Ship fast, iterate with real usage. We can build this! | Resolved |

---

## Architecture Proposal

### Tech Stack
```
Frontend:
- Vanilla JS (keep it simple, no build step for MVP)
- OR Next.js if you want React (easier state management)
- Tailwind CSS (rapid styling)

Backend:
- Next.js API routes OR Express.js
- Turso (SQLite database)
- Drizzle ORM (type-safe queries)

AI:
- Primary: Gemini Flash 2.0 API (2M context, free tier)
- Fallback: Ollama with llama3.2 (offline)
- For topic extraction: lighter models work fine

Hosting:
- Vercel (free, great for Next.js)
- OR Netlify
- Turso handles DB hosting (free tier)
```

### Data Schema (Turso/SQLite)

```sql
-- Main chat thread (one per project)
CREATE TABLE conversations (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Individual messages in the conversation
CREATE TABLE messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL,
    role TEXT NOT NULL, -- 'user' or 'assistant'
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSON, -- for attachments, context, etc.
    FOREIGN KEY (conversation_id) REFERENCES conversations(id)
);

-- Extracted topics from conversations
CREATE TABLE topics (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'open', -- open, in-progress, resolved, archived
    category TEXT,
    priority TEXT DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_from_message_id TEXT, -- which message sparked this topic
    FOREIGN KEY (conversation_id) REFERENCES conversations(id),
    FOREIGN KEY (created_from_message_id) REFERENCES messages(id)
);

-- Links between messages and topics (many-to-many)
CREATE TABLE message_topics (
    message_id TEXT NOT NULL,
    topic_id TEXT NOT NULL,
    relevance_score REAL, -- AI confidence that this message relates to topic
    PRIMARY KEY (message_id, topic_id),
    FOREIGN KEY (message_id) REFERENCES messages(id),
    FOREIGN KEY (topic_id) REFERENCES topics(id)
);

-- Responses/decisions within a topic
CREATE TABLE topic_responses (
    id TEXT PRIMARY KEY,
    topic_id TEXT NOT NULL,
    content TEXT NOT NULL,
    response_type TEXT, -- 'decision', 'question', 'note', 'update'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_from_message_id TEXT,
    FOREIGN KEY (topic_id) REFERENCES topics(id),
    FOREIGN KEY (created_from_message_id) REFERENCES messages(id)
);

-- Document artifacts (for future use)
CREATE TABLE artifacts (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL,
    type TEXT NOT NULL, -- 'document', 'code', 'diagram'
    title TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id)
);

-- Changes/edits to artifacts (becomes topics)
CREATE TABLE artifact_changes (
    id TEXT PRIMARY KEY,
    artifact_id TEXT NOT NULL,
    topic_id TEXT, -- linked topic if created
    change_type TEXT, -- 'edit', 'comment', 'suggestion'
    location TEXT, -- line number, section, etc.
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artifact_id) REFERENCES artifacts(id),
    FOREIGN KEY (topic_id) REFERENCES topics(id)
);
```

---

## MVP Features (Phase 1)

### MUST HAVE
1. **Always-visible chat interface** (left side, like Claude)
   - User types message
   - AI responds (using Gemini)
   - Full conversation history
   - Simple, clean UI

2. **AI-powered topic extraction**
   - After every AI response, analyze if topics should be created
   - Show suggestion: "I noticed we discussed: [topics]. Create topics?"
   - User can accept all, pick some, or dismiss
   - Topics appear in right sidebar

3. **Topic list view** (right side)
   - List of extracted topics
   - Click to see messages related to that topic
   - Simple status (open/resolved)
   - Edit title/description

4. **Topic-message linking**
   - Highlight which parts of chat relate to which topics
   - Click topic → highlight relevant messages
   - Click message → see which topics it relates to

5. **Simple analytics dashboard**
   - Total topics created
   - Open vs resolved count
   - Recent activity timeline
   - That's it for MVP!

### NICE TO HAVE (Phase 2)
- Artifact creation and editing
- Multi-project support
- Advanced analytics
- Export to various formats
- Collaboration features
- Search across conversations

---

## What I Think You're Missing (Technical Perspective)

### 1. **Context Window Management**
- Conversations get LONG. Can't send entire history every time.
- **Solution**: Use Gemini Flash 2.0 (2M context) OR implement smart summarization
- Keep last N messages in full context, summarize older messages

### 2. **Topic Detection Algorithm**
Detecting when to suggest topics needs strategy:
- **Approach A**: After every AI response, send conversation to AI with prompt: "Extract topics discussed"
- **Approach B**: Use embeddings to detect topic shifts (cheaper but needs setup)
- **Approach C**: Let AI add special markers in its response: `[TOPIC: Title]` when it notices a topic
- **Recommendation**: Start with Approach A (simple), optimize later

### 3. **Real-time Updates**
- If you later add collaboration, you'll need WebSockets or Server-Sent Events
- For MVP: simple polling or just refresh on action is fine

### 4. **Undo/Redo**
- Users will accidentally create/delete topics
- Keep action history for undo
- Or just make everything "soft delete" (status=deleted instead of removing)

### 5. **Mobile Responsiveness**
- Chat on left, topics on right doesn't work on mobile
- Need: Bottom sheet or tabs for mobile view
- Consider this early

### 6. **Export/Backup**
- Users need to get their data out
- Export conversation as Markdown/PDF
- Export topics as CSV/JSON
- Backup before major changes

### 7. **Rate Limiting**
- Gemini free tier has limits
- Need to handle rate limit errors gracefully
- Show user when quota is low
- Maybe add "use local model" fallback button

### 8. **Prompt Engineering for Topic Extraction**
This is CRITICAL. You need a good system prompt:

```
You are analyzing a conversation to extract topics for tracking.

After each user-assistant exchange, determine if any new topics should be created or existing topics updated.

A topic should be created when:
- A new subject/issue/decision point is introduced
- A question needs to be tracked until answered
- A decision needs to be made
- An action item is identified

For each topic, provide:
- Title (concise, 5-8 words)
- Description (1-2 sentences)
- Category (technical, design, business, etc.)
- Priority (high, medium, low)
- Related message IDs

Return as JSON array.
```

### 9. **Conflict Resolution**
- What if AI suggests creating "API Design" topic but user already has one?
- Need fuzzy matching: "API Design" ≈ "API Architecture" ≈ "Rest API design"
- Show user: "Similar topic exists: [API Architecture]. Merge or create new?"

### 10. **Privacy/Security**
- Conversation data is sensitive
- If deployed: Need user auth (Clerk, Auth.js)
- Encrypt sensitive data at rest
- For MVP: Just make it clear it's local/private

---

## Can We Build This? YES!

**Timeline Estimate:**
- Week 1: Basic chat interface + Gemini integration + Turso setup
- Week 2: Topic extraction logic + UI for topic list
- Week 3: Message-topic linking + highlighting
- Week 4: Simple analytics + polish

**It's totally achievable with:**
- You: Product direction, testing, feedback
- Me: Architecture, coding, debugging
- Gemini: AI responses, topic extraction

**Advantages we have:**
1. You know the product vision deeply
2. Gemini API is free and powerful
3. Turso is free and easy
4. No need to over-engineer - MVP can be messy
5. Modern web tools make this faster than ever

---

## Proposed MVP Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (Frontend)                   │
│  ┌────────────────┐           ┌─────────────────────┐  │
│  │   Chat Panel   │           │    Topics Panel     │  │
│  │   (Left Side)  │           │   (Right Side)      │  │
│  │                │           │                     │  │
│  │  [User types]  │           │  • Topic 1 (open)   │  │
│  │  [AI responds] │           │  • Topic 2 (open)   │  │
│  │  [History...]  │           │  • Topic 3 (done)   │  │
│  │                │           │                     │  │
│  └────────────────┘           └─────────────────────┘  │
│         ↓                              ↑                │
└─────────┼──────────────────────────────┼────────────────┘
          │                              │
          ↓                              ↓
┌─────────────────────────────────────────────────────────┐
│              Backend (Next.js API Routes)                │
│                                                          │
│  /api/chat/send        - Send message, get AI response  │
│  /api/topics/suggest   - AI suggests topics             │
│  /api/topics/create    - Create new topic               │
│  /api/topics/list      - Get all topics                 │
│  /api/messages/list    - Get conversation history       │
│                                                          │
└─────────┬─────────────────────────┬──────────────────────┘
          │                         │
          ↓                         ↓
    ┌──────────┐            ┌──────────────┐
    │  Gemini  │            │    Turso     │
    │   API    │            │   Database   │
    └──────────┘            └──────────────┘
```

---

## Next Steps

**Option A: Rebuild from scratch with new architecture**
- Start fresh with Next.js + Turso + Gemini
- Build chat-first interface
- Implement topic extraction
- ~2-4 weeks to working MVP

**Option B: Evolve current demo**
- Keep existing UI components
- Add chat interface to left
- Retrofit topic extraction logic
- Faster but might be messy

**I recommend Option A** - cleaner foundation, easier to maintain

---

## Immediate Action Plan

**What I can do RIGHT NOW:**

1. **Create the schema SQL file** for Turso database
2. **Set up Next.js project** with Turso connection
3. **Build basic chat interface** with Gemini integration
4. **Implement topic extraction prompt** and logic
5. **Create topic list UI**

**What you need to provide:**

1. **Gemini API key** (from Google AI Studio - free)
2. **Turso database credentials** (can set up together)
3. **Feedback/testing** as we build
4. **Product decisions** when I have questions

**Want me to start building the real thing?**

I can start with:
1. Creating a new Next.js project structure
2. Setting up the database schema
3. Building the chat interface
4. Integrating Gemini for responses

Let me know and I'll begin! 🚀

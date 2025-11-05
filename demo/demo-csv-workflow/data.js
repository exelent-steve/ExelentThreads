// Sample conversation data with patterns for institutional memory demo
const conversationData = {
    currentProjectId: "proj-1",
    projects: [
        {
            id: "proj-1",
            name: "Enterprise SaaS Platform",
            description: "Main platform development - API, frontend, and infrastructure",
            created: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date().toISOString(),
            color: "#2563eb",
            threadHistory: [
                // Example thread messages
                {
                    id: "thread-1",
                    speaker: "user",
                    message: "I just sent you comments from the draft API documentation that you sent me. I've added my feedback on the error handling, validation, and AI suggestions sections.",
                    attachedTopicIds: ["topic-1", "topic-10", "topic-23"],
                    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                    topicSnapshots: [
                        {
                            id: "topic-1",
                            title: "API error handling strategy",
                            status: "resolved",
                            category: "architecture",
                            priority: "high",
                            updated: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
                            exchangeCount: 4,
                            lastExchange: "✅ DECISION: Use graceful fallbacks. Show user what we know with confidence scores, allow manual editing."
                        },
                        {
                            id: "topic-10",
                            title: "Data validation error responses",
                            status: "resolved",
                            category: "API design",
                            priority: "high",
                            updated: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
                            exchangeCount: 4,
                            lastExchange: "✅ DECISION: Return 422 with field-level errors. Include confidence scores for partial matches."
                        },
                        {
                            id: "topic-23",
                            title: "Handling conflicting AI suggestions",
                            status: "in-progress",
                            category: "AI features",
                            priority: "medium",
                            updated: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
                            exchangeCount: 3,
                            lastExchange: "When AI models disagree, show all suggestions with confidence scores and let user choose."
                        }
                    ]
                },
                {
                    id: "thread-2",
                    speaker: "claude",
                    message: "Thanks for the feedback! I've reviewed your comments and added my replies to each topic. I have some questions about your approach to error confidence scores, and I need decisions on how we handle conflicting AI suggestions. Please see what I wrote in my replies - I'm waiting to hear what you think before we finalize the documentation.",
                    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 1000).toISOString()
                }
            ],
            topics: [
        // ERROR HANDLING PATTERN (5 topics - shows consistent preference for confidence scores + graceful fallbacks)
        {
            id: "topic-1",
            title: "API error handling strategy",
            status: "resolved",
            category: "architecture",
            priority: "high",
            assignee: "Claude",
            lastResponder: "claude",
            created: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(), // 6 months ago
            updated: new Date(Date.now() - 179 * 24 * 60 * 60 * 1000).toISOString(),
            relatedTopics: ["topic-10", "topic-23"],
            exchanges: [
                { id: "ex-1", speaker: "user", timestamp: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "How should we handle API errors? Return codes or throw exceptions?" },
                { id: "ex-2", speaker: "claude", timestamp: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
                  content: "Return structured error objects with confidence scores. Include: error_code, message, confidence (0-100), suggestion for recovery, and original_error for debugging." },
                { id: "ex-3", speaker: "user", timestamp: new Date(Date.now() - 179 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "Good. And if the error is unrecoverable?" },
                { id: "ex-4", speaker: "claude", timestamp: new Date(Date.now() - 179 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(),
                  content: "✅ DECISION: Use graceful fallbacks. Show user what we know with confidence scores, allow manual editing. Never block the user completely." }
            ]
        },
        {
            id: "topic-10",
            title: "Data validation error responses",
            status: "resolved",
            category: "API design",
            priority: "high",
            assignee: "Claude",
            lastResponder: "claude",
            created: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(), // 5 months ago
            updated: new Date(Date.now() - 149 * 24 * 60 * 60 * 1000).toISOString(),
            relatedTopics: ["topic-1", "topic-23"],
            exchanges: [
                { id: "ex-19", speaker: "user", timestamp: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "Validation failed on user input. Return 400 with generic message or detailed errors?" },
                { id: "ex-20", speaker: "claude", timestamp: new Date(Date.now() - 149 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "✅ DECISION: Return detailed errors with confidence scores. Format: {field: 'email', error: 'Invalid format', confidence: 95, suggestion: 'Check for typos'}. Consistent with our API error handling pattern." }
            ]
        },
        {
            id: "topic-23",
            title: "AI extraction confidence levels",
            status: "resolved",
            category: "features",
            priority: "high",
            assignee: "Me",
            lastResponder: "claude",
            created: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 3 months ago
            updated: new Date(Date.now() - 89 * 24 * 60 * 60 * 1000).toISOString(),
            relatedTopics: ["topic-1", "topic-10", "topic-32"],
            exchanges: [
                { id: "ex-51", speaker: "user", timestamp: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "When AI extracts data from documents, how do we show uncertainty?" },
                { id: "ex-52", speaker: "claude", timestamp: new Date(Date.now() - 89 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "✅ DECISION: Use confidence scores (0-100) with visual indicators. <40 = red warning, 40-70 = yellow caution, >70 = green check. Always allow user editing. Consistent with our error handling strategy." }
            ]
        },
        {
            id: "topic-32",
            title: "Form validation UX pattern",
            status: "resolved",
            category: "UX",
            priority: "medium",
            assignee: "Team",
            lastResponder: "claude",
            created: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 44 * 24 * 60 * 60 * 1000).toISOString(),
            relatedTopics: ["topic-23"],
            exchanges: [
                { id: "ex-89", speaker: "user", timestamp: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "Should we block form submission on validation errors?" },
                { id: "ex-90", speaker: "claude", timestamp: new Date(Date.now() - 44 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "✅ DECISION: Never fully block. Show inline warnings with confidence indicators, but allow submission with confirmation modal. Graceful fallbacks, always." }
            ]
        },
        {
            id: "topic-38",
            title: "Database constraint violations",
            status: "resolved",
            category: "database",
            priority: "medium",
            assignee: "Claude",
            lastResponder: "claude",
            created: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
            exchanges: [
                { id: "ex-105", speaker: "user", timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "How to handle unique constraint violations gracefully?" },
                { id: "ex-106", speaker: "claude", timestamp: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "✅ DECISION: Return error with confidence: 100 (we know it's a duplicate), suggest alternatives, show existing record preview. User can force override if needed. Graceful fallback pattern." }
            ]
        },

        // REST vs GRAPHQL PATTERN (7 topics - shows consistent preference for REST)
        {
            id: "topic-2",
            title: "API architecture: REST vs GraphQL",
            status: "resolved",
            category: "architecture",
            priority: "high",
            assignee: "Me",
            lastResponder: "claude",
            created: new Date(Date.now() - 170 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 169 * 24 * 60 * 60 * 1000).toISOString(),
            relatedTopics: ["topic-15", "topic-27"],
            exchanges: [
                { id: "ex-5", speaker: "user", timestamp: new Date(Date.now() - 170 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "Should we use REST or GraphQL for the public API?" },
                { id: "ex-6", speaker: "claude", timestamp: new Date(Date.now() - 170 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
                  content: "Depends on use case. GraphQL: better for complex, nested data with lots of relationships. REST: simpler, better caching, more tooling." },
                { id: "ex-7", speaker: "user", timestamp: new Date(Date.now() - 169 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "Team has limited GraphQL experience. Simplicity and caching are priorities." },
                { id: "ex-8", speaker: "claude", timestamp: new Date(Date.now() - 169 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000).toISOString(),
                  content: "✅ DECISION: Use REST. Reasons: team familiarity, excellent caching with CDN, simpler debugging, mature ecosystem. Use JSON:API spec for consistency." }
            ]
        },
        {
            id: "topic-15",
            title: "Mobile API design",
            status: "resolved",
            category: "API design",
            priority: "high",
            assignee: "Claude",
            lastResponder: "claude",
            created: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 119 * 24 * 60 * 60 * 1000).toISOString(),
            relatedTopics: ["topic-2"],
            exchanges: [
                { id: "ex-36", speaker: "user", timestamp: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "Mobile app needs efficient data fetching. Reconsider GraphQL?" },
                { id: "ex-37", speaker: "claude", timestamp: new Date(Date.now() - 119 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "✅ DECISION: Stick with REST. Create mobile-optimized endpoints that return exactly what mobile needs. Simpler than GraphQL, works with existing infrastructure." }
            ]
        },
        {
            id: "topic-27",
            title: "Third-party API integrations",
            status: "resolved",
            category: "integrations",
            priority: "medium",
            assignee: "Unassigned",
            lastResponder: "claude",
            created: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 74 * 24 * 60 * 60 * 1000).toISOString(),
            relatedTopics: ["topic-2"],
            exchanges: [
                { id: "ex-74", speaker: "user", timestamp: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "Partner wants GraphQL endpoint. Should we build one?" },
                { id: "ex-75", speaker: "claude", timestamp: new Date(Date.now() - 74 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "✅ DECISION: No. Provide well-designed REST endpoints with good documentation. Adding GraphQL adds maintenance burden. REST has served us well." }
            ]
        },
        {
            id: "topic-35",
            title: "Webhook system design",
            status: "resolved",
            category: "architecture",
            priority: "medium",
            assignee: "Team",
            lastResponder: "claude",
            created: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 59 * 24 * 60 * 60 * 1000).toISOString(),
            exchanges: [
                { id: "ex-97", speaker: "user", timestamp: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "Design for webhook system. Use GraphQL subscriptions?" },
                { id: "ex-98", speaker: "claude", timestamp: new Date(Date.now() - 59 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "✅ DECISION: Simple webhook POSTs (REST pattern). Easy to implement, debug, and consume. Consistent with our REST-first architecture." }
            ]
        },
        {
            id: "topic-40",
            title: "Real-time notifications approach",
            status: "in-progress",
            category: "features",
            priority: "high",
            assignee: "Claude",
            lastResponder: "claude",
            created: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
            exchanges: [
                { id: "ex-111", speaker: "user", timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "Need real-time notifications. WebSockets? GraphQL subscriptions?" },
                { id: "ex-112", speaker: "claude", timestamp: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "WebSockets for real-time, but keep REST for all data fetching. Don't introduce GraphQL just for subscriptions." }
            ]
        },
        {
            id: "topic-42",
            title: "Reporting API performance",
            status: "resolved",
            category: "performance",
            priority: "medium",
            assignee: "Me",
            lastResponder: "claude",
            created: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            exchanges: [
                { id: "ex-117", speaker: "user", timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "Reports API is slow. GraphQL would let clients fetch only what they need." },
                { id: "ex-118", speaker: "claude", timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "✅ DECISION: Optimize REST with field selection via query params (?fields=name,email). Simpler than GraphQL, works with existing caching. Consistent with our architecture." }
            ]
        },
        {
            id: "topic-44",
            title: "CONTRADICTION: GraphQL for admin panel",
            status: "in-progress",
            category: "architecture",
            priority: "medium",
            assignee: "Claude",
            lastResponder: "claude",
            created: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            hasContradiction: true,
            contradictsWith: "topic-2",
            exchanges: [
                { id: "ex-123", speaker: "user", timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "Admin panel needs complex nested data queries. Maybe GraphQL makes sense here?" },
                { id: "ex-124", speaker: "claude", timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "That could work, but conflicts with our REST-first decision (Topic #2). We chose REST for: team familiarity, caching, simplicity. Has that changed? If we add GraphQL, we maintain two API paradigms." }
            ]
        },

        // POSTGRESQL PATTERN (5 topics - shows consistent database choice)
        {
            id: "topic-3",
            title: "Database selection",
            status: "resolved",
            category: "database",
            priority: "high",
            assignee: "Team",
            lastResponder: "claude",
            created: new Date(Date.now() - 165 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 164 * 24 * 60 * 60 * 1000).toISOString(),
            exchanges: [
                { id: "ex-9", speaker: "user", timestamp: new Date(Date.now() - 165 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "PostgreSQL, MySQL, or MongoDB?" },
                { id: "ex-10", speaker: "claude", timestamp: new Date(Date.now() - 164 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "✅ DECISION: PostgreSQL. Reasons: JSONB for flexibility, excellent performance, strong ACID guarantees, best-in-class full-text search, mature ecosystem." }
            ]
        },
        {
            id: "topic-19",
            title: "Analytics database choice",
            status: "resolved",
            category: "database",
            priority: "medium",
            assignee: "Unassigned",
            lastResponder: "claude",
            created: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 99 * 24 * 60 * 60 * 1000).toISOString(),
            exchanges: [
                { id: "ex-44", speaker: "user", timestamp: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "Separate analytics database or same PostgreSQL?" },
                { id: "ex-45", speaker: "claude", timestamp: new Date(Date.now() - 99 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "✅ DECISION: Same PostgreSQL with read replica. TimescaleDB extension for time-series. Simpler than separate system, PostgreSQL handles our scale." }
            ]
        },
        {
            id: "topic-28",
            title: "Session storage solution",
            status: "resolved",
            category: "database",
            priority: "medium",
            assignee: "Claude",
            lastResponder: "claude",
            created: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 69 * 24 * 60 * 60 * 1000).toISOString(),
            exchanges: [
                { id: "ex-76", speaker: "user", timestamp: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "Redis for sessions or PostgreSQL?" },
                { id: "ex-77", speaker: "claude", timestamp: new Date(Date.now() - 69 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "✅ DECISION: PostgreSQL with pgSession. One less system to maintain. Redis only if we need >100K concurrent sessions. Keep it simple." }
            ]
        },
        {
            id: "topic-34",
            title: "Full-text search implementation",
            status: "resolved",
            category: "features",
            priority: "high",
            assignee: "Claude",
            lastResponder: "claude",
            created: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 54 * 24 * 60 * 60 * 1000).toISOString(),
            exchanges: [
                { id: "ex-94", speaker: "user", timestamp: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "ElasticSearch vs PostgreSQL full-text search?" },
                { id: "ex-95", speaker: "claude", timestamp: new Date(Date.now() - 54 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "✅ DECISION: PostgreSQL full-text search with ts_vector. Handles our scale, no additional infrastructure. Add ElasticSearch only if we need advanced features." }
            ]
        },
        {
            id: "topic-41",
            title: "Document storage strategy",
            status: "resolved",
            category: "database",
            priority: "medium",
            assignee: "Unassigned",
            lastResponder: "claude",
            created: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
            exchanges: [
                { id: "ex-113", speaker: "user", timestamp: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "Store JSON documents in PostgreSQL JSONB or separate document DB?" },
                { id: "ex-114", speaker: "claude", timestamp: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "✅ DECISION: PostgreSQL JSONB. Fast indexing, flexible schema, keeps everything in one database. MongoDB would fragment our data." }
            ]
        },

        // MONOLITH-FIRST PATTERN (4 topics)
        {
            id: "topic-4",
            title: "Microservices vs monolith",
            status: "resolved",
            category: "architecture",
            priority: "high",
            assignee: "Me",
            lastResponder: "claude",
            created: new Date(Date.now() - 160 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 159 * 24 * 60 * 60 * 1000).toISOString(),
            exchanges: [
                { id: "ex-11", speaker: "user", timestamp: new Date(Date.now() - 160 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "Start with microservices or monolith?" },
                { id: "ex-12", speaker: "claude", timestamp: new Date(Date.now() - 159 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000).toISOString(),
                  content: "✅ DECISION: Modular monolith first. Clear module boundaries, simpler deployment, easier debugging. Extract to microservices only when needed. Most 'microservices' would be better as monoliths." }
            ]
        },
        {
            id: "topic-21",
            title: "Payment service separation",
            status: "resolved",
            category: "architecture",
            priority: "medium",
            assignee: "Team",
            lastResponder: "claude",
            created: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 84 * 24 * 60 * 60 * 1000).toISOString(),
            exchanges: [
                { id: "ex-48", speaker: "user", timestamp: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "Should payments be a separate microservice?" },
                { id: "ex-49", speaker: "claude", timestamp: new Date(Date.now() - 84 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "✅ DECISION: Keep in monolith as a module. Clear interface, easier transactions, simpler debugging. Our monolith-first approach continues to work well." }
            ]
        },
        {
            id: "topic-29",
            title: "Service deployment strategy",
            status: "resolved",
            category: "deployment",
            priority: "high",
            assignee: "Unassigned",
            lastResponder: "claude",
            created: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 64 * 24 * 60 * 60 * 1000).toISOString(),
            exchanges: [
                { id: "ex-78", speaker: "user", timestamp: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "Deploy as one container or multiple?" },
                { id: "ex-79", speaker: "claude", timestamp: new Date(Date.now() - 64 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "✅ DECISION: Single container (monolith). Simpler CD pipeline, atomic deploys, easier rollbacks. Scale horizontally with load balancer." }
            ]
        },
        {
            id: "topic-36",
            title: "Service scaling approach",
            status: "resolved",
            category: "performance",
            priority: "medium",
            assignee: "Me",
            lastResponder: "claude",
            created: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 49 * 24 * 60 * 60 * 1000).toISOString(),
            exchanges: [
                { id: "ex-99", speaker: "user", timestamp: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "How to scale when traffic grows?" },
                { id: "ex-100", speaker: "claude", timestamp: new Date(Date.now() - 49 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "✅ DECISION: Horizontal scaling of monolith instances. Handles most cases. Extract services only if specific bottleneck needs independent scaling." }
            ]
        },

        // INLINE EDITING PATTERN (4 topics)
        {
            id: "topic-5",
            title: "Form editing UX approach",
            status: "resolved",
            category: "UX",
            priority: "high",
            assignee: "Team",
            lastResponder: "claude",
            created: new Date(Date.now() - 155 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 154 * 24 * 60 * 60 * 1000).toISOString(),
            exchanges: [
                { id: "ex-13", speaker: "user", timestamp: new Date(Date.now() - 155 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "Inline editing or modal forms?" },
                { id: "ex-14", speaker: "claude", timestamp: new Date(Date.now() - 154 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "✅ DECISION: Inline editing for simple fields (text, numbers, dates). Modal only for complex multi-field forms. Faster UX, less context switching." }
            ]
        },
        {
            id: "topic-22",
            title: "Table cell editing pattern",
            status: "resolved",
            category: "UX",
            priority: "medium",
            assignee: "Unassigned",
            lastResponder: "claude",
            created: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 79 * 24 * 60 * 60 * 1000).toISOString(),
            exchanges: [
                { id: "ex-50", speaker: "user", timestamp: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "Double-click to edit cells like Excel?" },
                { id: "ex-51", speaker: "claude", timestamp: new Date(Date.now() - 79 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "✅ DECISION: Yes. Double-click for inline editing. Tab to move between cells. Auto-save on blur. Consistent with our inline-editing-first approach." }
            ]
        },
        {
            id: "topic-30",
            title: "Settings page design",
            status: "resolved",
            category: "UX",
            priority: "low",
            assignee: "Claude",
            lastResponder: "claude",
            created: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 59 * 24 * 60 * 60 * 1000).toISOString(),
            exchanges: [
                { id: "ex-80", speaker: "user", timestamp: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "Edit settings inline or have edit mode?" },
                { id: "ex-81", speaker: "claude", timestamp: new Date(Date.now() - 59 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "✅ DECISION: All inline. Click field to edit, auto-save. No 'Edit Mode' button needed. Faster, simpler." }
            ]
        },
        {
            id: "topic-39",
            title: "Profile editing interface",
            status: "resolved",
            category: "features",
            priority: "medium",
            assignee: "Unassigned",
            lastResponder: "claude",
            created: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString(),
            exchanges: [
                { id: "ex-107", speaker: "user", timestamp: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "User profile: edit modal or inline?" },
                { id: "ex-108", speaker: "claude", timestamp: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "✅ DECISION: Inline for name, email, bio. Modal only for avatar upload (requires file handling). Consistent with inline-first pattern." }
            ]
        },

        // ADDITIONAL DIVERSE TOPICS
        {
            id: "topic-6",
            title: "Authentication strategy",
            status: "resolved",
            category: "security",
            priority: "high",
            assignee: "Me",
            lastResponder: "claude",
            created: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 149 * 24 * 60 * 60 * 1000).toISOString(),
            exchanges: [
                { id: "ex-15", speaker: "user", timestamp: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "JWT or session-based auth?" },
                { id: "ex-16", speaker: "claude", timestamp: new Date(Date.now() - 149 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "✅ DECISION: JWT with refresh tokens. Stateless, scales horizontally, works with mobile apps. Store refresh tokens in PostgreSQL for revocation." }
            ]
        },
        {
            id: "topic-7",
            title: "File upload size limits",
            status: "resolved",
            category: "features",
            priority: "medium",
            assignee: "Team",
            lastResponder: "claude",
            created: new Date(Date.now() - 145 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 144 * 24 * 60 * 60 * 1000).toISOString(),
            exchanges: [
                { id: "ex-17", speaker: "user", timestamp: new Date(Date.now() - 145 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "Max file upload size?" },
                { id: "ex-18", speaker: "claude", timestamp: new Date(Date.now() - 144 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "✅ DECISION: 50MB for regular users, 500MB for enterprise. Use chunked upload for >10MB. Store in S3 with CloudFront CDN." }
            ]
        },
        {
            id: "topic-8",
            title: "Email service provider",
            status: "resolved",
            category: "integrations",
            priority: "medium",
            assignee: "Unassigned",
            lastResponder: "claude",
            created: new Date(Date.now() - 140 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 139 * 24 * 60 * 60 * 1000).toISOString(),
            exchanges: [
                { id: "ex-19", speaker: "user", timestamp: new Date(Date.now() - 140 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "SendGrid, Mailgun, or AWS SES?" },
                { id: "ex-20", speaker: "claude", timestamp: new Date(Date.now() - 139 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "✅ DECISION: AWS SES. Cheapest at scale, reliable, integrates with our AWS infrastructure. Use MJML for responsive email templates." }
            ]
        },
        {
            id: "topic-9",
            title: "Rate limiting approach",
            status: "resolved",
            category: "security",
            priority: "high",
            assignee: "Claude",
            lastResponder: "claude",
            created: new Date(Date.now() - 135 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 134 * 24 * 60 * 60 * 1000).toISOString(),
            exchanges: [
                { id: "ex-21", speaker: "user", timestamp: new Date(Date.now() - 135 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "How to implement rate limiting?" },
                { id: "ex-22", speaker: "claude", timestamp: new Date(Date.now() - 134 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "✅ DECISION: Token bucket algorithm. 100 req/min for free users, 1000 req/min for paid. Use Redis for distributed rate limiting. Return 429 with Retry-After header." }
            ]
        },
        {
            id: "topic-11",
            title: "Frontend framework selection",
            status: "resolved",
            category: "frontend",
            priority: "high",
            assignee: "Me",
            lastResponder: "claude",
            created: new Date(Date.now() - 130 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 129 * 24 * 60 * 60 * 1000).toISOString(),
            exchanges: [
                { id: "ex-23", speaker: "user", timestamp: new Date(Date.now() - 130 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "React, Vue, or Svelte?" },
                { id: "ex-24", speaker: "claude", timestamp: new Date(Date.now() - 129 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
                  content: "✅ DECISION: React with Next.js. Largest ecosystem, team knows it, excellent TypeScript support, mature tooling, great for SEO with SSR." }
            ]
        },
        {
            id: "topic-12",
            title: "CSS approach",
            status: "resolved",
            category: "frontend",
            priority: "medium",
            assignee: "Team",
            lastResponder: "claude",
            created: new Date(Date.now() - 125 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 124 * 24 * 60 * 60 * 1000).toISOString(),
            exchanges: [
                { id: "ex-25", speaker: "user", timestamp: new Date(Date.now() - 125 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "Tailwind, CSS Modules, or styled-components?" },
                { id: "ex-26", speaker: "claude", timestamp: new Date(Date.now() - 124 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "✅ DECISION: Tailwind CSS. Fast development, consistent design system, great with React, smaller bundle than styled-components." }
            ]
        },
        {
            id: "topic-13",
            title: "State management library",
            status: "resolved",
            category: "frontend",
            priority: "high",
            assignee: "Unassigned",
            lastResponder: "claude",
            created: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 119 * 24 * 60 * 60 * 1000).toISOString(),
            exchanges: [
                { id: "ex-27", speaker: "user", timestamp: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "Redux, Zustand, or Jotai?" },
                { id: "ex-28", speaker: "claude", timestamp: new Date(Date.now() - 119 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "✅ DECISION: Zustand. Simpler than Redux, less boilerplate, great TypeScript support, perfect for our app size. Use React Query for server state." }
            ]
        },
        {
            id: "topic-14",
            title: "Testing strategy",
            status: "resolved",
            category: "testing",
            priority: "high",
            assignee: "Me",
            lastResponder: "claude",
            created: new Date(Date.now() - 115 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 114 * 24 * 60 * 60 * 1000).toISOString(),
            exchanges: [
                { id: "ex-29", speaker: "user", timestamp: new Date(Date.now() - 115 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "What's our testing pyramid?" },
                { id: "ex-30", speaker: "claude", timestamp: new Date(Date.now() - 114 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
                  content: "✅ DECISION: 70% unit tests (Jest), 20% integration tests (Supertest), 10% E2E tests (Playwright). Focus on critical paths. Aim for 80% coverage on business logic." }
            ]
        },
        {
            id: "topic-16",
            title: "Logging strategy",
            status: "resolved",
            category: "observability",
            priority: "high",
            assignee: "Team",
            lastResponder: "claude",
            created: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 109 * 24 * 60 * 60 * 1000).toISOString(),
            exchanges: [
                { id: "ex-31", speaker: "user", timestamp: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "Logging solution?" },
                { id: "ex-32", speaker: "claude", timestamp: new Date(Date.now() - 109 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "✅ DECISION: Structured JSON logging with Winston. Ship to CloudWatch Logs. Add correlation IDs for request tracing. Log levels: ERROR for issues, INFO for key events, DEBUG locally only." }
            ]
        },
        {
            id: "topic-17",
            title: "Monitoring and alerting",
            status: "in-progress",
            category: "observability",
            priority: "high",
            assignee: "Claude",
            lastResponder: "user",
            created: new Date(Date.now() - 105 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            exchanges: [
                { id: "ex-33", speaker: "user", timestamp: new Date(Date.now() - 105 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "Datadog vs Grafana vs CloudWatch?" },
                { id: "ex-34", speaker: "claude", timestamp: new Date(Date.now() - 104 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "Start with CloudWatch (we're on AWS). Add Grafana if we need custom dashboards. Datadog only if CloudWatch becomes limiting." },
                { id: "ex-35", speaker: "user", timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "CloudWatch is getting expensive. Reconsider?" }
            ]
        },
        {
            id: "topic-18",
            title: "Payment provider",
            status: "resolved",
            category: "integrations",
            priority: "high",
            assignee: "Me",
            lastResponder: "claude",
            created: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 94 * 24 * 60 * 60 * 1000).toISOString(),
            exchanges: [
                { id: "ex-36", speaker: "user", timestamp: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "Stripe or Braintree?" },
                { id: "ex-37", speaker: "claude", timestamp: new Date(Date.now() - 94 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "✅ DECISION: Stripe. Best developer experience, excellent documentation, supports subscriptions, handles PCI compliance, global payment methods." }
            ]
        },
        {
            id: "topic-20",
            title: "Image optimization",
            status: "resolved",
            category: "performance",
            priority: "medium",
            assignee: "Unassigned",
            lastResponder: "claude",
            created: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 89 * 24 * 60 * 60 * 1000).toISOString(),
            exchanges: [
                { id: "ex-38", speaker: "user", timestamp: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "How to optimize images?" },
                { id: "ex-39", speaker: "claude", timestamp: new Date(Date.now() - 89 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "✅ DECISION: Use Next.js Image component. Auto WebP conversion, lazy loading, responsive sizes. Serve via CloudFront CDN. Compress on upload with Sharp." }
            ]
        },
        {
            id: "topic-24",
            title: "API versioning strategy",
            status: "resolved",
            category: "API design",
            priority: "high",
            assignee: "Team",
            lastResponder: "claude",
            created: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 84 * 24 * 60 * 60 * 1000).toISOString(),
            exchanges: [
                { id: "ex-52", speaker: "user", timestamp: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "How to version our API?" },
                { id: "ex-53", speaker: "claude", timestamp: new Date(Date.now() - 84 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "✅ DECISION: URL versioning (/api/v1/). Simple, clear, cacheable. Increment only for breaking changes. Maintain v1 for 1 year after v2 launch." }
            ]
        },
        {
            id: "topic-25",
            title: "Background job processing",
            status: "resolved",
            category: "architecture",
            priority: "high",
            assignee: "Unassigned",
            lastResponder: "claude",
            created: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 79 * 24 * 60 * 60 * 1000).toISOString(),
            exchanges: [
                { id: "ex-54", speaker: "user", timestamp: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "Bull, BullMQ, or SQS?" },
                { id: "ex-55", speaker: "claude", timestamp: new Date(Date.now() - 79 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "✅ DECISION: BullMQ with Redis. Better than Bull (maintained), better DX than SQS. Supports retries, priorities, delayed jobs. Use SQS only if we need cross-service queues." }
            ]
        },
        {
            id: "topic-26",
            title: "Password requirements",
            status: "resolved",
            category: "security",
            priority: "medium",
            assignee: "Me",
            lastResponder: "claude",
            created: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 74 * 24 * 60 * 60 * 1000).toISOString(),
            exchanges: [
                { id: "ex-56", speaker: "user", timestamp: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "Password rules?" },
                { id: "ex-57", speaker: "claude", timestamp: new Date(Date.now() - 74 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "✅ DECISION: Min 12 chars, no complexity requirements (NIST guidelines). Check against HaveIBeenPwned API. Use Argon2 for hashing. Encourage passkeys." }
            ]
        },
        {
            id: "topic-31",
            title: "Code review process",
            status: "open",
            category: "process",
            priority: "medium",
            assignee: "Unassigned",
            lastResponder: "user",
            created: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            exchanges: [
                { id: "ex-82", speaker: "user", timestamp: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "What's our code review standard?" }
            ]
        },
        {
            id: "topic-33",
            title: "Dark mode implementation",
            status: "in-progress",
            category: "UX",
            priority: "low",
            assignee: "Team",
            lastResponder: "user",
            created: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
            exchanges: [
                { id: "ex-91", speaker: "user", timestamp: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "Add dark mode?" },
                { id: "ex-92", speaker: "claude", timestamp: new Date(Date.now() - 49 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "Use Tailwind dark: classes with system preference detection. Store user override in localStorage." },
                { id: "ex-93", speaker: "user", timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "Charts look bad in dark mode. How to fix?" }
            ]
        },
        {
            id: "topic-37",
            title: "Feature flag system",
            status: "open",
            category: "architecture",
            priority: "medium",
            assignee: "Unassigned",
            lastResponder: "user",
            created: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
            exchanges: [
                { id: "ex-101", speaker: "user", timestamp: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "LaunchDarkly vs build our own?" }
            ]
        },
        {
            id: "topic-43",
            title: "Mobile app: native or React Native?",
            status: "open",
            category: "mobile",
            priority: "high",
            assignee: "Claude",
            lastResponder: "claude",
            created: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            exchanges: [
                { id: "ex-119", speaker: "user", timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "We need iOS and Android apps. Native or React Native?" },
                { id: "ex-120", speaker: "claude", timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
                  content: "React Native if we want to share code and ship faster. Native if we need best performance and platform-specific features. What's the priority?" }
            ]
        },
        {
            id: "topic-45",
            title: "Documentation platform",
            status: "in-progress",
            category: "documentation",
            priority: "medium",
            assignee: "Claude",
            lastResponder: "claude",
            created: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            exchanges: [
                { id: "ex-125", speaker: "user", timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "Docusaurus, GitBook, or Notion for docs?" },
                { id: "ex-126", speaker: "claude", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                  content: "Docusaurus. Free, versioned, searchable, integrates with GitHub. Notion is not developer-friendly. GitBook is expensive." }
            ]
        }
            ]
        },
        {
            id: "proj-2",
            name: "Mobile App Redesign",
            description: "iOS and Android app redesign with new UX patterns",
            created: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            color: "#7c3aed",
            threadHistory: [],
            topics: []
        },
        {
            id: "proj-3",
            name: "Customer Analytics Pipeline",
            description: "Data warehouse and analytics infrastructure",
            created: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            updated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            color: "#10b981",
            threadHistory: [],
            topics: []
        }
    ]
};

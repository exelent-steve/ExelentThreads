// Analytics View Component

class AnalyticsView {
    constructor(data) {
        this.data = data;
    }

    render() {
        const container = document.getElementById('view-container');
        const stats = this.calculateStatistics();
        const patterns = this.detectPatterns();
        const activity = this.getRecentActivity();
        const mergeSuggestions = this.detectMergeCandidates();

        container.innerHTML = `
            <div class="analytics-view">
                <div class="analytics-header">
                    <h2>📈 Analytics & Patterns</h2>
                    <p class="analytics-subtitle">Institutional knowledge learned from your ${this.data.topics.length} topics</p>
                </div>

                <div class="analytics-grid">
                    <!-- Key Metrics -->
                    <div class="analytics-section">
                        <h3 class="section-title">📊 Key Metrics</h3>
                        <div class="metrics-grid">
                            <div class="metric-card">
                                <div class="metric-value">${stats.totalTopics}</div>
                                <div class="metric-label">Total Topics</div>
                            </div>
                            <div class="metric-card">
                                <div class="metric-value">${stats.resolvedTopics}</div>
                                <div class="metric-label">Resolved</div>
                            </div>
                            <div class="metric-card">
                                <div class="metric-value">${stats.inProgressTopics}</div>
                                <div class="metric-label">In Progress</div>
                            </div>
                            <div class="metric-card">
                                <div class="metric-value">${stats.openTopics}</div>
                                <div class="metric-label">Open</div>
                            </div>
                            <div class="metric-card">
                                <div class="metric-value">${stats.totalExchanges}</div>
                                <div class="metric-label">Total Exchanges</div>
                            </div>
                            <div class="metric-card">
                                <div class="metric-value">${stats.avgExchanges}</div>
                                <div class="metric-label">Avg per Topic</div>
                            </div>
                        </div>
                    </div>

                    <!-- Decision Patterns -->
                    <div class="analytics-section">
                        <h3 class="section-title">🧠 Your Decision Patterns</h3>
                        <div class="patterns-list">
                            ${patterns.map(pattern => `
                                <div class="pattern-item">
                                    <div class="pattern-header">
                                        <span class="pattern-category">${pattern.category}</span>
                                        <span class="pattern-confidence">${pattern.topics.length} of ${pattern.total} topics</span>
                                    </div>
                                    <div class="pattern-decision">${pattern.decision}</div>
                                    <div class="pattern-topics">
                                        Topics: ${pattern.topics.map(t => `#${t.id.split('-')[1]}`).join(', ')}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Category Breakdown -->
                    <div class="analytics-section">
                        <h3 class="section-title">📋 Topics by Category</h3>
                        <div class="category-list">
                            ${Object.entries(stats.byCategory)
                                .sort((a, b) => b[1] - a[1])
                                .map(([category, count]) => `
                                    <div class="category-item">
                                        <div class="category-bar-wrapper">
                                            <div class="category-name">${category}</div>
                                            <div class="category-count">${count}</div>
                                        </div>
                                        <div class="category-bar">
                                            <div class="category-bar-fill" style="width: ${(count / stats.totalTopics) * 100}%"></div>
                                        </div>
                                    </div>
                                `).join('')}
                        </div>
                    </div>

                    <!-- Work Style Analysis -->
                    <div class="analytics-section">
                        <h3 class="section-title">⏱️ Work Style Analysis</h3>
                        <div class="work-style-list">
                            ${stats.workStyle.map(item => `
                                <div class="work-style-item">
                                    <div class="work-style-label">${item.label}</div>
                                    <div class="work-style-value">${item.value}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Recent Activity -->
                    <div class="analytics-section">
                        <h3 class="section-title">🕐 Recent Activity</h3>
                        <div class="activity-feed">
                            ${activity.slice(0, 10).map(item => `
                                <div class="activity-item">
                                    <span class="activity-icon">${item.icon}</span>
                                    <div class="activity-content">
                                        <div class="activity-title">${item.title}</div>
                                        <div class="activity-time">${formatRelativeTime(item.timestamp)}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Top Contributors (Categories) -->
                    <div class="analytics-section">
                        <h3 class="section-title">🎯 Resolution Rate by Priority</h3>
                        <div class="priority-stats">
                            ${Object.entries(stats.byPriority).map(([priority, data]) => `
                                <div class="priority-item">
                                    <div class="priority-header">
                                        <span class="priority-label">${priority}</span>
                                        <span class="priority-rate">${data.resolutionRate}% resolved</span>
                                    </div>
                                    <div class="priority-details">
                                        ${data.resolved} resolved of ${data.total} total
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Merge Suggestions -->
                    ${mergeSuggestions.length > 0 ? `
                        <div class="analytics-section merge-suggestions-section">
                            <h3 class="section-title">🔗 Topic Merge Suggestions</h3>
                            <p class="merge-description">AI detected ${mergeSuggestions.length} group${mergeSuggestions.length > 1 ? 's' : ''} of similar topics that could be merged</p>
                            <div class="merge-list">
                                ${mergeSuggestions.map((suggestion, index) => `
                                    <div class="merge-suggestion-card">
                                        <div class="merge-header">
                                            <div class="merge-title">
                                                <span class="merge-icon">🔀</span>
                                                Suggested Merge #${index + 1}
                                            </div>
                                            <div class="merge-confidence ${this.getMergeConfidenceClass(suggestion.confidence)}">
                                                ${suggestion.confidence}% similarity
                                            </div>
                                        </div>
                                        <div class="merge-reason">${suggestion.reason}</div>
                                        <div class="merge-topics-list">
                                            ${suggestion.topics.map(topic => `
                                                <div class="merge-topic-item">
                                                    <span class="merge-topic-status status-badge ${topic.status}">${topic.status}</span>
                                                    <span class="merge-topic-title">${escapeHtml(topic.title)}</span>
                                                    <span class="merge-topic-meta">${topic.exchanges.length} exchanges</span>
                                                </div>
                                            `).join('')}
                                        </div>
                                        <div class="merge-actions">
                                            <button class="btn-small btn-primary-small" onclick="window.app.previewMerge([${suggestion.topics.map(t => `'${t.id}'`).join(',')}])">
                                                👁️ Preview Merge
                                            </button>
                                            <button class="btn-small" onclick="showToast('In the real app, this would merge the topics')">
                                                Dismiss
                                            </button>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    calculateStatistics() {
        const topics = this.data.topics;

        const stats = {
            totalTopics: topics.length,
            resolvedTopics: topics.filter(t => t.status === 'resolved').length,
            inProgressTopics: topics.filter(t => t.status === 'in-progress').length,
            openTopics: topics.filter(t => t.status === 'open').length,
            archivedTopics: topics.filter(t => t.status === 'archived').length,
            totalExchanges: topics.reduce((sum, t) => sum + t.exchanges.length, 0),
            avgExchanges: 0,
            byCategory: {},
            byPriority: {},
            workStyle: []
        };

        stats.avgExchanges = (stats.totalExchanges / stats.totalTopics).toFixed(1);

        // By category
        topics.forEach(topic => {
            const cat = topic.category || 'uncategorized';
            stats.byCategory[cat] = (stats.byCategory[cat] || 0) + 1;
        });

        // By priority
        topics.forEach(topic => {
            const pri = topic.priority || 'medium';
            if (!stats.byPriority[pri]) {
                stats.byPriority[pri] = { total: 0, resolved: 0, resolutionRate: 0 };
            }
            stats.byPriority[pri].total++;
            if (topic.status === 'resolved') {
                stats.byPriority[pri].resolved++;
            }
        });

        // Calculate resolution rates
        Object.keys(stats.byPriority).forEach(pri => {
            const data = stats.byPriority[pri];
            data.resolutionRate = Math.round((data.resolved / data.total) * 100);
        });

        // Work style analysis
        const archTopics = topics.filter(t => t.category === 'architecture' && t.status === 'resolved');
        const featureTopics = topics.filter(t => t.category === 'features' && t.status === 'resolved');

        if (archTopics.length > 0) {
            const avgArchExchanges = (archTopics.reduce((sum, t) => sum + t.exchanges.length, 0) / archTopics.length).toFixed(1);
            stats.workStyle.push({
                label: 'Architecture topics: avg exchanges to resolve',
                value: avgArchExchanges
            });
        }

        if (featureTopics.length > 0) {
            const avgFeatureExchanges = (featureTopics.reduce((sum, t) => sum + t.exchanges.length, 0) / featureTopics.length).toFixed(1);
            stats.workStyle.push({
                label: 'Feature topics: avg exchanges to resolve',
                value: avgFeatureExchanges
            });
        }

        // Most active period
        const recentTopics = topics.filter(t => {
            const daysSince = (Date.now() - new Date(t.updated).getTime()) / (1000 * 60 * 60 * 24);
            return daysSince <= 30;
        });

        stats.workStyle.push({
            label: 'Topics updated in last 30 days',
            value: recentTopics.length
        });

        stats.workStyle.push({
            label: 'Average time between updates',
            value: 'Every 2-3 days'
        });

        return stats;
    }

    detectPatterns() {
        const patterns = [];

        // Error handling pattern
        const errorTopics = this.data.topics.filter(t =>
            t.status === 'resolved' &&
            (t.title.toLowerCase().includes('error') ||
             t.title.toLowerCase().includes('validation') ||
             t.exchanges.some(e => e.content.toLowerCase().includes('confidence score')))
        );

        if (errorTopics.length >= 3) {
            patterns.push({
                category: 'Error Handling',
                decision: 'You consistently prefer: Confidence scores (5/5 topics), Graceful fallbacks (5/5 topics), User editing capability (5/5 topics)',
                topics: errorTopics.slice(0, 5),
                total: 5
            });
        }

        // REST vs GraphQL pattern
        const restTopics = this.data.topics.filter(t =>
            t.status === 'resolved' &&
            (t.title.toLowerCase().includes('api') || t.title.toLowerCase().includes('rest') || t.title.toLowerCase().includes('graphql')) &&
            t.exchanges.some(e => e.content.toLowerCase().includes('rest'))
        );

        if (restTopics.length >= 5) {
            patterns.push({
                category: 'API Architecture',
                decision: 'You typically choose: REST over GraphQL (6/7 topics), Reasons: Team familiarity, better caching, simpler debugging',
                topics: restTopics.slice(0, 7),
                total: 7
            });
        }

        // Database pattern
        const dbTopics = this.data.topics.filter(t =>
            t.status === 'resolved' &&
            (t.category === 'database' || t.title.toLowerCase().includes('database') || t.title.toLowerCase().includes('postgre'))
        );

        if (dbTopics.length >= 3) {
            patterns.push({
                category: 'Database',
                decision: 'You consistently prefer: PostgreSQL (5/5 database topics), JSONB for flexibility, Keep systems consolidated',
                topics: dbTopics.slice(0, 5),
                total: 5
            });
        }

        // Monolith pattern
        const archTopics = this.data.topics.filter(t =>
            t.status === 'resolved' &&
            (t.title.toLowerCase().includes('monolith') || t.title.toLowerCase().includes('microservice') || t.title.toLowerCase().includes('service'))
        );

        if (archTopics.length >= 3) {
            patterns.push({
                category: 'Architecture Style',
                decision: 'You typically choose: Monolith-first approach (4/5 topics), Extract to microservices only when needed',
                topics: archTopics.slice(0, 4),
                total: 5
            });
        }

        // UX pattern
        const uxTopics = this.data.topics.filter(t =>
            t.status === 'resolved' &&
            t.category === 'UX' &&
            t.exchanges.some(e => e.content.toLowerCase().includes('inline'))
        );

        if (uxTopics.length >= 3) {
            patterns.push({
                category: 'UX Design',
                decision: 'You prefer: Inline editing over modals (4/4 topics), Faster UX with less context switching',
                topics: uxTopics,
                total: 4
            });
        }

        return patterns;
    }

    getRecentActivity() {
        const activity = [];

        // Get all topics sorted by update time
        const sortedTopics = [...this.data.topics].sort((a, b) =>
            new Date(b.updated) - new Date(a.updated)
        );

        sortedTopics.forEach(topic => {
            const icon = topic.status === 'resolved' ? '✅' :
                        topic.status === 'in-progress' ? '🔄' : '📝';

            activity.push({
                icon: icon,
                title: `${topic.status === 'resolved' ? 'Resolved' : topic.status === 'in-progress' ? 'Updated' : 'Created'}: ${topic.title}`,
                timestamp: topic.updated
            });
        });

        return activity;
    }

    detectMergeCandidates() {
        const candidates = [];
        const processed = new Set();

        // Compare all topics pairwise
        for (let i = 0; i < this.data.topics.length; i++) {
            if (processed.has(this.data.topics[i].id)) continue;

            const baseTopic = this.data.topics[i];
            const similarTopics = [baseTopic];

            for (let j = i + 1; j < this.data.topics.length; j++) {
                if (processed.has(this.data.topics[j].id)) continue;

                const compareTopic = this.data.topics[j];
                const similarity = this.calculateTopicSimilarity(baseTopic, compareTopic);

                if (similarity >= 50) { // 50% threshold for merge suggestion
                    similarTopics.push(compareTopic);
                    processed.add(compareTopic.id);
                }
            }

            if (similarTopics.length >= 2) {
                candidates.push({
                    topics: similarTopics,
                    confidence: this.calculateGroupConfidence(similarTopics),
                    reason: this.generateMergeReason(similarTopics)
                });
                similarTopics.forEach(t => processed.add(t.id));
            }
        }

        return candidates.sort((a, b) => b.confidence - a.confidence);
    }

    calculateTopicSimilarity(topic1, topic2) {
        let score = 0;

        // Explicitly related topics bonus (25 points)
        if (topic1.relatedTopics && topic1.relatedTopics.includes(topic2.id)) {
            score += 25;
        }
        if (topic2.relatedTopics && topic2.relatedTopics.includes(topic1.id)) {
            score += 25;
        }

        // Category match (25 points)
        if (topic1.category && topic2.category && topic1.category === topic2.category) {
            score += 25;
        }

        // Title similarity (30 points max)
        const title1Words = topic1.title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
        const title2Words = topic2.title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
        const titleOverlap = title1Words.filter(w => title2Words.includes(w)).length;
        if (titleOverlap > 0) {
            const titleScore = (titleOverlap / Math.max(title1Words.length, title2Words.length)) * 30;
            score += titleScore;
        }

        // Content similarity (20 points max)
        const content1 = topic1.exchanges.map(e => e.content.toLowerCase()).join(' ');
        const content2 = topic2.exchanges.map(e => e.content.toLowerCase()).join(' ');

        // Extract significant words (>3 chars, not common words)
        const commonWords = ['this', 'that', 'with', 'from', 'have', 'will', 'would', 'should', 'could', 'their', 'there', 'what', 'when', 'where', 'which', 'about', 'them', 'these', 'those'];
        const words1 = content1.split(/\s+/).filter(w => w.length > 3 && !commonWords.includes(w));
        const words2 = content2.split(/\s+/).filter(w => w.length > 3 && !commonWords.includes(w));

        // Count shared significant words
        const uniqueWords1 = [...new Set(words1)].slice(0, 30); // Top 30 unique words
        const uniqueWords2 = [...new Set(words2)].slice(0, 30);
        const contentOverlap = uniqueWords1.filter(w => uniqueWords2.includes(w)).length;
        if (contentOverlap > 0) {
            const contentScore = Math.min(20, (contentOverlap / 5) * 10); // Up to 20 points
            score += contentScore;
        }

        return Math.round(score);
    }

    calculateGroupConfidence(topics) {
        if (topics.length === 2) {
            return this.calculateTopicSimilarity(topics[0], topics[1]);
        }

        // For multiple topics, calculate average pairwise similarity
        let totalSimilarity = 0;
        let comparisons = 0;

        for (let i = 0; i < topics.length; i++) {
            for (let j = i + 1; j < topics.length; j++) {
                totalSimilarity += this.calculateTopicSimilarity(topics[i], topics[j]);
                comparisons++;
            }
        }

        return Math.round(totalSimilarity / comparisons);
    }

    generateMergeReason(topics) {
        const categories = [...new Set(topics.map(t => t.category).filter(Boolean))];
        const titleWords = topics.map(t =>
            t.title.toLowerCase().split(/\s+/).filter(w => w.length > 3)
        );

        // Find common keywords
        const allWords = titleWords.flat();
        const wordCounts = {};
        allWords.forEach(word => {
            wordCounts[word] = (wordCounts[word] || 0) + 1;
        });
        const commonKeywords = Object.entries(wordCounts)
            .filter(([word, count]) => count >= 2)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([word]) => word);

        if (categories.length === 1 && commonKeywords.length > 0) {
            return `All topics are about "${categories[0]}" and discuss: ${commonKeywords.join(', ')}`;
        } else if (commonKeywords.length >= 2) {
            return `Topics share common themes: ${commonKeywords.join(', ')}`;
        } else if (categories.length === 1) {
            return `All topics are in the same category: "${categories[0]}"`;
        } else {
            return 'Topics discuss similar concepts and could be consolidated';
        }
    }

    getMergeConfidenceClass(confidence) {
        if (confidence >= 80) return 'confidence-high';
        if (confidence >= 60) return 'confidence-medium';
        return 'confidence-low';
    }
}

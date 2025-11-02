// Team Performance Dashboard - Usage Metrics and Collaboration

class TeamDashboard {
    constructor(data) {
        this.data = data;
    }

    render() {
        const container = document.getElementById('view-container');
        const usageMetrics = this.calculateUsageMetrics();
        const categoryBreakdown = this.getCategoryBreakdown();
        const resolutionMetrics = this.calculateResolutionMetrics();

        container.innerHTML = `
            <div class="dashboard-view">
                <div class="dashboard-header">
                    <h2>👥 Team Performance Dashboard</h2>
                    <p class="dashboard-subtitle">Track AI usage, collaboration patterns, and team productivity</p>
                </div>

                <div class="dashboard-grid">
                    <!-- Usage Overview -->
                    <div class="dashboard-section">
                        <h3 class="section-title">Usage Overview</h3>
                        <div class="metrics-grid">
                            <div class="metric-card">
                                <div class="metric-value">${usageMetrics.totalTopics}</div>
                                <div class="metric-label">Total Topics</div>
                            </div>
                            <div class="metric-card">
                                <div class="metric-value">${usageMetrics.avgPerWeek}</div>
                                <div class="metric-label">Topics per Week</div>
                            </div>
                            <div class="metric-card">
                                <div class="metric-value">${usageMetrics.resolutionRate}%</div>
                                <div class="metric-label">Resolution Rate</div>
                            </div>
                            <div class="metric-card">
                                <div class="metric-value">${usageMetrics.avgExchanges}</div>
                                <div class="metric-label">Avg Exchanges</div>
                            </div>
                        </div>
                    </div>

                    <!-- Category Focus -->
                    <div class="dashboard-section full-width">
                        <h3 class="section-title">📋 Focus Areas by Category</h3>
                        <div class="category-breakdown">
                            ${categoryBreakdown.map(cat => `
                                <div class="category-breakdown-item">
                                    <div class="category-breakdown-header">
                                        <span class="category-name">${cat.category}</span>
                                        <span class="category-stats">${cat.count} topics • ${cat.percentage}%</span>
                                    </div>
                                    <div class="category-breakdown-bar">
                                        <div class="category-breakdown-fill" style="width: ${cat.percentage}%; background: ${cat.color}"></div>
                                    </div>
                                    <div class="category-breakdown-details">
                                        <span>${cat.resolved} resolved</span>
                                        <span>${cat.inProgress} in progress</span>
                                        <span>${cat.open} open</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Resolution Efficiency -->
                    <div class="dashboard-section">
                        <h3 class="section-title">⚡ Resolution Efficiency</h3>
                        <div class="efficiency-stats">
                            ${resolutionMetrics.map(metric => `
                                <div class="efficiency-item">
                                    <div class="efficiency-label">${metric.label}</div>
                                    <div class="efficiency-value ${metric.trend}">${metric.value}</div>
                                    <div class="efficiency-trend">${metric.change}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Collaboration Insights -->
                    <div class="dashboard-section">
                        <h3 class="section-title">🤝 Collaboration Patterns</h3>
                        <p class="dashboard-description">Topics with related discussions show cross-team collaboration</p>
                        <div class="collaboration-stats">
                            <div class="collab-metric">
                                <div class="collab-value">${this.data.topics.filter(t => t.relatedTopics && t.relatedTopics.length > 0).length}</div>
                                <div class="collab-label">Topics with Related Links</div>
                            </div>
                            <div class="collab-metric">
                                <div class="collab-value">${Math.round((this.data.topics.filter(t => t.relatedTopics && t.relatedTopics.length > 0).length / this.data.topics.length) * 100)}%</div>
                                <div class="collab-label">Collaboration Rate</div>
                            </div>
                            <div class="collab-metric">
                                <div class="collab-value">2.3</div>
                                <div class="collab-label">Avg Related Topics</div>
                            </div>
                        </div>
                    </div>

                    <!-- Knowledge Gaps -->
                    <div class="dashboard-section">
                        <h3 class="section-title">🔍 Knowledge Gaps</h3>
                        <p class="dashboard-description">Areas that might need more AI assistance</p>
                        <div class="knowledge-gaps">
                            <div class="gap-item">
                                <div class="gap-icon">📉</div>
                                <div class="gap-content">
                                    <div class="gap-title">Security & Compliance</div>
                                    <div class="gap-description">Only 2 topics in past 90 days - consider if more guidance needed</div>
                                </div>
                            </div>
                            <div class="gap-item">
                                <div class="gap-icon">⏱️</div>
                                <div class="gap-content">
                                    <div class="gap-title">Performance Optimization</div>
                                    <div class="gap-description">3 open topics stalled >30 days - may need expert input</div>
                                </div>
                            </div>
                            <div class="gap-item gap-positive">
                                <div class="gap-icon">✅</div>
                                <div class="gap-content">
                                    <div class="gap-title">API Architecture</div>
                                    <div class="gap-description">Strong coverage with 12 resolved topics - patterns established</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Priority Distribution -->
                    <div class="dashboard-section">
                        <h3 class="section-title">🎯 Work Distribution by Priority</h3>
                        <div class="priority-chart">
                            ${this.getPriorityDistribution().map(pri => `
                                <div class="priority-row">
                                    <div class="priority-label priority-${pri.priority}">${pri.priority}</div>
                                    <div class="priority-bar-container">
                                        <div class="priority-bar priority-${pri.priority}" style="width: ${pri.percentage}%"></div>
                                    </div>
                                    <div class="priority-count">${pri.count} (${pri.percentage}%)</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Top Performing Categories -->
                    <div class="dashboard-section">
                        <h3 class="section-title">🏆 Top Performing Categories</h3>
                        <p class="dashboard-description">Categories with highest resolution rates</p>
                        <div class="top-categories">
                            ${this.getTopCategories().map((cat, idx) => `
                                <div class="top-category-item">
                                    <div class="top-category-rank">#${idx + 1}</div>
                                    <div class="top-category-content">
                                        <div class="top-category-name">${cat.category}</div>
                                        <div class="top-category-stats">${cat.resolved}/${cat.total} resolved (${cat.rate}%)</div>
                                    </div>
                                    <div class="top-category-badge ${cat.rate >= 80 ? 'badge-gold' : cat.rate >= 60 ? 'badge-silver' : 'badge-bronze'}">
                                        ${cat.rate}%
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    calculateUsageMetrics() {
        const totalTopics = this.data.topics.length;
        const resolved = this.data.topics.filter(t => t.status === 'resolved').length;
        const totalExchanges = this.data.topics.reduce((sum, t) => sum + t.exchanges.length, 0);

        return {
            totalTopics,
            avgPerWeek: Math.round(totalTopics / 12), // Simulating 12 weeks
            resolutionRate: Math.round((resolved / totalTopics) * 100),
            avgExchanges: (totalExchanges / totalTopics).toFixed(1)
        };
    }

    getCategoryBreakdown() {
        const categories = {};
        this.data.topics.forEach(topic => {
            const cat = topic.category || 'uncategorized';
            if (!categories[cat]) {
                categories[cat] = { total: 0, resolved: 0, inProgress: 0, open: 0 };
            }
            categories[cat].total++;
            if (topic.status === 'resolved') categories[cat].resolved++;
            else if (topic.status === 'in-progress') categories[cat].inProgress++;
            else if (topic.status === 'open') categories[cat].open++;
        });

        const colors = ['#2563eb', '#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#6b7280'];
        let colorIdx = 0;

        return Object.entries(categories)
            .map(([category, data]) => ({
                category,
                count: data.total,
                percentage: Math.round((data.total / this.data.topics.length) * 100),
                resolved: data.resolved,
                inProgress: data.inProgress,
                open: data.open,
                color: colors[colorIdx++ % colors.length]
            }))
            .sort((a, b) => b.count - a.count);
    }

    calculateResolutionMetrics() {
        return [
            { label: 'Avg Time to Resolve', value: '5.2 days', change: '+1.3 days from last period', trend: 'trend-down' },
            { label: 'Topics Resolved This Week', value: '8', change: '+2 from last week', trend: 'trend-up' },
            { label: 'Avg Exchanges to Resolve', value: '4.2', change: 'Consistent with average', trend: '' }
        ];
    }

    getPriorityDistribution() {
        const priorities = { high: 0, medium: 0, low: 0 };
        this.data.topics.forEach(t => {
            const pri = t.priority || 'medium';
            priorities[pri] = (priorities[pri] || 0) + 1;
        });

        return Object.entries(priorities).map(([priority, count]) => ({
            priority,
            count,
            percentage: Math.round((count / this.data.topics.length) * 100)
        }));
    }

    getTopCategories() {
        const categories = {};
        this.data.topics.forEach(topic => {
            const cat = topic.category || 'uncategorized';
            if (!categories[cat]) {
                categories[cat] = { total: 0, resolved: 0 };
            }
            categories[cat].total++;
            if (topic.status === 'resolved') categories[cat].resolved++;
        });

        return Object.entries(categories)
            .filter(([cat, data]) => data.total >= 3) // Only categories with 3+ topics
            .map(([category, data]) => ({
                category,
                total: data.total,
                resolved: data.resolved,
                rate: Math.round((data.resolved / data.total) * 100)
            }))
            .sort((a, b) => b.rate - a.rate)
            .slice(0, 5);
    }
}

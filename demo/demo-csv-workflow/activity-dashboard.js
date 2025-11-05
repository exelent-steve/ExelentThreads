// Activity Dashboard - Hot/Cold Engagement Tracking

class ActivityDashboard {
    constructor(data) {
        this.data = data;
    }

    render() {
        const container = document.getElementById('view-container');
        const activityMetrics = this.calculateActivityMetrics();
        const heatmapData = this.generateHeatmap();
        const userEngagement = this.calculateUserEngagement();
        const peakTimes = this.calculatePeakTimes();

        container.innerHTML = `
            <div class="dashboard-view">
                <div class="dashboard-header">
                    <h2>🔥 Activity Dashboard</h2>
                    <p class="dashboard-subtitle">Track engagement patterns and identify hot/cold topics</p>
                </div>

                <div class="dashboard-grid">
                    <!-- Key Activity Metrics -->
                    <div class="dashboard-section">
                        <h3 class="section-title">Activity Overview</h3>
                        <div class="metrics-grid">
                            <div class="metric-card">
                                <div class="metric-value ${activityMetrics.activeTopics > 10 ? 'metric-hot' : ''}">${activityMetrics.activeTopics}</div>
                                <div class="metric-label">Active Topics (7 days)</div>
                            </div>
                            <div class="metric-card">
                                <div class="metric-value metric-cold">${activityMetrics.staleTopics}</div>
                                <div class="metric-label">Stale Topics (30+ days)</div>
                            </div>
                            <div class="metric-card">
                                <div class="metric-value">${activityMetrics.avgResponseTime}</div>
                                <div class="metric-label">Avg Response Time</div>
                            </div>
                            <div class="metric-card">
                                <div class="metric-value">${activityMetrics.totalExchangesToday}</div>
                                <div class="metric-label">Exchanges Today</div>
                            </div>
                        </div>
                    </div>

                    <!-- Topic Heat Map -->
                    <div class="dashboard-section full-width">
                        <h3 class="section-title">🌡️ Topic Heat Map (Last Activity)</h3>
                        <p class="dashboard-description">Red = stale (30+ days), Orange = cooling (14-29), Yellow = warm (7-13), Green = hot (0-6 days)</p>
                        <div class="heatmap-grid">
                            ${heatmapData.map(item => `
                                <div class="heatmap-cell ${item.temperatureClass}"
                                     onclick="window.app.openTopicDetailModal('${item.topic.id}')"
                                     title="${escapeHtml(item.topic.title)} - ${item.daysAgo} days ago">
                                    <div class="heatmap-cell-inner">
                                        <div class="heatmap-temp">${item.emoji}</div>
                                        <div class="heatmap-title">${escapeHtml(item.topic.title.substring(0, 30))}${item.topic.title.length > 30 ? '...' : ''}</div>
                                        <div class="heatmap-days">${item.daysAgo}d ago</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- User Engagement Matrix -->
                    <div class="dashboard-section">
                        <h3 class="section-title">👤 Engagement by Category</h3>
                        <div class="engagement-list">
                            ${Object.entries(userEngagement).map(([category, data]) => `
                                <div class="engagement-item">
                                    <div class="engagement-header">
                                        <span class="engagement-category">${category}</span>
                                        <span class="engagement-score ${this.getEngagementClass(data.score)}">${data.score}% engaged</span>
                                    </div>
                                    <div class="engagement-bar">
                                        <div class="engagement-bar-fill ${this.getEngagementClass(data.score)}"
                                             style="width: ${data.score}%"></div>
                                    </div>
                                    <div class="engagement-details">
                                        ${data.activeTopics} active • ${data.totalTopics} total • Last: ${formatRelativeTime(data.lastActivity)}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Peak Activity Times -->
                    <div class="dashboard-section">
                        <h3 class="section-title">⏰ Activity Timeline</h3>
                        <div class="activity-timeline">
                            ${peakTimes.map(period => `
                                <div class="timeline-period">
                                    <div class="timeline-period-label">${period.label}</div>
                                    <div class="timeline-period-bar">
                                        <div class="timeline-period-fill" style="width: ${period.percentage}%; background: ${period.color}"></div>
                                    </div>
                                    <div class="timeline-period-count">${period.count} topics</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Response Rate Trends -->
                    <div class="dashboard-section">
                        <h3 class="section-title">📊 Engagement Trends</h3>
                        <div class="trend-stats">
                            <div class="trend-item">
                                <div class="trend-label">Follow-up Rate</div>
                                <div class="trend-value trend-up">73%</div>
                                <div class="trend-change">+5% from last week</div>
                            </div>
                            <div class="trend-item">
                                <div class="trend-label">Avg Exchanges per Topic</div>
                                <div class="trend-value">${(this.data.topics.reduce((sum, t) => sum + t.exchanges.length, 0) / this.data.topics.length).toFixed(1)}</div>
                                <div class="trend-change">Consistent</div>
                            </div>
                            <div class="trend-item">
                                <div class="trend-label">Resolution Velocity</div>
                                <div class="trend-value trend-down">5.2 days</div>
                                <div class="trend-change">+1.3 days (slower)</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    calculateActivityMetrics() {
        const now = Date.now();
        const dayMs = 24 * 60 * 60 * 1000;

        const activeTopics = this.data.topics.filter(t => {
            const daysSince = (now - new Date(t.updated).getTime()) / dayMs;
            return daysSince <= 7;
        }).length;

        const staleTopics = this.data.topics.filter(t => {
            const daysSince = (now - new Date(t.updated).getTime()) / dayMs;
            return daysSince > 30;
        }).length;

        // Simulate today's exchanges (in real app, would filter by date)
        const totalExchangesToday = Math.floor(Math.random() * 15) + 5;

        return {
            activeTopics,
            staleTopics,
            avgResponseTime: '2.3 hours',
            totalExchangesToday
        };
    }

    generateHeatmap() {
        const now = Date.now();
        const dayMs = 24 * 60 * 60 * 1000;

        return this.data.topics.slice(0, 20).map(topic => {
            const daysAgo = Math.floor((now - new Date(topic.updated).getTime()) / dayMs);

            let temperatureClass, emoji;
            if (daysAgo <= 6) {
                temperatureClass = 'heat-hot';
                emoji = '🔥';
            } else if (daysAgo <= 13) {
                temperatureClass = 'heat-warm';
                emoji = '☀️';
            } else if (daysAgo <= 29) {
                temperatureClass = 'heat-cooling';
                emoji = '🌤️';
            } else {
                temperatureClass = 'heat-cold';
                emoji = '❄️';
            }

            return {
                topic,
                daysAgo,
                temperatureClass,
                emoji
            };
        });
    }

    calculateUserEngagement() {
        const categories = {};
        const now = Date.now();
        const dayMs = 24 * 60 * 60 * 1000;

        this.data.topics.forEach(topic => {
            const cat = topic.category || 'uncategorized';
            if (!categories[cat]) {
                categories[cat] = {
                    totalTopics: 0,
                    activeTopics: 0,
                    lastActivity: topic.updated
                };
            }
            categories[cat].totalTopics++;

            const daysSince = (now - new Date(topic.updated).getTime()) / dayMs;
            if (daysSince <= 30) {
                categories[cat].activeTopics++;
            }

            if (new Date(topic.updated) > new Date(categories[cat].lastActivity)) {
                categories[cat].lastActivity = topic.updated;
            }
        });

        // Calculate engagement scores
        Object.keys(categories).forEach(cat => {
            const data = categories[cat];
            data.score = Math.round((data.activeTopics / data.totalTopics) * 100);
        });

        return categories;
    }

    calculatePeakTimes() {
        const periods = [
            { label: 'Last 7 days', days: 7, color: '#10b981' },
            { label: '8-14 days ago', days: 14, color: '#f59e0b' },
            { label: '15-30 days ago', days: 30, color: '#ef4444' },
            { label: '30+ days ago', days: 999, color: '#6b7280' }
        ];

        const now = Date.now();
        const dayMs = 24 * 60 * 60 * 1000;

        return periods.map((period, idx) => {
            const prevDays = idx === 0 ? 0 : periods[idx - 1].days;
            const count = this.data.topics.filter(t => {
                const daysSince = (now - new Date(t.updated).getTime()) / dayMs;
                return daysSince > prevDays && daysSince <= period.days;
            }).length;

            const percentage = (count / this.data.topics.length) * 100;

            return {
                ...period,
                count,
                percentage
            };
        });
    }

    getEngagementClass(score) {
        if (score >= 70) return 'engagement-high';
        if (score >= 40) return 'engagement-medium';
        return 'engagement-low';
    }
}

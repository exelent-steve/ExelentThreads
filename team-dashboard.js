// Team Performance Dashboard - WHO is using AI, HOW MUCH, HOW EFFECTIVE

class TeamDashboard {
    constructor(data) {
        this.data = data;
        this.currentTab = 'individual'; // individual, department, organization
    }

    render() {
        const container = document.getElementById('view-container');

        container.innerHTML = `
            <div class="dashboard-view">
                <div class="dashboard-header">
                    <h2>👥 Team Performance Dashboard</h2>
                    <p class="dashboard-subtitle">Track who's using AI, how actively, and how effectively across your organization</p>
                </div>

                <!-- Tab Navigation -->
                <div class="dashboard-tabs">
                    <button class="dashboard-tab ${this.currentTab === 'individual' ? 'active' : ''}" data-tab="individual">
                        👤 Individual
                    </button>
                    <button class="dashboard-tab ${this.currentTab === 'department' ? 'active' : ''}" data-tab="department">
                        🏢 Department
                    </button>
                    <button class="dashboard-tab ${this.currentTab === 'organization' ? 'active' : ''}" data-tab="organization">
                        🌐 Organization
                    </button>
                </div>

                <div id="team-tab-content" class="dashboard-tab-content">
                    ${this.renderTabContent()}
                </div>
            </div>
        `;

        // Attach tab click handlers
        const tabs = container.querySelectorAll('.dashboard-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.currentTab = e.target.dataset.tab;
                this.render();
            });
        });
    }

    renderTabContent() {
        switch (this.currentTab) {
            case 'individual':
                return this.renderIndividualView();
            case 'department':
                return this.renderDepartmentView();
            case 'organization':
                return this.renderOrganizationView();
            default:
                return this.renderIndividualView();
        }
    }

    renderIndividualView() {
        const individuals = this.getIndividualMetrics();

        return `
            <div class="dashboard-grid">
                <!-- Activity Heatmap -->
                <div class="dashboard-section full-width">
                    <h3 class="section-title">🔥 AI Activity Heatmap - Who's Using AI Most?</h3>
                    <p class="dashboard-description">Size = number of topics, Color = resolution rate</p>
                    <div class="team-heatmap">
                        ${individuals.map(person => `
                            <div class="team-heatmap-cell ${this.getActivityClass(person.activityScore)}"
                                 style="flex-basis: ${this.getHeatmapSize(person.topicsCount)}%"
                                 title="${person.name}: ${person.topicsCount} topics, ${person.resolutionRate}% resolved">
                                <div class="heatmap-cell-name">${person.initials}</div>
                                <div class="heatmap-cell-stats">
                                    <div>${person.topicsCount}</div>
                                    <div class="heatmap-cell-rate">${person.resolutionRate}%</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Individual Performance Table -->
                <div class="dashboard-section full-width">
                    <h3 class="section-title">📊 Individual Performance Metrics</h3>
                    <div class="performance-table-container">
                        <table class="performance-table">
                            <thead>
                                <tr>
                                    <th>Team Member</th>
                                    <th>Department</th>
                                    <th>Topics Created</th>
                                    <th>Active Days %</th>
                                    <th>Resolution Rate</th>
                                    <th>Avg Time to Resolve</th>
                                    <th>Last Active</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${individuals.map(person => `
                                    <tr class="performance-row">
                                        <td>
                                            <div class="person-cell">
                                                <div class="person-avatar">${person.initials}</div>
                                                <div class="person-info">
                                                    <div class="person-name">${person.name}</div>
                                                    <div class="person-role">${person.role}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>${person.department}</td>
                                        <td><strong>${person.topicsCount}</strong></td>
                                        <td>
                                            <div class="activity-bar-container">
                                                <div class="activity-bar" style="width: ${person.activeDaysPercent}%; background: ${this.getActivityColor(person.activeDaysPercent)}"></div>
                                                <span class="activity-bar-label">${person.activeDaysPercent}%</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span class="badge ${this.getResolutionBadgeClass(person.resolutionRate)}">${person.resolutionRate}%</span>
                                        </td>
                                        <td>${person.avgResolveTime}</td>
                                        <td class="text-secondary">${formatRelativeTime(person.lastActive)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Top Performers -->
                <div class="dashboard-section">
                    <h3 class="section-title">🏆 Top Performers This Month</h3>
                    <div class="top-performers-list">
                        ${this.getTopPerformers(individuals).map((person, idx) => `
                            <div class="top-performer-item">
                                <div class="performer-rank">#${idx + 1}</div>
                                <div class="performer-avatar">${person.initials}</div>
                                <div class="performer-info">
                                    <div class="performer-name">${person.name}</div>
                                    <div class="performer-stats">${person.topicsCount} topics • ${person.resolutionRate}% resolved</div>
                                </div>
                                <div class="performer-badge ${idx === 0 ? 'badge-gold' : idx === 1 ? 'badge-silver' : 'badge-bronze'}">
                                    ${idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Needs Attention -->
                <div class="dashboard-section">
                    <h3 class="section-title">⚠️ Needs Attention</h3>
                    <p class="dashboard-description">Team members who may need support or aren't engaging with AI</p>
                    <div class="attention-list">
                        ${this.getNeedsAttention(individuals).map(person => `
                            <div class="attention-item">
                                <div class="attention-avatar">${person.initials}</div>
                                <div class="attention-content">
                                    <div class="attention-name">${person.name}</div>
                                    <div class="attention-reason">${person.attentionReason}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderDepartmentView() {
        const departments = this.getDepartmentMetrics();

        return `
            <div class="dashboard-grid">
                <!-- Department Comparison -->
                <div class="dashboard-section full-width">
                    <h3 class="section-title">🏢 Department AI Adoption & Effectiveness</h3>
                    <div class="dept-comparison">
                        ${departments.map(dept => `
                            <div class="dept-card">
                                <div class="dept-header">
                                    <h4>${dept.name}</h4>
                                    <span class="dept-size">${dept.memberCount} members</span>
                                </div>
                                <div class="dept-metrics">
                                    <div class="dept-metric">
                                        <div class="dept-metric-label">Adoption Rate</div>
                                        <div class="dept-metric-value ${this.getAdoptionClass(dept.adoptionRate)}">${dept.adoptionRate}%</div>
                                        <div class="dept-metric-bar">
                                            <div class="dept-metric-bar-fill" style="width: ${dept.adoptionRate}%; background: ${this.getAdoptionColor(dept.adoptionRate)}"></div>
                                        </div>
                                    </div>
                                    <div class="dept-metric">
                                        <div class="dept-metric-label">Topics per Person</div>
                                        <div class="dept-metric-value">${dept.topicsPerPerson}</div>
                                    </div>
                                    <div class="dept-metric">
                                        <div class="dept-metric-label">Resolution Rate</div>
                                        <div class="dept-metric-value">${dept.resolutionRate}%</div>
                                    </div>
                                    <div class="dept-metric">
                                        <div class="dept-metric-label">Active Days/Week</div>
                                        <div class="dept-metric-value">${dept.activeDaysPerWeek}</div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Department Leaderboard -->
                <div class="dashboard-section">
                    <h3 class="section-title">📊 Department Rankings</h3>
                    ${this.renderDepartmentLeaderboard(departments)}
                </div>

                <!-- Cross-Department Collaboration -->
                <div class="dashboard-section">
                    <h3 class="section-title">🤝 Cross-Department Collaboration</h3>
                    <p class="dashboard-description">Topics with related discussions across departments</p>
                    <div class="collab-stats-grid">
                        <div class="collab-stat-card">
                            <div class="collab-stat-value">24</div>
                            <div class="collab-stat-label">Cross-Dept Topics</div>
                        </div>
                        <div class="collab-stat-card">
                            <div class="collab-stat-value">3.2</div>
                            <div class="collab-stat-label">Avg Depts per Topic</div>
                        </div>
                        <div class="collab-stat-card">
                            <div class="collab-stat-value">67%</div>
                            <div class="collab-stat-label">Collaboration Rate</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderOrganizationView() {
        const orgMetrics = this.getOrganizationMetrics();

        return `
            <div class="dashboard-grid">
                <!-- Org-Wide KPIs -->
                <div class="dashboard-section full-width">
                    <h3 class="section-title">🌐 Organization-Wide AI Performance</h3>
                    <div class="org-kpis">
                        <div class="org-kpi-card">
                            <div class="org-kpi-icon">👥</div>
                            <div class="org-kpi-content">
                                <div class="org-kpi-value">${orgMetrics.totalUsers}</div>
                                <div class="org-kpi-label">Total Users</div>
                                <div class="org-kpi-trend trend-up">+12% from last month</div>
                            </div>
                        </div>
                        <div class="org-kpi-card">
                            <div class="org-kpi-icon">✅</div>
                            <div class="org-kpi-content">
                                <div class="org-kpi-value">${orgMetrics.adoptionRate}%</div>
                                <div class="org-kpi-label">AI Adoption Rate</div>
                                <div class="org-kpi-trend trend-up">+8% from last month</div>
                            </div>
                        </div>
                        <div class="org-kpi-card">
                            <div class="org-kpi-icon">📈</div>
                            <div class="org-kpi-content">
                                <div class="org-kpi-value">${orgMetrics.avgActiveDays}%</div>
                                <div class="org-kpi-label">Avg Active Days</div>
                                <div class="org-kpi-trend">Consistent</div>
                            </div>
                        </div>
                        <div class="org-kpi-card">
                            <div class="org-kpi-icon">🎯</div>
                            <div class="org-kpi-content">
                                <div class="org-kpi-value">${orgMetrics.resolutionRate}%</div>
                                <div class="org-kpi-label">Resolution Rate</div>
                                <div class="org-kpi-trend trend-down">-3% (needs attention)</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Growth Trends -->
                <div class="dashboard-section full-width">
                    <h3 class="section-title">📊 Growth & Engagement Trends</h3>
                    <p class="dashboard-description">Simulated trend data - would show actual charts in production</p>
                    <div class="trend-summary">
                        <div class="trend-item">
                            <span class="trend-icon">📈</span>
                            <span class="trend-text">Topics created: <strong>+45%</strong> increase over last quarter</span>
                        </div>
                        <div class="trend-item">
                            <span class="trend-icon">👥</span>
                            <span class="trend-text">Active users: <strong>+22%</strong> growth month-over-month</span>
                        </div>
                        <div class="trend-item">
                            <span class="trend-icon">⏱️</span>
                            <span class="trend-text">Avg resolution time: <strong>5.2 days</strong> (up from 3.9 days)</span>
                        </div>
                        <div class="trend-item">
                            <span class="trend-icon">🔥</span>
                            <span class="trend-text">Most active day: <strong>Tuesday</strong> (avg 12.3 topics)</span>
                        </div>
                    </div>
                </div>

                <!-- ROI Metrics -->
                <div class="dashboard-section">
                    <h3 class="section-title">💰 Estimated ROI & Impact</h3>
                    <div class="roi-metrics">
                        <div class="roi-item">
                            <div class="roi-label">Time Saved (Est.)</div>
                            <div class="roi-value">420 hours/month</div>
                            <div class="roi-detail">Based on avg 30min per resolved topic</div>
                        </div>
                        <div class="roi-item">
                            <div class="roi-label">Cost Savings (Est.)</div>
                            <div class="roi-value">$42,000/month</div>
                            <div class="roi-detail">At $100/hour average cost</div>
                        </div>
                        <div class="roi-item">
                            <div class="roi-label">Decisions Documented</div>
                            <div class="roi-value">${this.data.topics.length} topics</div>
                            <div class="roi-detail">Institutional knowledge captured</div>
                        </div>
                    </div>
                </div>

                <!-- Recommendations -->
                <div class="dashboard-section">
                    <h3 class="section-title">💡 Recommendations</h3>
                    <div class="recommendations-list">
                        <div class="recommendation-item recommendation-warning">
                            <div class="recommendation-icon">⚠️</div>
                            <div class="recommendation-content">
                                <div class="recommendation-title">Resolution rate declining</div>
                                <div class="recommendation-description">Consider training sessions or reviewing support resources</div>
                            </div>
                        </div>
                        <div class="recommendation-item recommendation-success">
                            <div class="recommendation-icon">✅</div>
                            <div class="recommendation-content">
                                <div class="recommendation-title">Strong adoption in Engineering</div>
                                <div class="recommendation-description">Showcase Engineering's usage patterns to other departments</div>
                            </div>
                        </div>
                        <div class="recommendation-item recommendation-info">
                            <div class="recommendation-icon">💡</div>
                            <div class="recommendation-content">
                                <div class="recommendation-title">Low adoption in Sales</div>
                                <div class="recommendation-description">Schedule demos and identify use cases relevant to Sales workflow</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Helper methods for generating mock data
    getIndividualMetrics() {
        // Simulated individual metrics
        return [
            { name: 'Sarah Chen', initials: 'SC', role: 'Senior Engineer', department: 'Engineering', topicsCount: 23, activeDaysPercent: 85, resolutionRate: 91, avgResolveTime: '3.2 days', lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), activityScore: 92 },
            { name: 'Mike Johnson', initials: 'MJ', role: 'Product Manager', department: 'Product', topicsCount: 18, activeDaysPercent: 78, resolutionRate: 83, avgResolveTime: '4.1 days', lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), activityScore: 81 },
            { name: 'Emily Rodriguez', initials: 'ER', role: 'Designer', department: 'Design', topicsCount: 15, activeDaysPercent: 72, resolutionRate: 87, avgResolveTime: '3.8 days', lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), activityScore: 80 },
            { name: 'David Kim', initials: 'DK', role: 'Engineering Manager', department: 'Engineering', topicsCount: 12, activeDaysPercent: 65, resolutionRate: 75, avgResolveTime: '5.5 days', lastActive: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), activityScore: 70 },
            { name: 'Lisa Wang', initials: 'LW', role: 'Data Scientist', department: 'Data', topicsCount: 11, activeDaysPercent: 58, resolutionRate: 82, avgResolveTime: '4.2 days', lastActive: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), activityScore: 70 },
            { name: 'James Taylor', initials: 'JT', role: 'Sales Engineer', department: 'Sales', topicsCount: 8, activeDaysPercent: 45, resolutionRate: 62, avgResolveTime: '7.1 days', lastActive: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), activityScore: 54 },
            { name: 'Anna Kowalski', initials: 'AK', role: 'Marketing Manager', department: 'Marketing', topicsCount: 5, activeDaysPercent: 32, resolutionRate: 60, avgResolveTime: '8.2 days', lastActive: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), activityScore: 46 },
            { name: 'Tom Anderson', initials: 'TA', role: 'DevOps', department: 'Engineering', topicsCount: 7, activeDaysPercent: 48, resolutionRate: 71, avgResolveTime: '5.8 days', lastActive: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), activityScore: 60 }
        ].sort((a, b) => b.activityScore - a.activityScore);
    }

    getDepartmentMetrics() {
        return [
            { name: 'Engineering', memberCount: 45, adoptionRate: 82, topicsPerPerson: 4.2, resolutionRate: 78, activeDaysPerWeek: 4.1 },
            { name: 'Product', memberCount: 12, adoptionRate: 75, topicsPerPerson: 3.8, resolutionRate: 85, activeDaysPerWeek: 3.9 },
            { name: 'Design', memberCount: 8, adoptionRate: 71, topicsPerPerson: 3.2, resolutionRate: 82, activeDaysPerWeek: 3.5 },
            { name: 'Data', memberCount: 15, adoptionRate: 68, topicsPerPerson: 2.9, resolutionRate: 80, activeDaysPerWeek: 3.3 },
            { name: 'Sales', memberCount: 22, adoptionRate: 45, topicsPerPerson: 1.8, resolutionRate: 62, activeDaysPerWeek: 2.1 },
            { name: 'Marketing', memberCount: 10, adoptionRate: 38, topicsPerPerson: 1.4, resolutionRate: 58, activeDaysPerWeek: 1.9 }
        ];
    }

    getOrganizationMetrics() {
        return {
            totalUsers: 112,
            adoptionRate: 68,
            avgActiveDays: 62,
            resolutionRate: 74,
            totalTopics: this.data.topics.length,
            avgResolutionTime: '5.2 days'
        };
    }

    getTopPerformers(individuals) {
        return individuals.slice(0, 3);
    }

    getNeedsAttention(individuals) {
        return individuals.filter(p => p.activeDaysPercent < 50 || p.resolutionRate < 65)
            .map(p => ({
                ...p,
                attentionReason: p.activeDaysPercent < 50 ? `Low activity (${p.activeDaysPercent}% active days)` : `Low resolution rate (${p.resolutionRate}%)`
            }))
            .slice(0, 3);
    }

    renderDepartmentLeaderboard(departments) {
        const sorted = [...departments].sort((a, b) => b.adoptionRate - a.adoptionRate);
        return `
            <div class="dept-leaderboard">
                ${sorted.map((dept, idx) => `
                    <div class="dept-leaderboard-item">
                        <div class="dept-leaderboard-rank">#${idx + 1}</div>
                        <div class="dept-leaderboard-name">${dept.name}</div>
                        <div class="dept-leaderboard-score">${dept.adoptionRate}%</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    getActivityClass(score) {
        if (score >= 80) return 'heatmap-very-active';
        if (score >= 60) return 'heatmap-active';
        if (score >= 40) return 'heatmap-moderate';
        return 'heatmap-low';
    }

    getHeatmapSize(count) {
        return Math.max(8, Math.min(20, count * 0.8));
    }

    getActivityColor(percent) {
        if (percent >= 70) return '#10b981';
        if (percent >= 50) return '#f59e0b';
        return '#ef4444';
    }

    getResolutionBadgeClass(rate) {
        if (rate >= 80) return 'badge-success';
        if (rate >= 60) return 'badge-warning';
        return 'badge-danger';
    }

    getAdoptionClass(rate) {
        if (rate >= 70) return 'metric-success';
        if (rate >= 50) return 'metric-warning';
        return 'metric-danger';
    }

    getAdoptionColor(rate) {
        if (rate >= 70) return '#10b981';
        if (rate >= 50) return '#f59e0b';
        return '#ef4444';
    }
}

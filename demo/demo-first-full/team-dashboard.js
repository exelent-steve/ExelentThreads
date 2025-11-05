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

                <!-- Analytics & Patterns (Individual) -->
                <div class="dashboard-section full-width">
                    <h3 class="section-title">🧠 Analytics & Patterns (Individual Level)</h3>
                    <div class="analytics-patterns-grid">
                        <div class="pattern-card">
                            <div class="pattern-icon">⚡</div>
                            <div class="pattern-content">
                                <div class="pattern-title">Peak Performance Days</div>
                                <div class="pattern-description">Engineers are most active on <strong>Tuesday & Wednesday</strong> (avg 4.2 topics/day)</div>
                            </div>
                        </div>
                        <div class="pattern-card">
                            <div class="pattern-icon">🎯</div>
                            <div class="pattern-content">
                                <div class="pattern-title">Resolution Patterns</div>
                                <div class="pattern-description">Individual resolution rates improve <strong>+15%</strong> after 3rd topic</div>
                            </div>
                        </div>
                        <div class="pattern-card">
                            <div class="pattern-icon">📈</div>
                            <div class="pattern-content">
                                <div class="pattern-title">Learning Curve</div>
                                <div class="pattern-description">Time to resolve decreases <strong>40%</strong> between first and 10th topic</div>
                            </div>
                        </div>
                        <div class="pattern-card">
                            <div class="pattern-icon">🔄</div>
                            <div class="pattern-content">
                                <div class="pattern-title">Engagement Consistency</div>
                                <div class="pattern-description">Top performers average <strong>82%</strong> active days vs 45% for low users</div>
                            </div>
                        </div>
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
                <!-- Department Performance Table -->
                <div class="dashboard-section full-width">
                    <h3 class="section-title">📊 Department Performance Metrics</h3>
                    <div class="performance-table-container">
                        <table class="performance-table">
                            <thead>
                                <tr>
                                    <th>Department</th>
                                    <th>Team Size</th>
                                    <th>Adoption Rate</th>
                                    <th>Topics per Person</th>
                                    <th>Resolution Rate</th>
                                    <th>Active Days/Week</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${departments.map(dept => `
                                    <tr class="performance-row">
                                        <td>
                                            <div class="dept-cell">
                                                <div class="dept-name-text"><strong>${dept.name}</strong></div>
                                            </div>
                                        </td>
                                        <td>${dept.memberCount} members</td>
                                        <td>
                                            <div class="activity-bar-container">
                                                <div class="activity-bar" style="width: ${dept.adoptionRate}%; background: ${this.getAdoptionColor(dept.adoptionRate)}"></div>
                                                <span class="activity-bar-label">${dept.adoptionRate}%</span>
                                            </div>
                                        </td>
                                        <td><strong>${dept.topicsPerPerson}</strong></td>
                                        <td>
                                            <span class="badge ${this.getResolutionBadgeClass(dept.resolutionRate)}">${dept.resolutionRate}%</span>
                                        </td>
                                        <td>${dept.activeDaysPerWeek} days</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Department Rankings (Visual) -->
                <div class="dashboard-section full-width">
                    <h3 class="section-title">🏆 Department Rankings by Adoption Rate</h3>
                    ${this.renderDepartmentRankingsVisual(departments)}
                </div>

                <!-- Analytics & Patterns (Department) -->
                <div class="dashboard-section full-width">
                    <h3 class="section-title">🧠 Analytics & Patterns (Department Level)</h3>
                    <div class="analytics-patterns-grid">
                        <div class="pattern-card">
                            <div class="pattern-icon">🚀</div>
                            <div class="pattern-content">
                                <div class="pattern-title">Engineering Leading Adoption</div>
                                <div class="pattern-description">Engineering dept has <strong>82%</strong> adoption, 2x higher than org average</div>
                            </div>
                        </div>
                        <div class="pattern-card">
                            <div class="pattern-icon">📉</div>
                            <div class="pattern-content">
                                <div class="pattern-title">Sales Needs Support</div>
                                <div class="pattern-description">Sales & Marketing below 50% adoption - suggest targeted training</div>
                            </div>
                        </div>
                        <div class="pattern-card">
                            <div class="pattern-icon">⚡</div>
                            <div class="pattern-content">
                                <div class="pattern-title">Product Excellence</div>
                                <div class="pattern-description">Product dept has highest resolution rate at <strong>85%</strong></div>
                            </div>
                        </div>
                        <div class="pattern-card">
                            <div class="pattern-icon">🤝</div>
                            <div class="pattern-content">
                                <div class="pattern-title">Cross-Dept Collaboration</div>
                                <div class="pattern-description">Engineering + Product collaboration yields <strong>+18%</strong> faster resolutions</div>
                            </div>
                        </div>
                    </div>
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
        const orgBreakdown = this.getOrganizationBreakdown();

        return `
            <div class="dashboard-grid">
                <!-- Organization Performance Table -->
                <div class="dashboard-section full-width">
                    <h3 class="section-title">📊 Organization Performance Metrics</h3>
                    <div class="performance-table-container">
                        <table class="performance-table">
                            <thead>
                                <tr>
                                    <th>Metric Category</th>
                                    <th>Current Value</th>
                                    <th>Target</th>
                                    <th>Progress</th>
                                    <th>Trend</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${orgBreakdown.map(metric => `
                                    <tr class="performance-row">
                                        <td><strong>${metric.category}</strong></td>
                                        <td>${metric.current}</td>
                                        <td>${metric.target}</td>
                                        <td>
                                            <div class="activity-bar-container">
                                                <div class="activity-bar" style="width: ${metric.progress}%; background: ${this.getActivityColor(metric.progress)}"></div>
                                                <span class="activity-bar-label">${metric.progress}%</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span class="badge ${metric.trendClass}">${metric.trend}</span>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Analytics & Patterns (Organization) -->
                <div class="dashboard-section full-width">
                    <h3 class="section-title">🧠 Analytics & Patterns (Organization Level)</h3>
                    <div class="analytics-patterns-grid">
                        <div class="pattern-card">
                            <div class="pattern-icon">📈</div>
                            <div class="pattern-content">
                                <div class="pattern-title">Rapid Adoption Growth</div>
                                <div class="pattern-description">Org adoption increased <strong>+22%</strong> in 90 days - exceeding targets</div>
                            </div>
                        </div>
                        <div class="pattern-card">
                            <div class="pattern-icon">💡</div>
                            <div class="pattern-content">
                                <div class="pattern-title">Knowledge Capture Success</div>
                                <div class="pattern-description"><strong>${this.data.topics.length} decisions</strong> documented - building institutional knowledge base</div>
                            </div>
                        </div>
                        <div class="pattern-card">
                            <div class="pattern-icon">⚡</div>
                            <div class="pattern-content">
                                <div class="pattern-title">ROI Validation</div>
                                <div class="pattern-description">Estimated <strong>$42K/month</strong> in time savings across organization</div>
                            </div>
                        </div>
                        <div class="pattern-card">
                            <div class="pattern-icon">🎯</div>
                            <div class="pattern-content">
                                <div class="pattern-title">Department Disparity</div>
                                <div class="pattern-description">44% gap between highest (Eng 82%) and lowest (Marketing 38%) adoption</div>
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

    renderDepartmentRankingsVisual(departments) {
        const sorted = [...departments].sort((a, b) => b.adoptionRate - a.adoptionRate);
        const maxRate = Math.max(...sorted.map(d => d.adoptionRate));

        return `
            <div class="dept-rankings-visual">
                ${sorted.map((dept, idx) => `
                    <div class="dept-ranking-row">
                        <div class="dept-ranking-position">
                            <span class="dept-ranking-number ${idx < 3 ? 'top-three' : ''}">#${idx + 1}</span>
                        </div>
                        <div class="dept-ranking-info">
                            <div class="dept-ranking-name">${dept.name}</div>
                            <div class="dept-ranking-details">${dept.memberCount} members • ${dept.topicsPerPerson} topics/person</div>
                        </div>
                        <div class="dept-ranking-chart">
                            <div class="dept-ranking-bar-bg">
                                <div class="dept-ranking-bar" style="width: ${(dept.adoptionRate / maxRate) * 100}%; background: ${this.getAdoptionColor(dept.adoptionRate)}">
                                </div>
                            </div>
                            <div class="dept-ranking-value">${dept.adoptionRate}%</div>
                        </div>
                        ${idx < 3 ? `<div class="dept-ranking-medal">${idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</div>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    getOrganizationBreakdown() {
        return [
            {
                category: 'User Adoption',
                current: '112 users',
                target: '150 users',
                progress: 75,
                trend: '+12% MoM',
                trendClass: 'badge-success'
            },
            {
                category: 'Adoption Rate',
                current: '68%',
                target: '80%',
                progress: 85,
                trend: '+8% MoM',
                trendClass: 'badge-success'
            },
            {
                category: 'Active Days %',
                current: '62%',
                target: '75%',
                progress: 83,
                trend: 'Stable',
                trendClass: 'badge-secondary'
            },
            {
                category: 'Resolution Rate',
                current: '74%',
                target: '85%',
                progress: 87,
                trend: '-3% MoM',
                trendClass: 'badge-warning'
            },
            {
                category: 'Avg Resolution Time',
                current: '5.2 days',
                target: '4.0 days',
                progress: 77,
                trend: '+1.3 days',
                trendClass: 'badge-warning'
            },
            {
                category: 'Topics per User',
                current: '3.1',
                target: '4.5',
                progress: 69,
                trend: '+15% QoQ',
                trendClass: 'badge-success'
            }
        ];
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

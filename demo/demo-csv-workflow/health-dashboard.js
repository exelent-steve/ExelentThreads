// Topic Health Dashboard - Risk Alerts and Health Scores

class HealthDashboard {
    constructor(data) {
        this.data = data;
    }

    render() {
        const container = document.getElementById('view-container');
        const healthMetrics = this.calculateHealthMetrics();
        const atRiskTopics = this.identifyAtRiskTopics();
        const healthDistribution = this.getHealthDistribution();
        const blockedTopics = this.findBlockedTopics();

        container.innerHTML = `
            <div class="dashboard-view">
                <div class="dashboard-header">
                    <h2>🏥 Topic Health Dashboard</h2>
                    <p class="dashboard-subtitle">Monitor topic health and identify risks before they become problems</p>
                </div>

                <div class="dashboard-grid">
                    <!-- Health Overview -->
                    <div class="dashboard-section">
                        <h3 class="section-title">Health Overview</h3>
                        <div class="metrics-grid">
                            <div class="metric-card">
                                <div class="metric-value metric-success">${healthMetrics.healthy}</div>
                                <div class="metric-label">Healthy Topics</div>
                            </div>
                            <div class="metric-card">
                                <div class="metric-value metric-warning">${healthMetrics.atRisk}</div>
                                <div class="metric-label">At Risk</div>
                            </div>
                            <div class="metric-card">
                                <div class="metric-value metric-danger">${healthMetrics.critical}</div>
                                <div class="metric-label">Critical</div>
                            </div>
                            <div class="metric-card">
                                <div class="metric-value">${healthMetrics.avgHealthScore}</div>
                                <div class="metric-label">Avg Health Score</div>
                            </div>
                        </div>
                    </div>

                    <!-- At-Risk Topics -->
                    <div class="dashboard-section full-width">
                        <h3 class="section-title">⚠️ Topics Requiring Attention</h3>
                        <div class="risk-list">
                            ${atRiskTopics.map(item => `
                                <div class="risk-card risk-${item.riskLevel}"
                                     onclick="window.app.openTopicDetailModal('${item.topic.id}')">
                                    <div class="risk-header">
                                        <div class="risk-title-section">
                                            <span class="risk-icon">${item.icon}</span>
                                            <span class="risk-topic-title">${escapeHtml(item.topic.title)}</span>
                                        </div>
                                        <div class="risk-score-badge risk-${item.riskLevel}">
                                            Health: ${item.healthScore}/100
                                        </div>
                                    </div>
                                    <div class="risk-reasons">
                                        ${item.risks.map(risk => `
                                            <div class="risk-reason">
                                                <span class="risk-reason-icon">${risk.icon}</span>
                                                <span>${risk.reason}</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                    <div class="risk-meta">
                                        ${item.topic.category} • ${item.topic.exchanges.length} exchanges • Updated ${formatRelativeTime(item.topic.updated)}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Health Score Distribution -->
                    <div class="dashboard-section">
                        <h3 class="section-title">📊 Health Score Distribution</h3>
                        <div class="health-distribution">
                            ${healthDistribution.map(bucket => `
                                <div class="distribution-bar">
                                    <div class="distribution-label">${bucket.label}</div>
                                    <div class="distribution-bar-container">
                                        <div class="distribution-bar-fill ${bucket.class}"
                                             style="width: ${bucket.percentage}%"></div>
                                    </div>
                                    <div class="distribution-count">${bucket.count}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Blocked/Stalled Topics -->
                    <div class="dashboard-section">
                        <h3 class="section-title">🚧 Blocked Topics</h3>
                        <p class="dashboard-description">Topics that haven't progressed despite recent activity</p>
                        <div class="blocked-list">
                            ${blockedTopics.map(item => `
                                <div class="blocked-item"
                                     onclick="window.app.openTopicDetailModal('${item.topic.id}')">
                                    <div class="blocked-title">${escapeHtml(item.topic.title)}</div>
                                    <div class="blocked-reason">${item.blockReason}</div>
                                    <div class="blocked-duration">Stalled for ${item.stalledDays} days</div>
                                </div>
                            `).join('')}
                            ${blockedTopics.length === 0 ? `
                                <div class="empty-state">
                                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">✅</div>
                                    <div>No blocked topics! Everything is progressing well.</div>
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    <!-- Health Factors -->
                    <div class="dashboard-section">
                        <h3 class="section-title">🔍 Health Factors</h3>
                        <p class="dashboard-description">What contributes to topic health scores</p>
                        <div class="health-factors">
                            <div class="factor-item factor-positive">
                                <span class="factor-icon">✓</span>
                                <div class="factor-content">
                                    <div class="factor-label">Positive Signals</div>
                                    <ul class="factor-list">
                                        <li>Recent activity (last 7 days)</li>
                                        <li>Status = resolved or in-progress</li>
                                        <li>Multiple exchanges (engagement)</li>
                                        <li>No contradictions detected</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="factor-item factor-negative">
                                <span class="factor-icon">✕</span>
                                <div class="factor-content">
                                    <div class="factor-label">Risk Signals</div>
                                    <ul class="factor-list">
                                        <li>Stale (30+ days inactive)</li>
                                        <li>Has contradictions</li>
                                        <li>Status = open (not progressing)</li>
                                        <li>Low exchange count (<3)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Contradiction Detection -->
                    <div class="dashboard-section">
                        <h3 class="section-title">⚡ Contradiction Alerts</h3>
                        ${this.renderContradictions()}
                    </div>
                </div>
            </div>
        `;
    }

    calculateHealthMetrics() {
        const scores = this.data.topics.map(t => this.calculateHealthScore(t));
        const healthy = scores.filter(s => s >= 70).length;
        const atRisk = scores.filter(s => s >= 40 && s < 70).length;
        const critical = scores.filter(s => s < 40).length;
        const avgHealthScore = Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);

        return {
            healthy,
            atRisk,
            critical,
            avgHealthScore
        };
    }

    calculateHealthScore(topic) {
        let score = 50; // Base score

        // Recent activity (+30)
        const daysSince = (Date.now() - new Date(topic.updated).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSince <= 7) score += 30;
        else if (daysSince <= 14) score += 20;
        else if (daysSince <= 30) score += 10;
        else score -= 20; // Penalty for stale

        // Status (+20 or -10)
        if (topic.status === 'resolved') score += 20;
        else if (topic.status === 'in-progress') score += 10;
        else if (topic.status === 'open') score -= 10;

        // Exchange depth (+15)
        if (topic.exchanges.length >= 5) score += 15;
        else if (topic.exchanges.length >= 3) score += 10;
        else score -= 5;

        // Contradictions (-25)
        if (topic.hasContradiction) score -= 25;

        return Math.max(0, Math.min(100, score));
    }

    identifyAtRiskTopics() {
        const topicsWithScores = this.data.topics.map(topic => ({
            topic,
            healthScore: this.calculateHealthScore(topic),
            risks: this.identifyRisks(topic)
        })).filter(item => item.risks.length > 0);

        // Sort by health score (worst first)
        topicsWithScores.sort((a, b) => a.healthScore - b.healthScore);

        return topicsWithScores.slice(0, 10).map(item => ({
            ...item,
            riskLevel: item.healthScore < 40 ? 'high' : item.healthScore < 70 ? 'medium' : 'low',
            icon: item.healthScore < 40 ? '🔴' : item.healthScore < 70 ? '🟡' : '🟢'
        }));
    }

    identifyRisks(topic) {
        const risks = [];
        const daysSince = (Date.now() - new Date(topic.updated).getTime()) / (1000 * 60 * 60 * 24);

        if (daysSince > 30) {
            risks.push({ icon: '❄️', reason: `Stale: No activity for ${Math.floor(daysSince)} days` });
        }

        if (topic.hasContradiction) {
            risks.push({ icon: '⚠️', reason: 'Contradiction detected with another topic' });
        }

        if (topic.status === 'open' && topic.exchanges.length > 2) {
            risks.push({ icon: '🚧', reason: 'Not progressing despite multiple exchanges' });
        }

        if (topic.exchanges.length < 3 && daysSince > 7) {
            risks.push({ icon: '📉', reason: 'Low engagement - needs more discussion' });
        }

        return risks;
    }

    getHealthDistribution() {
        const buckets = [
            { label: '90-100 (Excellent)', min: 90, max: 100, class: 'health-excellent' },
            { label: '70-89 (Good)', min: 70, max: 89, class: 'health-good' },
            { label: '40-69 (At Risk)', min: 40, max: 69, class: 'health-risk' },
            { label: '0-39 (Critical)', min: 0, max: 39, class: 'health-critical' }
        ];

        return buckets.map(bucket => {
            const count = this.data.topics.filter(t => {
                const score = this.calculateHealthScore(t);
                return score >= bucket.min && score <= bucket.max;
            }).length;

            return {
                ...bucket,
                count,
                percentage: (count / this.data.topics.length) * 100
            };
        });
    }

    findBlockedTopics() {
        const now = Date.now();
        const dayMs = 24 * 60 * 60 * 1000;

        return this.data.topics
            .filter(t => t.status === 'in-progress' || t.status === 'open')
            .map(topic => {
                const stalledDays = Math.floor((now - new Date(topic.updated).getTime()) / dayMs);
                let blockReason = '';

                if (stalledDays > 30 && topic.status === 'in-progress') {
                    blockReason = 'In progress but no updates in 30+ days';
                } else if (topic.exchanges.length >= 5 && topic.status === 'open') {
                    blockReason = 'Multiple exchanges but status still open';
                }

                return blockReason ? { topic, stalledDays, blockReason } : null;
            })
            .filter(Boolean)
            .slice(0, 5);
    }

    renderContradictions() {
        const contradictions = this.data.topics.filter(t => t.hasContradiction);

        if (contradictions.length === 0) {
            return `
                <div class="empty-state">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">✅</div>
                    <div>No contradictions detected</div>
                </div>
            `;
        }

        return `
            <div class="contradiction-list">
                ${contradictions.map(topic => `
                    <div class="contradiction-item"
                         onclick="window.app.openTopicDetailModal('${topic.id}')">
                        <div class="contradiction-header">
                            <span class="contradiction-icon">⚡</span>
                            <span>${escapeHtml(topic.title)}</span>
                        </div>
                        <div class="contradiction-description">
                            Conflicts with previous decisions about ${topic.contradictsWith ? escapeHtml(findTopicById(this.data.topics, topic.contradictsWith)?.title || 'another topic') : 'a related topic'}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

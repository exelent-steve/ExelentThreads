// Timeline View Component - Creative Masonry Collage

class TimelineView {
    constructor(data) {
        this.data = data;
        this.shapes = ['circle', 'square', 'hexagon'];
    }

    render() {
        const container = document.getElementById('view-container');
        const timelineTopics = this.prepareTimelineData();

        container.innerHTML = `
            <div class="timeline-view-collage">
                <div class="timeline-header">
                    <h2>📅 Timeline Cascade</h2>
                    <p class="timeline-subtitle">A cascading journey through your ${this.data.topics.length} conversations</p>
                </div>

                <div class="timeline-input-area">
                    <div class="input-group">
                        <input type="text" class="message-input" id="timeline-message-input" placeholder="Add a comment or ask a question...">
                        <button class="btn btn-primary" id="timeline-send-btn">Add Comment</button>
                    </div>
                    <div class="smart-suggestions-panel hidden" id="timeline-smart-suggestions"></div>
                </div>

                <div class="timeline-cascade-container">
                    ${this.renderCascadingColumns(timelineTopics)}
                </div>

                <div class="timeline-legend">
                    <div class="legend-item">
                        <span class="legend-dot" style="background: var(--status-resolved);"></span>
                        <span>Resolved</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-dot" style="background: var(--status-progress);"></span>
                        <span>In Progress</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-dot" style="background: var(--status-open);"></span>
                        <span>Open</span>
                    </div>
                    <div class="legend-item">
                        <span style="font-size: 1.25rem;">🔥</span>
                        <span>High Priority</span>
                    </div>
                    <div class="legend-item">
                        <span style="font-size: 1.25rem;">⚠️</span>
                        <span>Has Conflict</span>
                    </div>
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    renderCascadingColumns(topics) {
        const itemsPerColumn = 4;
        const columns = [];

        for (let i = 0; i < topics.length; i += itemsPerColumn) {
            const columnTopics = topics.slice(i, i + itemsPerColumn);
            const columnIndex = Math.floor(i / itemsPerColumn);
            columns.push(this.renderColumn(columnTopics, columnIndex, i));
        }

        return columns.join('');
    }

    renderColumn(topics, columnIndex, startIndex) {
        return `
            <div class="cascade-column" style="--column-index: ${columnIndex};">
                ${topics.map((topic, i) => this.renderCascadeItem(topic, startIndex + i)).join('')}
            </div>
        `;
    }

    prepareTimelineData() {
        // Sort by update time (most recent first for visual prominence)
        return [...this.data.topics].sort((a, b) =>
            new Date(b.updated) - new Date(a.updated)
        );
    }

    renderCascadeItem(topic, index) {
        const design = this.getDesignVariant(index);
        const color = this.getStatusColor(topic.status);
        const icon = this.getStatusIcon(topic);
        const daysSinceUpdate = Math.floor((Date.now() - new Date(topic.updated).getTime()) / (1000 * 60 * 60 * 24));

        return `
            <div class="cascade-item ${design.shape} ${design.style}"
                 style="--item-color: ${color}; --item-bg: ${design.background};"
                 onclick="window.app.openTopicDetailModal('${topic.id}')"
                 title="${escapeHtml(topic.title)}">
                <div class="cascade-item-inner">
                    <div class="cascade-badges">
                        ${topic.priority === 'high' ? '<span class="cascade-badge">🔥</span>' : ''}
                        ${topic.hasContradiction ? '<span class="cascade-badge">⚠️</span>' : ''}
                        ${topic.relatedTopics && topic.relatedTopics.length > 0 ? '<span class="cascade-badge">🔗</span>' : ''}
                    </div>
                    <div class="cascade-icon">${icon}</div>
                    <div class="cascade-title">${this.truncateTitle(topic.title, 50)}</div>
                    <div class="cascade-meta">
                        <span>${topic.exchanges.length} 💬</span>
                        <span>${daysSinceUpdate === 0 ? 'Today' : daysSinceUpdate === 1 ? '1d' : `${daysSinceUpdate}d`}</span>
                    </div>
                </div>
            </div>
        `;
    }

    getDesignVariant(index) {
        const variants = [
            { shape: 'rounded-rect', style: 'solid-border', background: 'white' },
            { shape: 'circle', style: 'double-border', background: 'linear-gradient(135deg, #fff 0%, #f9fafb 100%)' },
            { shape: 'rounded-rect', style: 'dashed-border', background: 'white' },
            { shape: 'soft-square', style: 'shadow-heavy', background: 'white' },
            { shape: 'rounded-rect', style: 'gradient-border', background: 'white' },
            { shape: 'pill', style: 'solid-border', background: 'linear-gradient(135deg, #fefefe 0%, #fafafa 100%)' },
            { shape: 'hexagon', style: 'solid-border', background: 'white' },
            { shape: 'rounded-rect', style: 'dotted-border', background: 'white' },
            { shape: 'soft-square', style: 'double-border', background: 'white' },
            { shape: 'circle', style: 'solid-border', background: 'white' }
        ];
        return variants[index % variants.length];
    }

    getStatusColor(status) {
        const colors = {
            'resolved': '#10b981',
            'in-progress': '#f59e0b',
            'open': '#ef4444',
            'archived': '#6b7280'
        };
        return colors[status] || '#6b7280';
    }

    getStatusIcon(topic) {
        if (topic.status === 'resolved') return '✅';
        if (topic.status === 'in-progress') return '🔄';
        if (topic.status === 'open') return '📝';
        return '📦';
    }

    truncateTitle(title, maxLength) {
        if (title.length > maxLength) {
            return title.substring(0, maxLength - 3) + '...';
        }
        return title;
    }

    attachEventListeners() {
        // Message input with smart suggestions
        const messageInput = document.getElementById('timeline-message-input');
        const sendBtn = document.getElementById('timeline-send-btn');

        if (messageInput && sendBtn) {
            const handleSend = () => {
                const message = messageInput.value.trim();
                if (message) {
                    showToast('💬 Comment added! In the real app, this would add to a selected topic.');
                    messageInput.value = '';
                    this.hideSmartSuggestions();
                }
            };

            sendBtn.addEventListener('click', handleSend);
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handleSend();
            });

            // Smart Suggestions on input
            messageInput.addEventListener('input', (e) => {
                const text = e.target.value.trim();
                if (text.length > 3) {
                    this.showSmartSuggestions(text);
                } else {
                    this.hideSmartSuggestions();
                }
            });
        }
    }

    showSmartSuggestions(text) {
        const relatedTopics = this.findRelatedTopics(text);
        const panel = document.getElementById('timeline-smart-suggestions');

        if (!panel || relatedTopics.length === 0) {
            this.hideSmartSuggestions();
            return;
        }

        panel.classList.remove('hidden');
        panel.innerHTML = `
            <div class="suggestions-header">💡 Related Topics from Your History</div>
            ${relatedTopics.map(topic => `
                <div class="suggestion-item">
                    <div class="suggestion-title">
                        <span class="suggestion-similarity">${topic.similarity}% similar</span>
                        ${escapeHtml(topic.title)}
                    </div>
                    <div class="suggestion-meta">
                        ${formatRelativeTime(topic.updated)} • ${topic.exchanges.length} exchanges • ${topic.status}
                    </div>
                    <div class="suggestion-actions">
                        <button class="btn-small" onclick="window.app.openTopicDetailModal('${topic.id}')">
                            View Full Discussion
                        </button>
                    </div>
                </div>
            `).join('')}
        `;
    }

    hideSmartSuggestions() {
        const panel = document.getElementById('timeline-smart-suggestions');
        if (panel) {
            panel.classList.add('hidden');
        }
    }

    findRelatedTopics(searchText) {
        const keywords = searchText.toLowerCase().split(' ').filter(w => w.length > 3);
        if (keywords.length === 0) return [];

        const scoredTopics = this.data.topics.map(topic => {
            let score = 0;

            // Check title matches
            keywords.forEach(keyword => {
                if (topic.title.toLowerCase().includes(keyword)) score += 10;
            });

            // Check exchange content matches
            topic.exchanges.forEach(exchange => {
                keywords.forEach(keyword => {
                    if (exchange.content.toLowerCase().includes(keyword)) score += 2;
                });
            });

            // Boost if same category
            if (topic.category && keywords.some(k => topic.category.toLowerCase().includes(k))) {
                score += 5;
            }

            return { ...topic, similarity: Math.min(100, score * 5) };
        });

        return scoredTopics
            .filter(t => t.similarity > 0)
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 3);
    }
}

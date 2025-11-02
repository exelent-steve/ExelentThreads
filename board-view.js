// Board View Component (Kanban) - with expandable cards

class BoardView {
    constructor(data) {
        this.data = data;
        this.expandedCards = new Set(); // Track which cards are expanded
    }

    render() {
        const container = document.getElementById('view-container');
        const grouped = groupTopicsByStatus(this.data.topics);

        container.innerHTML = `
            <div class="board-view-container">
                <div class="board-input-area">
                    <div class="input-group">
                        <input type="text" class="message-input" id="board-message-input" placeholder="Add a comment or ask a question...">
                        <button class="btn btn-primary" id="board-send-btn">Add Comment</button>
                    </div>
                    <div class="smart-suggestions-panel hidden" id="board-smart-suggestions"></div>
                </div>
                <div class="board-view">
                    ${this.renderColumn('open', 'Open', grouped['open'])}
                    ${this.renderColumn('in-progress', 'In Progress', grouped['in-progress'])}
                    ${this.renderColumn('resolved', 'Resolved', grouped['resolved'])}
                    ${this.renderColumn('archived', 'Archived', grouped['archived'])}
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    renderColumn(status, title, topics) {
        return `
            <div class="board-column" data-status="${status}">
                <div class="column-header">
                    <span class="column-title">${title}</span>
                    <span class="column-count">${topics.length}</span>
                </div>
                <div class="column-cards">
                    ${topics.map(topic => this.renderCard(topic)).join('')}
                </div>
            </div>
        `;
    }

    renderCard(topic) {
        return `
            <div class="board-card" data-topic-id="${topic.id}">
                <div class="card-header">
                    <div class="card-title">${escapeHtml(topic.title)}</div>
                    ${topic.relatedTopics && topic.relatedTopics.length > 0 ? '<span class="card-badge">🔗</span>' : ''}
                    ${topic.hasContradiction ? '<span class="card-badge">⚠️</span>' : ''}
                    ${topic.priority === 'high' ? '<span class="card-badge">🔥</span>' : ''}
                </div>
                <div class="card-meta">
                    <span>${topic.exchanges.length} exchanges</span>
                    <span>${formatRelativeTime(topic.updated)}</span>
                </div>
                <div class="card-category">${topic.category}</div>
            </div>
        `;
    }

    renderCardContent(topic) {
        return `
            <div class="card-content">
                ${topic.exchanges.map(exchange => `
                    <div class="card-exchange ${exchange.speaker}">
                        <div class="card-exchange-speaker">
                            ${exchange.speaker === 'user' ? 'You' : 'Claude'}
                        </div>
                        <div class="card-exchange-content">
                            ${escapeHtml(exchange.content)}
                        </div>
                    </div>
                `).join('')}
                <div class="card-comment-input">
                    <input type="text" 
                           class="comment-input" 
                           placeholder="Add comment..." 
                           data-topic-id="${topic.id}">
                    <button class="btn-add-comment" data-topic-id="${topic.id}">Add</button>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        // Card clicks open the detail modal
        document.querySelectorAll('.board-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const topicId = e.currentTarget.dataset.topicId;
                window.app.openTopicDetailModal(topicId);
            });
        });

        // Message input with smart suggestions
        const messageInput = document.getElementById('board-message-input');
        const sendBtn = document.getElementById('board-send-btn');

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
        const panel = document.getElementById('board-smart-suggestions');

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
        const panel = document.getElementById('board-smart-suggestions');
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

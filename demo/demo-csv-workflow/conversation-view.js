// Conversation View Component

class ConversationView {
    constructor(data) {
        this.data = data;
        this.currentTopicId = data.topics[0].id;
        this.sortBy = 'recent';
    }

    render() {
        const container = document.getElementById('view-container');
        container.innerHTML = `
            <div class="conversation-view">
                <div class="conversation-sidebar">
                    <div class="sidebar-header">
                        <select class="sort-select" id="topic-sort">
                            <option value="recent">Recent Activity</option>
                            <option value="alpha">Alphabetical</option>
                            <option value="status">By Status</option>
                            <option value="created">Date Created</option>
                        </select>
                    </div>
                    <div class="topics-list" id="topics-list"></div>
                </div>
                <div class="conversation-main">
                    <div class="conversation-header" id="conversation-header"></div>
                    <div class="conversation-messages" id="conversation-messages"></div>
                    <div class="conversation-input">
                        <div class="input-group">
                            <input type="text" class="message-input" id="message-input" placeholder="Type your message...">
                            <button class="btn btn-primary" id="send-btn">Send</button>
                        </div>
                        <div class="smart-suggestions-panel hidden" id="smart-suggestions"></div>
                    </div>
                </div>
            </div>
        `;

        this.renderSidebar();
        this.renderConversation(this.currentTopicId);
        this.attachEventListeners();
    }

    renderSidebar() {
        const sortedTopics = sortTopics(this.data.topics, this.sortBy);
        const listContainer = document.getElementById('topics-list');
        
        listContainer.innerHTML = sortedTopics.map(topic => `
            <div class="topic-card ${topic.id === this.currentTopicId ? 'active' : ''}"
                 data-topic-id="${topic.id}">
                <div class="topic-card-header">
                    <span class="status-icon" style="color: ${getStatusColor(topic.status)}">
                        ${getStatusIcon(topic.status)}
                    </span>
                    <div class="topic-title">
                        ${topic.relatedTopics && topic.relatedTopics.length > 0 ? '<span class="related-icon">🔗</span> ' : ''}${escapeHtml(topic.title)}
                    </div>
                </div>
                <div class="topic-meta">
                    ${topic.exchanges.length} exchanges • ${formatRelativeTime(topic.updated)}
                    ${topic.hasContradiction ? ' • <span style="color: #f59e0b;">⚠️</span>' : ''}
                </div>
                <div class="topic-badges">
                    <span class="topic-assignee-badge assignee-${topic.assignee.toLowerCase().replace(' ', '-')}">
                        ${topic.assignee === 'Claude' ? '🤖' : topic.assignee === 'Me' ? '👤' : topic.assignee === 'Team' ? '👥' : '❓'} ${topic.assignee}
                    </span>
                    <span class="topic-responder-badge responder-${topic.lastResponder}">
                        ${topic.lastResponder === 'user' ? '⬅️ You replied last' : topic.lastResponder === 'claude' ? '➡️ Claude replied last' : '💬 No responses yet'}
                    </span>
                </div>
            </div>
        `).join('');
    }

    renderConversation(topicId) {
        const topic = findTopicById(this.data.topics, topicId);
        if (!topic) return;

        // Render header
        const headerContainer = document.getElementById('conversation-header');
        headerContainer.innerHTML = `
            ${topic.hasContradiction ? this.renderContradictionWarning(topic) : ''}
            ${topic.relatedTopics && topic.relatedTopics.length > 0 ? this.renderRelatedTopics(topic) : ''}
            <div class="conversation-title">${escapeHtml(topic.title)}</div>
            <div class="conversation-meta">
                <span class="status-badge ${topic.status}">${topic.status.replace('-', ' ')}</span>
                <span style="color: var(--text-secondary); font-size: 0.875rem;">
                    Updated ${formatRelativeTime(topic.updated)}
                </span>
            </div>
        `;

        // Render messages
        const messagesContainer = document.getElementById('conversation-messages');
        messagesContainer.innerHTML = topic.exchanges.map(exchange => `
            <div class="message ${exchange.speaker}">
                <div class="message-header">
                    <span class="message-speaker ${exchange.speaker}">
                        ${exchange.speaker === 'user' ? 'You' : 'Claude'}
                    </span>
                    <span class="message-time">${formatFullTime(exchange.timestamp)}</span>
                </div>
                <div class="message-content">${escapeHtml(exchange.content)}</div>
            </div>
        `).join('');

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    attachEventListeners() {
        // Topic card clicks
        document.querySelectorAll('.topic-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const topicId = e.currentTarget.dataset.topicId;
                this.switchTopic(topicId);
            });
        });

        // Sort change
        const sortSelect = document.getElementById('topic-sort');
        if (sortSelect) {
            sortSelect.value = this.sortBy;
            sortSelect.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.renderSidebar();
                this.attachEventListeners(); // Re-attach after render
            });
        }

        // Send message
        const sendBtn = document.getElementById('send-btn');
        const messageInput = document.getElementById('message-input');

        if (sendBtn && messageInput) {
            const handleSend = () => {
                const message = messageInput.value.trim();
                if (message) {
                    this.handleSendMessage(message);
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

            // Hide suggestions when clicking outside
            document.addEventListener('click', (e) => {
                const panel = document.getElementById('smart-suggestions');
                const input = document.getElementById('message-input');
                if (panel && !panel.contains(e.target) && e.target !== input) {
                    this.hideSmartSuggestions();
                }
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT') return;

            const currentIndex = this.data.topics.findIndex(t => t.id === this.currentTopicId);

            if (e.key === 'ArrowDown' && currentIndex < this.data.topics.length - 1) {
                e.preventDefault();
                this.switchTopic(this.data.topics[currentIndex + 1].id);
            } else if (e.key === 'ArrowUp' && currentIndex > 0) {
                e.preventDefault();
                this.switchTopic(this.data.topics[currentIndex - 1].id);
            }
        });
    }

    switchTopic(topicId) {
        this.currentTopicId = topicId;
        this.renderSidebar();
        this.renderConversation(topicId);
        
        // Re-attach listeners after rendering
        this.attachTopicListeners();
    }

    attachTopicListeners() {
        document.querySelectorAll('.topic-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const topicId = e.currentTarget.dataset.topicId;
                this.switchTopic(topicId);
            });
        });
    }

    handleSendMessage(message) {
        const topic = findTopicById(this.data.topics, this.currentTopicId);
        if (!topic) return;

        // Add user message
        const userExchange = {
            id: `ex-${Date.now()}`,
            speaker: 'user',
            timestamp: new Date().toISOString(),
            content: message
        };
        topic.exchanges.push(userExchange);

        // Re-render to show user message
        this.renderConversation(this.currentTopicId);

        // Simulate Claude typing
        setTimeout(() => {
            const claudeExchange = {
                id: `ex-${Date.now()}`,
                speaker: 'claude',
                timestamp: new Date().toISOString(),
                content: '✅ Great point! [This is a demo response. In the real app, Claude would analyze your message and provide a thoughtful response.]'
            };
            topic.exchanges.push(claudeExchange);
            topic.updated = new Date().toISOString();

            // Re-render everything
            this.renderSidebar();
            this.renderConversation(this.currentTopicId);
            this.attachTopicListeners();

            showToast('Response generated');
        }, 1500);
    }

    renderContradictionWarning(topic) {
        if (!topic.contradictsWith) return '';

        const contradictingTopic = findTopicById(this.data.topics, topic.contradictsWith);
        if (!contradictingTopic) return '';

        return `
            <div class="contradiction-warning">
                <div class="contradiction-icon">⚠️</div>
                <div class="contradiction-content">
                    <div class="contradiction-title">Potential Conflict Detected</div>
                    <div class="contradiction-text">
                        You're discussing GraphQL, but in <strong>"${escapeHtml(contradictingTopic.title)}"</strong>
                        (${formatRelativeTime(contradictingTopic.updated)}), you chose REST for: team familiarity, caching, simplicity.
                    </div>
                    <div class="contradiction-actions">
                        <button class="btn-small" onclick="window.app.views.conversation.viewTopic('${contradictingTopic.id}')">
                            View that discussion
                        </button>
                        <button class="btn-small">Mark as intentional change</button>
                    </div>
                </div>
            </div>
        `;
    }

    renderRelatedTopics(topic) {
        if (!topic.relatedTopics || topic.relatedTopics.length === 0) return '';

        return `
            <div class="related-topics-bar">
                <span class="related-topics-label">🔗 Related:</span>
                ${topic.relatedTopics.slice(0, 3).map(relatedId => {
                    const relatedTopic = findTopicById(this.data.topics, relatedId);
                    return relatedTopic ?
                        `<button class="related-topic-link" onclick="window.app.views.conversation.viewTopic('${relatedId}')">
                            ${escapeHtml(relatedTopic.title)}
                        </button>` : '';
                }).join('')}
                ${topic.relatedTopics.length > 3 ? `<span class="related-more">+${topic.relatedTopics.length - 3} more</span>` : ''}
            </div>
        `;
    }

    findRelatedTopics(searchText) {
        const keywords = searchText.toLowerCase().split(' ').filter(w => w.length > 3);
        if (keywords.length === 0) return [];

        // Score each topic based on keyword matches
        const scoredTopics = this.data.topics
            .filter(t => t.id !== this.currentTopicId && t.status === 'resolved') // Only resolved topics
            .map(topic => {
                let score = 0;
                const topicText = `${topic.title} ${topic.exchanges.map(e => e.content).join(' ')}`.toLowerCase();

                keywords.forEach(keyword => {
                    const matches = (topicText.match(new RegExp(keyword, 'g')) || []).length;
                    score += matches * 10;
                });

                // Boost score for category match
                if (topic.category) {
                    const currentTopic = findTopicById(this.data.topics, this.currentTopicId);
                    if (currentTopic && topic.category === currentTopic.category) {
                        score += 15;
                    }
                }

                return { topic, score };
            })
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);

        return scoredTopics.map(item => ({
            ...item.topic,
            similarity: Math.min(95, Math.round((item.score / keywords.length) * 3))
        }));
    }

    showSmartSuggestions(text) {
        const relatedTopics = this.findRelatedTopics(text);
        const panel = document.getElementById('smart-suggestions');

        if (!panel || relatedTopics.length === 0) {
            this.hideSmartSuggestions();
            return;
        }

        panel.classList.remove('hidden');
        panel.innerHTML = `
            <div class="suggestions-header">💡 Related Topics from Your History</div>
            ${relatedTopics.map(topic => `
                <div class="suggestion-item">
                    <div class="suggestion-confidence-badge ${this.getConfidenceClass(topic.similarity)}">
                        <span class="confidence-icon">${this.getConfidenceIcon(topic.similarity)}</span>
                        <span class="confidence-text">${this.getConfidenceText(topic.similarity)}</span>
                        <span class="confidence-score">${topic.similarity}% match</span>
                    </div>
                    <div class="suggestion-title">
                        ${escapeHtml(topic.title)}
                    </div>
                    <div class="suggestion-meta">
                        ${formatRelativeTime(topic.updated)} • ${topic.exchanges.length} exchanges • ${topic.status}
                    </div>
                    <div class="suggestion-decision">
                        ${this.extractDecision(topic)}
                    </div>
                    <div class="suggestion-actions">
                        <button class="btn-small" onclick="window.app.views.conversation.viewTopic('${topic.id}')">
                            View Full Discussion
                        </button>
                        <button class="btn-small btn-primary-small" onclick="window.app.views.conversation.copyDecision('${topic.id}')">
                            Copy Solution
                        </button>
                    </div>
                </div>
            `).join('')}
        `;
    }

    getConfidenceClass(similarity) {
        if (similarity >= 70) return 'confidence-high';
        if (similarity >= 40) return 'confidence-medium';
        return 'confidence-low';
    }

    getConfidenceIcon(similarity) {
        if (similarity >= 70) return '✓';
        if (similarity >= 40) return '○';
        return '△';
    }

    getConfidenceText(similarity) {
        if (similarity >= 70) return 'High confidence';
        if (similarity >= 40) return 'Medium confidence';
        return 'Low confidence - might not be relevant';
    }

    hideSmartSuggestions() {
        const panel = document.getElementById('smart-suggestions');
        if (panel) {
            panel.classList.add('hidden');
        }
    }

    extractDecision(topic) {
        // Find the last message from Claude that contains a decision indicator
        const decisionMessage = [...topic.exchanges]
            .reverse()
            .find(ex => ex.speaker === 'claude' && (ex.content.includes('✅') || ex.content.includes('DECISION')));

        if (decisionMessage) {
            // Extract first 150 characters
            let decision = decisionMessage.content.replace(/✅/g, '').trim();
            if (decision.length > 150) {
                decision = decision.substring(0, 150) + '...';
            }
            return `<strong>Decision:</strong> ${escapeHtml(decision)}`;
        }

        return '<em>See full discussion for details</em>';
    }

    viewTopic(topicId) {
        this.switchTopic(topicId);
        this.hideSmartSuggestions();
        showToast('Switched to related topic');
    }

    copyDecision(topicId) {
        const topic = findTopicById(this.data.topics, topicId);
        if (!topic) return;

        const decisionMessage = [...topic.exchanges]
            .reverse()
            .find(ex => ex.speaker === 'claude' && (ex.content.includes('✅') || ex.content.includes('DECISION')));

        if (decisionMessage) {
            const messageInput = document.getElementById('message-input');
            if (messageInput) {
                messageInput.value = `Based on Topic "${topic.title}": ${decisionMessage.content}`;
                this.hideSmartSuggestions();
                showToast('✓ Solution copied to message');
            }
        }
    }
}

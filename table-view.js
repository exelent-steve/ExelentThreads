// Table View Component - CSV Style with all exchanges visible

class TableView {
    constructor(data) {
        this.data = data;
        this.filters = {
            status: 'all',
            category: 'all'
        };
    }

    render() {
        const container = document.getElementById('view-container');
        container.innerHTML = `
            <div class="table-view">
                <div class="table-input-area">
                    <div class="input-group">
                        <input type="text" class="message-input" id="table-message-input" placeholder="Add a comment or ask a question...">
                        <button class="btn btn-primary" id="table-send-btn">Add Comment</button>
                    </div>
                    <div class="smart-suggestions-panel hidden" id="table-smart-suggestions"></div>
                </div>
                <div class="table-controls">
                    <label style="display: flex; align-items: center; gap: 0.5rem;">
                        Status:
                        <select class="filter-select" id="status-filter">
                            <option value="all">All</option>
                            <option value="open">Open</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="archived">Archived</option>
                        </select>
                    </label>
                    <label style="display: flex; align-items: center; gap: 0.5rem;">
                        Category:
                        <select class="filter-select" id="category-filter">
                            <option value="all">All</option>
                            <option value="architecture">Architecture</option>
                            <option value="features">Features</option>
                            <option value="UX">UX</option>
                        </select>
                    </label>
                </div>
                <div class="table-container">
                    <div id="csv-table"></div>
                </div>
            </div>
        `;

        this.renderTable();
        this.attachEventListeners();
    }

    renderTable() {
        const filtered = filterTopics(this.data.topics, this.filters);
        
        // Find max number of exchanges across all topics
        const maxExchanges = Math.max(...filtered.map(t => t.exchanges.length));
        
        const tableContainer = document.getElementById('csv-table');
        
        // Build header
        let headerHtml = `
            <div class="csv-table-wrapper">
                <table class="csv-table">
                    <thead>
                        <tr>
                            <th class="csv-cell csv-header sticky-col" style="min-width: 60px;">Status</th>
                            <th class="csv-cell csv-header sticky-col2" style="min-width: 250px;">Issue</th>
        `;
        
        // Add column headers for exchanges (User 1, Claude 1, User 2, Claude 2, etc.)
        for (let i = 0; i < maxExchanges; i++) {
            const exchange = filtered[0]?.exchanges[i];
            const speaker = exchange?.speaker || (i % 2 === 0 ? 'user' : 'claude');
            const label = speaker === 'user' ? 'User' : 'Claude';
            const exchangeNum = Math.floor(i / 2) + 1;
            headerHtml += `<th class="csv-cell csv-header" style="min-width: 300px;">${label} ${exchangeNum}</th>`;
        }
        
        // Add comment column
        headerHtml += `<th class="csv-cell csv-header" style="min-width: 300px;">Add Comment</th>`;

        // Add details column
        headerHtml += `<th class="csv-cell csv-header" style="min-width: 120px;">Details</th>`;

        headerHtml += `
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        // Build rows
        filtered.forEach(topic => {
            let rowHtml = `
                <tr>
                    <td class="csv-cell sticky-col" style="text-align: center;">
                        <span style="color: ${getStatusColor(topic.status)}; font-size: 1.125rem;">
                            ${getStatusIcon(topic.status)}
                        </span>
                    </td>
                    <td class="csv-cell sticky-col2" style="font-weight: 500;">
                        ${escapeHtml(topic.title)}
                    </td>
            `;
            
            // Add each exchange
            for (let i = 0; i < maxExchanges; i++) {
                const exchange = topic.exchanges[i];
                if (exchange) {
                    const bgColor = exchange.speaker === 'user' ? '#f0f9ff' : '#faf5ff';
                    rowHtml += `
                        <td class="csv-cell" style="background: ${bgColor}; vertical-align: top;">
                            ${escapeHtml(exchange.content)}
                        </td>
                    `;
                } else {
                    rowHtml += `<td class="csv-cell" style="background: #fafafa;"></td>`;
                }
            }
            
            // Add comment input cell
            rowHtml += `
                <td class="csv-cell" style="background: white; vertical-align: top;">
                    <div class="comment-input-wrapper">
                        <input type="text"
                               class="comment-input"
                               placeholder="Add comment..."
                               data-topic-id="${topic.id}">
                        <button class="btn-add-comment" data-topic-id="${topic.id}">Add</button>
                    </div>
                </td>
            `;

            // Add view details button cell
            rowHtml += `
                <td class="csv-cell" style="background: white; vertical-align: top; text-align: center;">
                    <button class="btn-view-details btn btn-secondary"
                            data-topic-id="${topic.id}"
                            style="font-size: 0.875rem; padding: 0.5rem 0.75rem; white-space: nowrap;">
                        👁️ View Details
                    </button>
                </td>
            `;

            rowHtml += `</tr>`;
            headerHtml += rowHtml;
        });
        
        headerHtml += `
                    </tbody>
                </table>
            </div>
        `;
        
        tableContainer.innerHTML = headerHtml;
    }

    attachEventListeners() {
        // Filter changes
        const statusFilter = document.getElementById('status-filter');
        const categoryFilter = document.getElementById('category-filter');
        
        if (statusFilter) {
            statusFilter.value = this.filters.status;
            statusFilter.addEventListener('change', (e) => {
                this.filters.status = e.target.value;
                this.renderTable();
            });
        }
        
        if (categoryFilter) {
            categoryFilter.value = this.filters.category;
            categoryFilter.addEventListener('change', (e) => {
                this.filters.category = e.target.value;
                this.renderTable();
            });
        }

        // Comment button clicks
        document.querySelectorAll('.btn-add-comment').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const topicId = e.target.dataset.topicId;
                const input = document.querySelector(`.comment-input[data-topic-id="${topicId}"]`);
                if (input && input.value.trim()) {
                    this.addComment(topicId, input.value.trim());
                    input.value = '';
                }
            });
        });

        // Enter key in comment inputs
        document.querySelectorAll('.comment-input').forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && input.value.trim()) {
                    const topicId = e.target.dataset.topicId;
                    this.addComment(topicId, input.value.trim());
                    input.value = '';
                }
            });
        });

        // View Details button clicks
        document.querySelectorAll('.btn-view-details').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const topicId = e.target.dataset.topicId;
                window.app.openTopicDetailModal(topicId);
            });
        });

        // Message input with smart suggestions
        const messageInput = document.getElementById('table-message-input');
        const sendBtn = document.getElementById('table-send-btn');

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
        const panel = document.getElementById('table-smart-suggestions');

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
        const panel = document.getElementById('table-smart-suggestions');
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

    addComment(topicId, comment) {
        const topic = findTopicById(this.data.topics, topicId);
        if (topic) {
            topic.exchanges.push({
                id: `ex-${Date.now()}`,
                speaker: 'user',
                timestamp: new Date().toISOString(),
                content: comment
            });
            topic.updated = new Date().toISOString();
            
            showToast('Comment added! Will be sent with next AI sync.');
            this.renderTable();
        }
    }
}

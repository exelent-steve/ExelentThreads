// Main Application Controller

class App {
    constructor() {
        this.data = conversationData;
        this.currentView = 'conversation';
        this.views = {};

        this.init();
    }

    getCurrentProject() {
        return this.data.projects.find(p => p.id === this.data.currentProjectId) || this.data.projects[0];
    }

    getCurrentProjectData() {
        const project = this.getCurrentProject();
        return {
            ...this.data,
            topics: project.topics,
            currentProject: project
        };
    }

    init() {
        // Initialize project selector
        this.renderProjectSelector();

        // Initialize all view classes (conversation views get current project data only)
        const projectData = this.getCurrentProjectData();
        this.views.conversation = new ConversationView(projectData);
        this.views.table = new TableView(projectData);
        this.views.board = new BoardView(projectData);
        this.views.timeline = new TimelineView(projectData);

        // Initialize analytics and dashboard views (get ALL data across projects)
        this.views.analytics = new AnalyticsView(this.getAllTopicsData());
        this.views.activity = new ActivityDashboard(this.getAllTopicsData());
        this.views.health = new HealthDashboard(this.getAllTopicsData());
        this.views.topics = new TopicsDashboard(this.getAllTopicsData());
        this.views.team = new TeamDashboard(this.getAllTopicsData());

        // Attach global event listeners
        this.attachEventListeners();

        // Render initial view
        this.switchView('conversation');
    }

    getAllTopicsData() {
        // Flatten all topics from all projects for dashboards
        const allTopics = this.data.projects.flatMap(p => p.topics);
        return {
            ...this.data,
            topics: allTopics
        };
    }

    attachEventListeners() {
        // Sidebar navigation (updated for sidebar layout)
        document.querySelectorAll('.sidebar-nav-item[data-view]').forEach(item => {
            item.addEventListener('click', (e) => {
                const viewName = e.currentTarget.dataset.view;
                this.switchView(viewName);
            });
        });
        
        // Get AI Insights button
        const aiInsightsBtn = document.getElementById('ai-insights-btn');
        if (aiInsightsBtn) {
            aiInsightsBtn.addEventListener('click', () => {
                this.handleAIInsights(aiInsightsBtn);
            });
        }
        
        // Ask AI button
        const askAiBtn = document.getElementById('ask-ai-btn');
        if (askAiBtn) {
            askAiBtn.addEventListener('click', () => {
                this.openAskAiModal();
            });
        }

        // Export button
        const exportBtn = document.getElementById('export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.handleExport();
            });
        }

        // New topic button (sidebar)
        const newTopicBtn = document.getElementById('new-topic-btn');
        if (newTopicBtn) {
            newTopicBtn.addEventListener('click', () => {
                this.handleNewTopic();
            });
        }

        // Header action buttons
        const askAiBtnHeader = document.getElementById('ask-ai-btn-header');
        if (askAiBtnHeader) {
            askAiBtnHeader.addEventListener('click', () => {
                this.openAskAiModal();
            });
        }

        const askAiQuestionBtn = document.getElementById('ask-ai-question-btn');
        if (askAiQuestionBtn) {
            askAiQuestionBtn.addEventListener('click', () => {
                this.openAskAiQuestionModal();
            });
        }

        const sendToAiBtn = document.getElementById('send-to-ai-btn');
        if (sendToAiBtn) {
            sendToAiBtn.addEventListener('click', () => {
                this.handleSendToAI();
            });
        }

        const newTopicBtnHeader = document.getElementById('new-topic-btn-header');
        if (newTopicBtnHeader) {
            newTopicBtnHeader.addEventListener('click', () => {
                this.handleNewTopic();
            });
        }

        const exportBtnHeader = document.getElementById('export-btn-header');
        if (exportBtnHeader) {
            exportBtnHeader.addEventListener('click', () => {
                this.handleExport();
            });
        }

        // Manage Projects button
        const manageProjectsBtn = document.getElementById('manage-projects-btn');
        if (manageProjectsBtn) {
            manageProjectsBtn.addEventListener('click', () => {
                this.openManageProjectsModal();
            });
        }

        // Settings button
        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.openSettingsModal();
            });
        }

        // Export Selection Modal
        const exportSelectionModal = document.getElementById('export-selection-modal');
        const exportSelectionClose = document.getElementById('export-selection-close');
        const exportCsvBtn = document.getElementById('export-csv-btn');
        const exportConfirmBtn = document.getElementById('export-confirm-btn');
        const exportCancelBtn = document.getElementById('export-cancel-btn');

        // Open export selection modal
        if (exportCsvBtn) {
            exportCsvBtn.addEventListener('click', () => {
                this.openExportSelectionModal();
            });
        }

        // Close export selection modal
        if (exportSelectionClose) {
            exportSelectionClose.addEventListener('click', () => {
                this.closeModal(exportSelectionModal);
            });
        }

        if (exportCancelBtn) {
            exportCancelBtn.addEventListener('click', () => {
                this.closeModal(exportSelectionModal);
            });
        }

        // Handle export preset selection
        document.querySelectorAll('input[name="export-preset"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const customList = document.getElementById('export-custom-list');
                if (e.target.value === 'custom') {
                    customList.classList.remove('hidden');
                } else {
                    customList.classList.add('hidden');
                }
            });
        });

        // Export confirm
        if (exportConfirmBtn) {
            exportConfirmBtn.addEventListener('click', () => {
                const selectedPreset = document.querySelector('input[name="export-preset"]:checked').value;
                this.handleCsvExport(selectedPreset);
                this.closeModal(exportSelectionModal);
            });
        }

        // Import CSV (demo - just shows toast)
        const importCsvBtn = document.getElementById('import-csv-btn');
        if (importCsvBtn) {
            importCsvBtn.addEventListener('click', () => {
                showToast('CSV Import is simulated in this demo. In production, this would open file picker.', 'info');
            });
        }

        // Global search
        const searchInput = document.getElementById('global-search');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                const query = e.target.value.trim();
                if (query.length > 2) {
                    searchTimeout = setTimeout(() => {
                        this.handleSearch(query);
                    }, 300);
                } else {
                    this.hideSearchModal();
                }
            });
        }

        // Search modal close
        const searchModalClose = document.getElementById('search-modal-close');
        if (searchModalClose) {
            searchModalClose.addEventListener('click', () => {
                this.hideSearchModal();
            });
        }

        // Close modal on backdrop click
        const searchModal = document.getElementById('search-modal');
        if (searchModal) {
            searchModal.addEventListener('click', (e) => {
                if (e.target.classList.contains('search-modal-backdrop') || e.target.classList.contains('search-modal')) {
                    this.hideSearchModal();
                }
            });
        }

        // Help button
        const helpBtn = document.getElementById('help-btn');
        const helpModal = document.getElementById('help-modal');
        const helpModalClose = document.getElementById('help-modal-close');

        if (helpBtn) {
            helpBtn.addEventListener('click', () => {
                helpModal.classList.remove('hidden');
            });
        }

        if (helpModalClose) {
            helpModalClose.addEventListener('click', () => {
                helpModal.classList.add('hidden');
            });
        }

        if (helpModal) {
            helpModal.addEventListener('click', (e) => {
                if (e.target.classList.contains('search-modal-backdrop') || e.target.classList.contains('search-modal')) {
                    helpModal.classList.add('hidden');
                }
            });
        }

        // Topic detail modal close
        const topicModalClose = document.getElementById('topic-modal-close');
        const topicModal = document.getElementById('topic-detail-modal');

        if (topicModalClose) {
            topicModalClose.addEventListener('click', () => {
                this.closeTopicDetailModal();
            });
        }

        if (topicModal) {
            topicModal.addEventListener('click', (e) => {
                if (e.target.classList.contains('topic-modal-backdrop') || e.target.classList.contains('topic-modal')) {
                    this.closeTopicDetailModal();
                }
            });
        }

        // Ask AI modal close
        const askAiModalClose = document.getElementById('ask-ai-modal-close');
        const askAiModal = document.getElementById('ask-ai-modal');

        if (askAiModalClose) {
            askAiModalClose.addEventListener('click', () => {
                this.closeAskAiModal();
            });
        }

        if (askAiModal) {
            askAiModal.addEventListener('click', (e) => {
                if (e.target.classList.contains('search-modal-backdrop') || e.target.classList.contains('search-modal')) {
                    this.closeAskAiModal();
                }
            });
        }

        // Ask AI Question modal close
        const askAiQuestionModalClose = document.getElementById('ask-ai-question-close');
        const askAiQuestionModal = document.getElementById('ask-ai-question-modal');

        if (askAiQuestionModalClose) {
            askAiQuestionModalClose.addEventListener('click', () => {
                this.closeAskAiQuestionModal();
            });
        }

        if (askAiQuestionModal) {
            askAiQuestionModal.addEventListener('click', (e) => {
                if (e.target.classList.contains('search-modal-backdrop') || e.target.classList.contains('search-modal')) {
                    this.closeAskAiQuestionModal();
                }
            });
        }

        // Global Escape key listener for all modals
        const escapeHandler = (e) => {
            if (e.key === 'Escape' || e.keyCode === 27) {
                // Close Ask AI modal
                const askAiModal = document.getElementById('ask-ai-modal');
                if (askAiModal && !askAiModal.classList.contains('hidden')) {
                    this.closeAskAiModal();
                    e.preventDefault();
                    return;
                }

                // Close Ask AI Question modal
                const askAiQuestionModal = document.getElementById('ask-ai-question-modal');
                if (askAiQuestionModal && !askAiQuestionModal.classList.contains('hidden')) {
                    this.closeAskAiQuestionModal();
                    e.preventDefault();
                    return;
                }

                // Close search modal
                const searchModal = document.getElementById('search-modal');
                if (searchModal && !searchModal.classList.contains('hidden')) {
                    this.hideSearchModal();
                    e.preventDefault();
                    return;
                }

                // Close help modal
                const helpModal = document.getElementById('help-modal');
                if (helpModal && !helpModal.classList.contains('hidden')) {
                    helpModal.classList.add('hidden');
                    e.preventDefault();
                    return;
                }

                // Close topic detail modal
                const topicDetailModal = document.getElementById('topic-detail-modal');
                if (topicDetailModal && !topicDetailModal.classList.contains('hidden')) {
                    this.closeTopicDetailModal();
                    e.preventDefault();
                    return;
                }
            }
        };

        document.addEventListener('keydown', escapeHandler);
    }

    switchView(viewName) {
        this.currentView = viewName;

        // Update active sidebar item
        document.querySelectorAll('.sidebar-nav-item[data-view]').forEach(item => {
            item.classList.remove('active');
        });
        const activeItem = document.querySelector(`.sidebar-nav-item[data-view="${viewName}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }

        // Render new view
        const view = this.views[viewName];
        if (view) {
            view.render();
        } else {
            // View not yet implemented (activity, health, team dashboards)
            this.renderPlaceholder(viewName);
        }
    }

    renderPlaceholder(viewName) {
        const container = document.getElementById('view-container');
        const titles = {
            'activity': 'Activity Dashboard',
            'health': 'Topic Health',
            'team': 'Team Performance'
        };
        container.innerHTML = `
            <div style="display: flex; align-items: center; justify-center; height: 100%; color: var(--text-secondary);">
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🚧</div>
                    <h2 style="color: var(--text-primary); margin-bottom: 0.5rem;">${titles[viewName] || viewName}</h2>
                    <p>This dashboard is coming soon!</p>
                </div>
            </div>
        `;
    }

    handleAIInsights(button) {
        // Disable button and show loading state
        button.disabled = true;
        button.style.opacity = '0.5';
        button.style.cursor = 'not-allowed';
        const originalText = button.textContent;
        button.textContent = '⏳ Analyzing...';
        
        // Format all topics and exchanges for AI (across all projects)
        const allTopics = this.data.projects.flatMap(p => p.topics);
        const activeTopics = allTopics.filter(t => t.status !== 'archived');
        
        let aiPayload = {
            totalTopics: activeTopics.length,
            topics: activeTopics.map(topic => ({
                title: topic.title,
                status: topic.status,
                category: topic.category,
                exchanges: topic.exchanges.map(ex => ({
                    speaker: ex.speaker,
                    content: ex.content,
                    timestamp: ex.timestamp
                }))
            }))
        };
        
        console.log('Sending to AI:', JSON.stringify(aiPayload, null, 2));
        
        // Simulate API call delay
        setTimeout(() => {
            // Re-enable button
            button.disabled = false;
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
            button.textContent = originalText;
            
            showToast('✅ AI analysis complete! Check console for data sent.');
        }, 2000);
    }

    handleExport() {
        const csvContent = convertToCSV(this.data);
        downloadFile(csvContent, 'conversations.csv', 'text/csv');
        showToast('✓ Exported to CSV');
    }

    handleNewTopic() {
        showToast('In the real app: You would enter a topic title and start a new conversation');
    }

    handleSendToAI() {
        showToast('📊 Send to AI: Select topics to analyze patterns, summarize, or get recommendations');
    }

    openSettingsModal() {
        showToast('⚙️ Settings: Configure preferences, notifications, integrations (coming soon)');
    }

    handleSearch(query) {
        const results = this.searchTopics(query);
        this.showSearchResults(results, query);
    }

    searchTopics(query) {
        const lowerQuery = query.toLowerCase();
        const results = [];

        // Search across all projects
        const allTopics = this.data.projects.flatMap(p => p.topics);

        allTopics.forEach(topic => {
            let matches = [];

            // Search in title
            if (topic.title.toLowerCase().includes(lowerQuery)) {
                matches.push({
                    type: 'title',
                    text: topic.title,
                    highlight: true
                });
            }

            // Search in exchanges
            topic.exchanges.forEach((exchange, index) => {
                if (exchange.content.toLowerCase().includes(lowerQuery)) {
                    // Extract context around match
                    const idx = exchange.content.toLowerCase().indexOf(lowerQuery);
                    const start = Math.max(0, idx - 50);
                    const end = Math.min(exchange.content.length, idx + query.length + 50);
                    let snippet = exchange.content.substring(start, end);

                    if (start > 0) snippet = '...' + snippet;
                    if (end < exchange.content.length) snippet = snippet + '...';

                    matches.push({
                        type: 'exchange',
                        speaker: exchange.speaker,
                        text: snippet,
                        exchangeIndex: index,
                        highlight: true
                    });
                }
            });

            if (matches.length > 0) {
                results.push({
                    topic: topic,
                    matches: matches
                });
            }
        });

        return results;
    }

    showSearchResults(results, query) {
        const modal = document.getElementById('search-modal');
        const resultsContainer = document.getElementById('search-results');

        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="search-no-results">
                    <div class="search-no-results-icon">🔍</div>
                    <div class="search-no-results-text">No results found for "${escapeHtml(query)}"</div>
                </div>
            `;
        } else {
            resultsContainer.innerHTML = `
                <div class="search-results-header">Found ${results.length} topic(s) matching "${escapeHtml(query)}"</div>
                ${results.map(result => `
                    <div class="search-result-item" onclick="window.app.openTopicFromSearch('${result.topic.id}')">
                        <div class="search-result-header">
                            <div class="search-result-title">${escapeHtml(result.topic.title)}</div>
                            <span class="status-badge ${result.topic.status}">${result.topic.status.replace('-', ' ')}</span>
                        </div>
                        <div class="search-result-meta">
                            ${result.topic.category} • ${result.topic.exchanges.length} exchanges • ${formatRelativeTime(result.topic.updated)}
                        </div>
                        <div class="search-result-matches">
                            ${result.matches.slice(0, 3).map(match => `
                                <div class="search-match">
                                    ${match.type === 'title' ? '<strong>📌 Title:</strong>' : `<strong>${match.speaker === 'user' ? '👤 You' : '🤖 Claude'}:</strong>`}
                                    ${this.highlightQuery(escapeHtml(match.text), query)}
                                </div>
                            `).join('')}
                            ${result.matches.length > 3 ? `<div class="search-more-matches">+${result.matches.length - 3} more matches</div>` : ''}
                        </div>
                    </div>
                `).join('')}
            `;
        }

        modal.classList.remove('hidden');
    }

    highlightQuery(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    hideSearchModal() {
        const modal = document.getElementById('search-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    openTopicFromSearch(topicId) {
        this.hideSearchModal();
        document.getElementById('global-search').value = '';

        // Switch to conversation view and open the topic
        this.switchView('conversation');
        setTimeout(() => {
            if (this.views.conversation) {
                this.views.conversation.switchTopic(topicId);
            }
        }, 100);

        showToast('Switched to topic');
    }

    openTopicFromTimeline(topicId) {
        // Switch to conversation view and open the topic
        this.switchView('conversation');
        setTimeout(() => {
            if (this.views.conversation) {
                this.views.conversation.switchTopic(topicId);
            }
        }, 100);

        showToast('Viewing topic in Conversation view');
    }

    openTopicDetailModal(topicId) {
        const topic = findTopicByIdInProjects(this.data.projects, topicId);
        if (!topic) return;

        const modal = document.getElementById('topic-detail-modal');
        const titleContainer = document.getElementById('topic-modal-title');
        const bodyContainer = document.getElementById('topic-modal-body');

        // Render title with metadata
        titleContainer.innerHTML = `
            <div class="topic-modal-title-text">${escapeHtml(topic.title)}</div>
            <div class="topic-modal-meta">
                <div class="topic-modal-status-control">
                    <label>Status:</label>
                    <select class="topic-status-select" data-topic-id="${topic.id}">
                        <option value="open" ${topic.status === 'open' ? 'selected' : ''}>Open</option>
                        <option value="in-progress" ${topic.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                        <option value="resolved" ${topic.status === 'resolved' ? 'selected' : ''}>Resolved</option>
                        <option value="archived" ${topic.status === 'archived' ? 'selected' : ''}>Archived</option>
                    </select>
                </div>
                <span class="topic-modal-category">${topic.category}</span>
                <span class="topic-modal-priority">Priority: ${topic.priority}</span>
            </div>
        `;

        // Add event listener for status change
        setTimeout(() => {
            const statusSelect = titleContainer.querySelector('.topic-status-select');
            if (statusSelect) {
                statusSelect.addEventListener('change', (e) => {
                    const newStatus = e.target.value;
                    topic.status = newStatus;
                    topic.updated = new Date().toISOString();
                    showToast(`Status changed to: ${newStatus.replace('-', ' ')}`);
                    // Re-render to update display
                    this.openTopicDetailModal(topicId);
                });
            }
        }, 0);

        // Render full conversation
        bodyContainer.innerHTML = `
            ${topic.hasContradiction ? this.renderContradictionWarning(topic) : ''}
            ${topic.relatedTopics && topic.relatedTopics.length > 0 ? this.renderRelatedTopicsBar(topic) : ''}

            <div class="topic-modal-info">
                <div class="topic-modal-info-item">
                    <strong>Created:</strong> ${formatFullTime(topic.created)}
                </div>
                <div class="topic-modal-info-item">
                    <strong>Last Updated:</strong> ${formatFullTime(topic.updated)}
                </div>
                <div class="topic-modal-info-item">
                    <strong>Exchanges:</strong> ${topic.exchanges.length}
                </div>
            </div>

            <div class="topic-modal-exchanges">
                <h4>Conversation</h4>
                ${topic.exchanges.map(exchange => `
                    <div class="modal-exchange ${exchange.speaker}">
                        <div class="modal-exchange-header">
                            <span class="modal-exchange-speaker ${exchange.speaker}">
                                ${exchange.speaker === 'user' ? '👤 You' : '🤖 Claude'}
                            </span>
                            <span class="modal-exchange-time">${formatFullTime(exchange.timestamp)}</span>
                        </div>
                        <div class="modal-exchange-content">${escapeHtml(exchange.content)}</div>
                    </div>
                `).join('')}
            </div>

            <div class="topic-modal-input">
                <h4>Add a Comment</h4>
                <div class="input-group">
                    <input type="text" class="message-input" id="modal-message-input" placeholder="Type your message...">
                    <button class="btn btn-primary" id="modal-send-btn">Send</button>
                </div>
                <div class="smart-suggestions-panel hidden" id="modal-smart-suggestions"></div>
            </div>

            <div class="topic-modal-actions">
                <button class="btn btn-secondary" onclick="window.app.closeTopicDetailModal()">
                    Close
                </button>
            </div>
        `;

        modal.classList.remove('hidden');

        // Attach message input listeners
        this.attachModalInputListeners(topicId);
    }

    attachModalInputListeners(topicId) {
        const messageInput = document.getElementById('modal-message-input');
        const sendBtn = document.getElementById('modal-send-btn');

        if (messageInput && sendBtn) {
            const handleSend = () => {
                const message = messageInput.value.trim();
                if (message) {
                    this.handleModalMessage(topicId, message);
                    messageInput.value = '';
                    this.hideModalSuggestions();
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
                    this.showModalSuggestions(text);
                } else {
                    this.hideModalSuggestions();
                }
            });
        }
    }

    handleModalMessage(topicId, message) {
        const topic = findTopicByIdInProjects(this.data.projects, topicId);
        if (!topic) return;

        // Add user message
        topic.exchanges.push({
            id: `ex-${Date.now()}`,
            speaker: 'user',
            timestamp: new Date().toISOString(),
            content: message
        });

        // Simulate Claude response
        setTimeout(() => {
            topic.exchanges.push({
                id: `ex-${Date.now()}`,
                speaker: 'claude',
                timestamp: new Date().toISOString(),
                content: '✅ Great point! [This is a demo response. In the real app, Claude would analyze your message.]'
            });
            topic.updated = new Date().toISOString();

            // Re-render modal with new messages
            this.openTopicDetailModal(topicId);
            showToast('Response generated');
        }, 1500);

        // Re-render immediately to show user message
        this.openTopicDetailModal(topicId);
    }

    showModalSuggestions(text) {
        const relatedTopics = this.findRelatedTopicsForModal(text);
        const panel = document.getElementById('modal-smart-suggestions');

        if (!panel || relatedTopics.length === 0) {
            this.hideModalSuggestions();
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

    hideModalSuggestions() {
        const panel = document.getElementById('modal-smart-suggestions');
        if (panel) {
            panel.classList.add('hidden');
        }
    }

    findRelatedTopicsForModal(searchText) {
        const keywords = searchText.toLowerCase().split(' ').filter(w => w.length > 3);
        if (keywords.length === 0) return [];

        // Search across all projects
        const allTopics = this.data.projects.flatMap(p => p.topics);

        const scoredTopics = allTopics.map(topic => {
            let score = 0;

            keywords.forEach(keyword => {
                if (topic.title.toLowerCase().includes(keyword)) score += 10;
            });

            topic.exchanges.forEach(exchange => {
                keywords.forEach(keyword => {
                    if (exchange.content.toLowerCase().includes(keyword)) score += 2;
                });
            });

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

    renderContradictionWarning(topic) {
        if (!topic.contradictsWith) return '';
        const contradictingTopic = findTopicByIdInProjects(this.data.projects, topic.contradictsWith);
        if (!contradictingTopic) return '';

        return `
            <div class="contradiction-warning">
                <div class="contradiction-icon">⚠️</div>
                <div class="contradiction-content">
                    <div class="contradiction-title">Potential Conflict Detected</div>
                    <div class="contradiction-text">
                        This conflicts with "${escapeHtml(contradictingTopic.title)}"
                        where you chose REST for: team familiarity, caching, simplicity.
                    </div>
                </div>
            </div>
        `;
    }

    renderRelatedTopicsBar(topic) {
        if (!topic.relatedTopics || topic.relatedTopics.length === 0) return '';

        return `
            <div class="related-topics-bar">
                <span class="related-topics-label">🔗 Related:</span>
                ${topic.relatedTopics.slice(0, 3).map(relatedId => {
                    const relatedTopic = findTopicByIdInProjects(this.data.projects, relatedId);
                    return relatedTopic ?
                        `<button class="related-topic-link" onclick="window.app.openTopicDetailModal('${relatedId}')">
                            ${escapeHtml(relatedTopic.title)}
                        </button>` : '';
                }).join('')}
            </div>
        `;
    }

    closeTopicDetailModal() {
        const modal = document.getElementById('topic-detail-modal');
        modal.classList.add('hidden');
    }

    closeModal(modal) {
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    openExportSelectionModal() {
        const modal = document.getElementById('export-selection-modal');

        // Get topics from current project
        const project = this.getCurrentProject();
        const TOPICS = project.topics || [];

        // Update topic counts for each preset
        const assignedClaudeCount = TOPICS.filter(t => t.assignee === 'Claude').length;
        const allOpenCount = TOPICS.filter(t => t.status === 'Open' || t.status === 'In Progress').length;
        const allTopicsCount = TOPICS.length;

        const countAssignedEl = document.getElementById('count-assigned-claude');
        const countAllOpenEl = document.getElementById('count-all-open');
        const countAllTopicsEl = document.getElementById('count-all-topics');

        if (countAssignedEl) countAssignedEl.textContent = `(${assignedClaudeCount} topics)`;
        if (countAllOpenEl) countAllOpenEl.textContent = `(${allOpenCount} topics)`;
        if (countAllTopicsEl) countAllTopicsEl.textContent = `(${allTopicsCount} topics)`;

        // Populate custom selection checkboxes
        const checkboxContainer = document.getElementById('export-topic-checkboxes');
        if (checkboxContainer) {
            checkboxContainer.innerHTML = TOPICS.map(topic => `
                <label class="export-topic-checkbox">
                    <input type="checkbox" value="${topic.id}" />
                    <span>${escapeHtml(topic.title)}</span>
                    <span class="export-topic-meta">${topic.status} • ${topic.assignee || 'Unassigned'}</span>
                </label>
            `).join('');
        }

        this.openModal(modal);
    }

    openModal(modal) {
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    handleCsvExport(preset) {
        const project = this.getCurrentProject();
        const TOPICS = project.topics || [];
        let topicsToExport = [];

        switch (preset) {
            case 'assigned-claude':
                topicsToExport = TOPICS.filter(t => t.assignee === 'Claude');
                break;
            case 'all-open':
                topicsToExport = TOPICS.filter(t => t.status === 'Open' || t.status === 'In Progress');
                break;
            case 'all-topics':
                topicsToExport = TOPICS;
                break;
            case 'custom':
                const selectedIds = Array.from(document.querySelectorAll('#export-topic-checkboxes input:checked'))
                    .map(cb => cb.value);
                topicsToExport = TOPICS.filter(t => selectedIds.includes(t.id));
                break;
        }

        // Generate CSV content
        const csvContent = this.generateCsvContent(topicsToExport);

        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `exelent-threads-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        showToast(`Exported ${topicsToExport.length} topics to CSV`, 'success');
    }

    generateCsvContent(topics) {
        // CSV Headers
        const headers = ['ID', 'Topic', 'Description', 'Status', 'Priority', 'Category', 'Assignee', 'Date_Created', 'Date_Updated', 'Your_Comments', 'Claude_Comments'];

        // Instruction row
        const instRow = [
            'INST',
            '[INSTRUCTIONS FOR CLAUDE]',
            'CRITICAL RULES FOR AI: (1) NEVER overwrite existing comment columns - ALWAYS add a NEW column to the right. (2) Name new columns sequentially: Your_Comments, Claude_Comments, Your_Comments_2, Claude_Comments_2, etc. (3) Prefix each comment with timestamp: \'YYYY-MM-DD HH:MM: \' (4) Update Date_Updated column to current date when modifying any row. (5) Update Status column to Resolved when answering. (6) Fixed columns A-I are: ID, Topic, Description, Status, Priority, Category, Assignee, Date_Created, Date_Updated. (7) Parser identifies columns by NAME not position. (8) ID column uses UUIDs (format: topic_abc123). (9) Do NOT modify Assignee column - user controls assignment.',
            '', '', '', '', '', '', '', ''
        ];

        // Data rows
        const dataRows = topics.map(topic => [
            topic.id,
            this.escapeCSV(topic.title),
            this.escapeCSV(this.getTopicDescription(topic)),
            topic.status,
            topic.priority || 'Medium',
            topic.category,
            topic.assignee || 'Unassigned',
            topic.created || new Date().toISOString().split('T')[0],
            topic.updated || new Date().toISOString().split('T')[0],
            '', // Your_Comments (empty in demo)
            ''  // Claude_Comments (empty in demo)
        ]);

        // Combine all rows
        const allRows = [headers, instRow, ...dataRows];

        // Convert to CSV string
        return allRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    }

    escapeCSV(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/"/g, '""');
    }

    getTopicDescription(topic) {
        // Extract description from first exchange or use empty string
        if (topic.exchanges && topic.exchanges.length > 0) {
            const firstExchange = topic.exchanges[0];
            return firstExchange.content || '';
        }
        return '';
    }

    openTopicInConversation(topicId) {
        this.closeTopicDetailModal();
        this.switchView('conversation');
        setTimeout(() => {
            if (this.views.conversation) {
                this.views.conversation.switchTopic(topicId);
            }
        }, 100);
    }

    // Ask AI Across All Topics
    openAskAiModal() {
        const modal = document.getElementById('ask-ai-modal');
        const resultsContainer = document.getElementById('ask-ai-results');

        // Clear previous results
        resultsContainer.innerHTML = '';

        modal.classList.remove('hidden');

        // Focus input
        setTimeout(() => {
            const input = document.getElementById('ask-ai-input');
            if (input) input.focus();
        }, 100);

        // Attach event listeners
        this.attachAskAiListeners();
    }

    closeAskAiModal() {
        const modal = document.getElementById('ask-ai-modal');
        modal.classList.add('hidden');
    }

    attachAskAiListeners() {
        const input = document.getElementById('ask-ai-input');
        const searchBtn = document.getElementById('ask-ai-search-btn');
        const examples = document.querySelectorAll('.ask-ai-example');

        if (searchBtn && input) {
            const handleAsk = () => {
                const question = input.value.trim();
                if (question) {
                    this.handleAskAI(question);
                }
            };

            searchBtn.addEventListener('click', handleAsk);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handleAsk();
            });
        }

        // Example questions
        examples.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const question = e.target.dataset.question;
                if (input) input.value = question;
                this.handleAskAI(question);
            });
        });
    }

    handleAskAI(question) {
        const resultsContainer = document.getElementById('ask-ai-results');

        // Show loading state
        const totalTopics = this.data.projects.reduce((sum, p) => sum + p.topics.length, 0);
        resultsContainer.innerHTML = `
            <div class="ask-ai-loading">
                <div class="ask-ai-loading-spinner"></div>
                <p>Searching across all ${totalTopics} conversations...</p>
            </div>
        `;

        // Simulate AI processing
        setTimeout(() => {
            const results = this.searchAcrossAllTopics(question);
            this.displayAskAiResults(question, results);
        }, 1200);
    }

    searchAcrossAllTopics(question) {
        const keywords = question.toLowerCase().split(' ').filter(w => w.length > 2);
        const results = [];

        // Search across all projects
        const allTopics = this.data.projects.flatMap(p => p.topics);

        allTopics.forEach(topic => {
            let relevantExchanges = [];
            let score = 0;

            // Check title
            if (topic.title.toLowerCase().includes(keywords.join(' ')) ||
                keywords.some(k => topic.title.toLowerCase().includes(k))) {
                score += 30;
            }

            // Check each exchange
            topic.exchanges.forEach((exchange, index) => {
                const content = exchange.content.toLowerCase();
                let exchangeScore = 0;

                keywords.forEach(keyword => {
                    if (content.includes(keyword)) {
                        exchangeScore += 10;
                    }
                });

                if (exchangeScore > 0) {
                    relevantExchanges.push({
                        exchange,
                        index,
                        score: exchangeScore
                    });
                    score += exchangeScore;
                }
            });

            if (score > 0) {
                results.push({
                    topic,
                    score,
                    relevantExchanges: relevantExchanges.sort((a, b) => b.score - a.score).slice(0, 3),
                    confidence: Math.min(95, score)
                });
            }
        });

        return results.sort((a, b) => b.score - a.score).slice(0, 5);
    }

    displayAskAiResults(question, results) {
        const resultsContainer = document.getElementById('ask-ai-results');

        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="ask-ai-no-results">
                    <div class="ask-ai-no-results-icon">🤔</div>
                    <div class="ask-ai-no-results-text">
                        No relevant conversations found for "${escapeHtml(question)}"
                    </div>
                    <p class="ask-ai-suggestion">Try rephrasing your question or use different keywords</p>
                </div>
            `;
            return;
        }

        const totalTopics = results.length;
        const avgConfidence = Math.round(results.reduce((sum, r) => sum + r.confidence, 0) / results.length);

        resultsContainer.innerHTML = `
            <div class="ask-ai-results-header">
                <div class="ask-ai-answer-summary">
                    <strong>🎯 AI Answer:</strong> Found ${totalTopics} relevant conversation${totalTopics > 1 ? 's' : ''}
                    <span class="ask-ai-confidence ${this.getConfidenceClass(avgConfidence)}">${avgConfidence}% confidence</span>
                </div>
            </div>

            ${results.map((result, index) => `
                <div class="ask-ai-result-card">
                    <div class="ask-ai-result-header">
                        <div class="ask-ai-result-rank">#${index + 1}</div>
                        <div class="ask-ai-result-title-section">
                            <div class="ask-ai-result-title">${escapeHtml(result.topic.title)}</div>
                            <div class="ask-ai-result-meta">
                                <span class="status-badge ${result.topic.status}">${result.topic.status.replace('-', ' ')}</span>
                                <span>${result.topic.category}</span>
                                <span>${formatRelativeTime(result.topic.updated)}</span>
                            </div>
                        </div>
                        <div class="ask-ai-result-confidence ${this.getConfidenceClass(result.confidence)}">
                            ${result.confidence}% match
                        </div>
                    </div>

                    <div class="ask-ai-relevant-exchanges">
                        ${result.relevantExchanges.map(re => `
                            <div class="ask-ai-exchange">
                                <div class="ask-ai-exchange-speaker ${re.exchange.speaker}">
                                    ${re.exchange.speaker === 'user' ? '👤 You' : '🤖 Claude'}
                                </div>
                                <div class="ask-ai-exchange-content">
                                    ${this.highlightKeywords(escapeHtml(re.exchange.content), question)}
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="ask-ai-result-actions">
                        <button class="btn-small" onclick="window.app.openTopicDetailModal('${result.topic.id}')">
                            📖 View Full Conversation
                        </button>
                    </div>
                </div>
            `).join('')}
        `;
    }

    getConfidenceClass(confidence) {
        if (confidence >= 70) return 'confidence-high';
        if (confidence >= 40) return 'confidence-medium';
        return 'confidence-low';
    }

    highlightKeywords(text, question) {
        const keywords = question.toLowerCase().split(' ').filter(w => w.length > 2);
        let highlighted = text;

        keywords.forEach(keyword => {
            const regex = new RegExp(`(${keyword})`, 'gi');
            highlighted = highlighted.replace(regex, '<mark class="ask-ai-highlight">$1</mark>');
        });

        return highlighted;
    }

    previewMerge(topicIds) {
        const topics = topicIds.map(id => findTopicByIdInProjects(this.data.projects, id)).filter(Boolean);
        if (topics.length < 2) return;

        // Create preview modal
        const modal = document.getElementById('topic-detail-modal');
        const titleContainer = document.getElementById('topic-modal-title');
        const bodyContainer = document.getElementById('topic-modal-body');

        // Generate merged title (use first topic's title or create combined)
        const mergedTitle = `Merged: ${topics[0].title}`;

        // Combine all exchanges in chronological order
        const allExchanges = [];
        topics.forEach(topic => {
            allExchanges.push(...topic.exchanges.map(ex => ({
                ...ex,
                sourceTopic: topic.title
            })));
        });
        allExchanges.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        titleContainer.innerHTML = `
            <div class="merge-preview-badge">🔀 Merge Preview</div>
            <h2>${escapeHtml(mergedTitle)}</h2>
            <div class="merge-preview-meta">
                Combining ${topics.length} topics • ${allExchanges.length} total exchanges
            </div>
        `;

        bodyContainer.innerHTML = `
            <div class="merge-preview-info">
                <div class="merge-preview-warning">
                    ⚠️ This is a preview. No topics will be modified until you confirm the merge.
                </div>
                <div class="merge-preview-topics">
                    <strong>Topics being merged:</strong>
                    <ul>
                        ${topics.map(t => `<li>${escapeHtml(t.title)} (${t.exchanges.length} exchanges)</li>`).join('')}
                    </ul>
                </div>
            </div>

            <div class="topic-modal-exchanges">
                <h4>Combined Exchange History</h4>
                ${allExchanges.map(exchange => `
                    <div class="message ${exchange.speaker}">
                        <div class="message-header">
                            <span class="message-speaker ${exchange.speaker}">
                                ${exchange.speaker === 'user' ? 'You' : 'Claude'}
                            </span>
                            <span class="message-time">${formatFullTime(exchange.timestamp)}</span>
                            <span class="message-source">from: ${escapeHtml(exchange.sourceTopic)}</span>
                        </div>
                        <div class="message-content">${escapeHtml(exchange.content)}</div>
                    </div>
                `).join('')}
            </div>

            <div class="merge-preview-actions">
                <button class="btn btn-primary" onclick="showToast('In the real app, this would merge the topics and update all references')">
                    ✓ Confirm Merge
                </button>
                <button class="btn btn-secondary" onclick="document.getElementById('topic-detail-modal').classList.add('hidden')">
                    Cancel
                </button>
            </div>
        `;

        modal.classList.remove('hidden');
    }

    renderProjectSelector() {
        const project = this.getCurrentProject();
        const projectNameEl = document.getElementById('current-project-name');
        const projectDot = document.querySelector('.project-color-dot');

        if (projectNameEl) {
            projectNameEl.textContent = project.name;
        }
        if (projectDot) {
            projectDot.style.background = project.color;
        }

        // Populate dropdown menu
        const dropdownMenu = document.getElementById('project-dropdown-menu');
        if (dropdownMenu) {
            dropdownMenu.innerHTML = this.data.projects.map(p => `
                <div class="project-menu-item ${p.id === this.data.currentProjectId ? 'active' : ''}" data-project-id="${p.id}">
                    <span class="project-color-dot" style="background: ${p.color}"></span>
                    <div class="project-menu-info">
                        <div class="project-menu-name">${p.name}</div>
                        <div class="project-menu-desc">${p.description}</div>
                    </div>
                    <span class="project-menu-count">${p.topics.length}</span>
                </div>
            `).join('') + `
                <div class="project-menu-item new-project">
                    <span>➕</span>
                    <div class="project-menu-info">
                        <div class="project-menu-name">New Project</div>
                    </div>
                </div>
            `;

            // Attach click handlers to project items
            dropdownMenu.querySelectorAll('.project-menu-item[data-project-id]').forEach(item => {
                item.addEventListener('click', () => {
                    this.switchProject(item.dataset.projectId);
                    dropdownMenu.classList.add('hidden');
                });
            });

            // Handle new project
            dropdownMenu.querySelector('.new-project').addEventListener('click', () => {
                showToast('📁 New Project: Create a new project to organize your topics');
                dropdownMenu.classList.add('hidden');
            });
        }

        // Toggle dropdown on button click
        const selectorBtn = document.getElementById('project-selector-btn');
        if (selectorBtn) {
            selectorBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdownMenu.classList.toggle('hidden');
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            if (dropdownMenu && !dropdownMenu.classList.contains('hidden')) {
                dropdownMenu.classList.add('hidden');
            }
        });

        // Share button handler
        const shareBtnHeader = document.getElementById('share-btn-header');
        if (shareBtnHeader) {
            shareBtnHeader.addEventListener('click', () => {
                this.openShareModal();
            });
        }
    }

    switchProject(projectId) {
        this.data.currentProjectId = projectId;

        // Re-initialize conversation views with new project data
        const projectData = this.getCurrentProjectData();
        this.views.conversation = new ConversationView(projectData);
        this.views.table = new TableView(projectData);
        this.views.board = new BoardView(projectData);
        this.views.timeline = new TimelineView(projectData);

        // Update project selector UI
        this.renderProjectSelector();

        // Re-render current view
        if (['conversation', 'table', 'board', 'timeline'].includes(this.currentView)) {
            this.views[this.currentView].render();
        }

        const project = this.getCurrentProject();
        showToast(`📁 Switched to project: ${project.name}`);
    }

    openShareModal() {
        const modal = document.getElementById('share-modal');
        const content = document.getElementById('share-content');
        const project = this.getCurrentProject();

        content.innerHTML = `
            <div class="share-section">
                <h4>Share Current Project</h4>
                <p class="share-description">Share "${project.name}" with colleagues</p>
                <div class="share-options">
                    <div class="share-option">
                        <strong>Project Link:</strong>
                        <div class="share-link-container">
                            <input type="text" class="share-link-input" value="https://exelent.ai/projects/${project.id}" readonly />
                            <button class="btn btn-small" onclick="navigator.clipboard.writeText('https://exelent.ai/projects/${project.id}'); showToast('🔗 Link copied to clipboard')">
                                Copy
                            </button>
                        </div>
                    </div>
                    <div class="share-option">
                        <strong>Share with Team:</strong>
                        <div class="share-team-input">
                            <input type="email" placeholder="colleague@company.com" class="share-email-input" />
                            <select class="share-permission-select">
                                <option>Can view</option>
                                <option>Can edit</option>
                                <option>Can admin</option>
                            </select>
                            <button class="btn btn-primary btn-small" onclick="showToast('📧 Invitation sent!')">
                                Send Invite
                            </button>
                        </div>
                    </div>
                    <div class="share-stats">
                        <div class="share-stat">
                            <span class="share-stat-label">Topics:</span>
                            <span class="share-stat-value">${project.topics.length}</span>
                        </div>
                        <div class="share-stat">
                            <span class="share-stat-label">Last Updated:</span>
                            <span class="share-stat-value">${formatRelativeTime(project.updated)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');

        // Close handler
        const closeBtn = document.getElementById('share-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.add('hidden');
            });
        }

        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('search-modal-backdrop') || e.target.classList.contains('search-modal')) {
                modal.classList.add('hidden');
            }
        });
    }

    openManageProjectsModal() {
        const modal = document.getElementById('manage-projects-modal');
        const content = document.getElementById('manage-projects-content');

        content.innerHTML = `
            <div class="manage-projects-section">
                <p class="manage-projects-description">Create, edit, and organize your projects</p>
                <div class="projects-list">
                    ${this.data.projects.map(p => `
                        <div class="manage-project-item">
                            <div class="manage-project-info">
                                <span class="project-color-dot" style="background: ${p.color}"></span>
                                <div class="manage-project-details">
                                    <div class="manage-project-name">${p.name}</div>
                                    <div class="manage-project-desc">${p.description}</div>
                                    <div class="manage-project-meta">${p.topics.length} topics • Updated ${formatRelativeTime(p.updated)}</div>
                                </div>
                            </div>
                            <div class="manage-project-actions">
                                <button class="btn btn-small" onclick="showToast('✏️ Edit project: ${p.name}')">Edit</button>
                                <button class="btn btn-small" onclick="showToast('🗑️ Archive project: ${p.name}')">Archive</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="manage-projects-footer">
                    <button class="btn btn-primary" onclick="showToast('📁 Create new project')">
                        ➕ Create New Project
                    </button>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');

        // Close handler
        const closeBtn = document.getElementById('manage-projects-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.add('hidden');
            });
        }

        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('search-modal-backdrop') || e.target.classList.contains('search-modal')) {
                modal.classList.add('hidden');
            }
        });
    }

    // ============================================
    // PROJECT AI THREAD METHODS
    // ============================================

    openProjectAIThread() {
        // Replaces openAskAiModal - now opens Project AI Thread
        this.openAskAiModal();
    }

    // Override openAskAiModal to show Project AI Thread instead
    openAskAiModal() {
        const modal = document.getElementById('ask-ai-modal');
        const project = this.getCurrentProject();

        // Render thread history
        this.renderThreadHistory(project);

        // Render topic selector
        this.renderTopicSelector(project);

        // Attach event listeners
        this.attachThreadListeners(project);

        modal.classList.remove('hidden');
    }

    renderThreadHistory(project) {
        const historyContainer = document.getElementById('thread-history');
        const history = project.threadHistory || [];

        if (history.length === 0) {
            historyContainer.innerHTML = '<div class="thread-empty-state">No messages yet. Start a conversation with AI about your topics.</div>';
            return;
        }

        historyContainer.innerHTML = history.map(msg => {
            const isUser = msg.speaker === 'user';
            const attachedCount = msg.attachedTopicIds ? msg.attachedTopicIds.length : 0;
            const hasSnapshots = msg.topicSnapshots && msg.topicSnapshots.length > 0;

            return '<div class="thread-message ' + (isUser ? 'thread-message-user' : 'thread-message-ai') + '" data-message-id="' + msg.id + '">' +
                '<div class="thread-message-header">' +
                '<span class="thread-message-speaker">' + (isUser ? 'You' : 'AI') + '</span>' +
                '<span class="thread-message-time">' + formatRelativeTime(msg.timestamp) + '</span>' +
                '</div>' +
                '<div class="thread-message-content">' + escapeHtml(msg.message) + '</div>' +
                (attachedCount > 0 ? '<div class="thread-message-topics">📎 ' + attachedCount + ' topics attached' +
                    (hasSnapshots ? ' <button class="thread-view-snapshot-btn" data-message-id="' + msg.id + '">📊 View Topics at This Time</button>' : '') +
                '</div>' : '') +
                '</div>';
        }).join('');

        // Add click handlers for snapshot buttons
        historyContainer.querySelectorAll('.thread-view-snapshot-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const messageId = btn.dataset.messageId;
                const message = history.find(m => m.id === messageId);
                if (message && message.topicSnapshots) {
                    this.showTopicSnapshot(message);
                }
            });
        });
    }

    renderTopicSelector(project) {
        const listContainer = document.getElementById('thread-topic-list');
        const topics = project.topics || [];

        if (topics.length === 0) {
            listContainer.innerHTML = '<div class="thread-empty-state">No topics in this project yet.</div>';
            return;
        }

        listContainer.innerHTML = topics.map(topic => {
            const statusColor = getStatusColor(topic.status);
            return '<div class="thread-topic-item" data-topic-id="' + topic.id + '">' +
                '<input type="checkbox" class="thread-topic-checkbox" id="thread-topic-' + topic.id + '" value="' + topic.id + '">' +
                '<label for="thread-topic-' + topic.id + '" class="thread-topic-label">' +
                '<span class="thread-topic-status" style="background: ' + statusColor + ';"></span>' +
                '<span class="thread-topic-title">' + escapeHtml(topic.title) + '</span>' +
                '<span class="thread-topic-meta">' + topic.status + ' • ' + topic.exchanges.length + ' responses</span>' +
                '</label>' +
                '</div>';
        }).join('');
    }

    attachThreadListeners(project) {
        // Selection buttons
        const selectAllBtn = document.getElementById('select-all-topics');
        const selectNoneBtn = document.getElementById('select-none-topics');
        const selectOpenBtn = document.getElementById('select-open-topics');
        const sendBtn = document.getElementById('thread-send-btn');

        if (selectAllBtn) {
            selectAllBtn.addEventListener('click', () => {
                document.querySelectorAll('.thread-topic-checkbox').forEach(cb => {
                    cb.checked = true;
                });
                this.updateThreadSelectedCount();
            });
        }

        if (selectNoneBtn) {
            selectNoneBtn.addEventListener('click', () => {
                document.querySelectorAll('.thread-topic-checkbox').forEach(cb => {
                    cb.checked = false;
                });
                this.updateThreadSelectedCount();
            });
        }

        if (selectOpenBtn) {
            selectOpenBtn.addEventListener('click', () => {
                document.querySelectorAll('.thread-topic-item').forEach(item => {
                    const topicId = item.dataset.topicId;
                    const topic = findTopicByIdInProjects(this.data.projects, topicId);
                    const checkbox = item.querySelector('.thread-topic-checkbox');
                    if (topic && checkbox) {
                        checkbox.checked = (topic.status === 'open' || topic.status === 'in-progress');
                    }
                });
                this.updateThreadSelectedCount();
            });
        }

        // Checkbox changes
        document.querySelectorAll('.thread-topic-checkbox').forEach(cb => {
            cb.addEventListener('change', () => {
                this.updateThreadSelectedCount();
            });
        });

        // Send button
        if (sendBtn) {
            sendBtn.addEventListener('click', () => {
                this.sendThreadMessage(project);
            });
        }

        // Initial count
        this.updateThreadSelectedCount();
    }

    updateThreadSelectedCount() {
        const checked = document.querySelectorAll('.thread-topic-checkbox:checked').length;
        const countEl = document.getElementById('thread-selected-count');
        if (countEl) {
            countEl.textContent = checked + ' topic' + (checked !== 1 ? 's' : '') + ' selected';
        }
    }

    sendThreadMessage(project) {
        const messageInput = document.getElementById('thread-message-input');
        const message = messageInput ? messageInput.value.trim() : '';

        if (!message) {
            showToast('Please enter a message');
            return;
        }

        // Get selected topics
        const selectedTopicIds = Array.from(document.querySelectorAll('.thread-topic-checkbox:checked'))
            .map(cb => cb.value);

        // Add user message to thread history
        const userMessage = {
            id: 'thread-' + Date.now(),
            speaker: 'user',
            message: message,
            attachedTopicIds: selectedTopicIds,
            timestamp: new Date().toISOString()
        };

        if (!project.threadHistory) {
            project.threadHistory = [];
        }
        project.threadHistory.push(userMessage);

        // Clear input and re-render
        if (messageInput) messageInput.value = '';
        this.renderThreadHistory(project);
        showToast('Sending message...');

        // Simulate AI response
        setTimeout(() => {
            const aiMessage = {
                id: 'thread-' + Date.now(),
                speaker: 'claude',
                message: '[AI Demo Response] Based on the ' + selectedTopicIds.length + ' topic(s) you selected: This is a simulated AI response. In the real app, this would analyze the attached topics and provide insights.',
                timestamp: new Date().toISOString()
            };
            project.threadHistory.push(aiMessage);

            // Re-render
            this.renderThreadHistory(project);
            showToast('Message sent!');
        }, 1500);
    }

    showTopicSnapshot(message) {
        const modal = document.getElementById('snapshot-modal');
        const modalHeader = document.getElementById('snapshot-modal-title');
        const modalBody = document.getElementById('snapshot-modal-body');

        const messageDate = new Date(message.timestamp);
        const formattedDate = messageDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        modalHeader.textContent = '📊 Topic Snapshot - ' + formattedDate;

        modalBody.innerHTML = `
            <div class="snapshot-view">
                <div class="snapshot-header">
                    <p class="snapshot-description">These are the topics as they appeared at the time of this message.</p>
                    <div class="snapshot-message-preview">
                        <strong>Message:</strong> ${escapeHtml(message.message)}
                    </div>
                </div>
                <div class="snapshot-topics">
                    ${message.topicSnapshots.map(topic => {
                        const statusColor = getStatusColor(topic.status);
                        const daysAgo = Math.floor((new Date() - new Date(topic.updated)) / (1000 * 60 * 60 * 24));

                        return `
                            <div class="snapshot-topic-card">
                                <div class="snapshot-topic-header">
                                    <div class="snapshot-topic-title">
                                        <span class="snapshot-topic-status" style="background: ${statusColor};"></span>
                                        ${escapeHtml(topic.title)}
                                    </div>
                                    <div class="snapshot-topic-badge">${topic.status}</div>
                                </div>
                                <div class="snapshot-topic-meta">
                                    <span class="snapshot-meta-item">📁 ${topic.category}</span>
                                    <span class="snapshot-meta-item">⚡ ${topic.priority}</span>
                                    <span class="snapshot-meta-item">💬 ${topic.exchangeCount} responses</span>
                                    <span class="snapshot-meta-item">🕐 ${daysAgo}d ago</span>
                                </div>
                                <div class="snapshot-topic-content">
                                    ${escapeHtml(topic.lastExchange)}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        // Set higher z-index to appear above thread modal
        modal.style.zIndex = '3000';

        modal.classList.remove('hidden');

        // Reset z-index when modal is closed
        const closeBtn = modal.querySelector('.search-modal-close');
        const backdrop = modal.querySelector('.search-modal-backdrop');

        const closeHandler = () => {
            modal.style.zIndex = '';
            closeBtn.removeEventListener('click', closeHandler);
            backdrop.removeEventListener('click', closeHandler);
        };

        closeBtn.addEventListener('click', closeHandler);
        backdrop.addEventListener('click', closeHandler);
    }

    // Ask AI Question (Q&A) modal methods
    openAskAiQuestionModal() {
        const modal = document.getElementById('ask-ai-question-modal');
        const resultsContainer = document.getElementById('ai-question-results');

        // Clear previous results
        resultsContainer.innerHTML = '';

        modal.classList.remove('hidden');

        // Attach listeners for submit and examples
        this.attachAiQuestionListeners();
    }

    closeAskAiQuestionModal() {
        const modal = document.getElementById('ask-ai-question-modal');
        modal.classList.add('hidden');

        // Clear input
        const input = document.getElementById('ai-question-input');
        if (input) input.value = '';
    }

    attachAiQuestionListeners() {
        const submitBtn = document.getElementById('ai-question-submit-btn');
        const input = document.getElementById('ai-question-input');
        const exampleBtns = document.querySelectorAll('.ai-question-example-btn');

        // Submit button
        if (submitBtn && input) {
            const submitHandler = () => {
                const question = input.value.trim();
                if (question) {
                    this.handleAiQuestion(question);
                }
            };

            submitBtn.removeEventListener('click', submitHandler);
            submitBtn.addEventListener('click', submitHandler);

            // Enter key to submit
            input.removeEventListener('keydown', this.aiQuestionKeyHandler);
            this.aiQuestionKeyHandler = (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    submitHandler();
                }
            };
            input.addEventListener('keydown', this.aiQuestionKeyHandler);
        }

        // Example buttons
        exampleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.textContent.replace(/['"]/g, '');
                if (input) {
                    input.value = question;
                    this.handleAiQuestion(question);
                }
            });
        });
    }

    handleAiQuestion(question) {
        const resultsContainer = document.getElementById('ai-question-results');

        // Show loading state
        resultsContainer.innerHTML = `
            <div class="ai-question-loading">
                <div class="ai-question-loading-spinner"></div>
                <p>Analyzing all topics to answer your question...</p>
            </div>
        `;

        // Simulate AI processing
        setTimeout(() => {
            const answer = this.generateAiAnswer(question);
            resultsContainer.innerHTML = answer;
        }, 1500);
    }

    generateAiAnswer(question) {
        const lowerQuestion = question.toLowerCase();
        const allTopics = this.data.projects.flatMap(p => p.topics);

        // Find relevant topics based on keywords
        const relevantTopics = [];

        allTopics.forEach(topic => {
            let score = 0;
            const searchText = (topic.title + ' ' + topic.exchanges.map(e => e.content).join(' ')).toLowerCase();

            // Simple keyword matching
            const keywords = lowerQuestion.split(' ').filter(w => w.length > 3);
            keywords.forEach(keyword => {
                const matches = (searchText.match(new RegExp(keyword, 'g')) || []).length;
                score += matches * 10;
            });

            if (score > 0) {
                relevantTopics.push({ topic, score });
            }
        });

        // Sort by score
        relevantTopics.sort((a, b) => b.score - a.score);
        const topResults = relevantTopics.slice(0, 5);

        if (topResults.length === 0) {
            return `
                <div class="ai-question-no-results">
                    <p>I couldn't find any topics directly related to your question.</p>
                    <p>Try rephrasing or asking about something more specific from your topics.</p>
                </div>
            `;
        }

        // Generate answer summary
        const confidence = Math.min(95, Math.max(60, topResults[0].score));
        const topicTitles = topResults.map(r => r.topic.title).join(', ');

        // Create answer based on question patterns
        let answerText = '';
        if (lowerQuestion.includes('rest') || lowerQuestion.includes('graphql')) {
            answerText = `Based on your discussions, you've chosen <strong>GraphQL for the main API</strong> due to better flexibility and type safety. However, you also discussed using REST for simpler endpoints. The decision includes confidence scores (70-100) for API responses and graceful degradation patterns.`;
        } else if (lowerQuestion.includes('error') || lowerQuestion.includes('handle')) {
            answerText = `Your error handling strategy emphasizes <strong>confidence scores (0-100)</strong> with graceful fallbacks. Key decisions include: returning structured error objects, showing users what's known with confidence indicators, and never blocking the user completely. You apply this pattern consistently across validation, API errors, and AI suggestions.`;
        } else if (lowerQuestion.includes('database') || lowerQuestion.includes('postgres')) {
            answerText = `You've decided on <strong>PostgreSQL</strong> as the primary database with advanced features like JSONB for flexible data. The architecture includes proper indexing strategies and confidence-based validation for data integrity.`;
        } else if (lowerQuestion.includes('auth')) {
            answerText = `Your authentication approach uses <strong>JWT tokens</strong> with refresh token rotation. Security includes rate limiting, proper session management, and confidence scores for multi-factor authentication attempts.`;
        } else {
            answerText = `Based on ${topResults.length} related topic${topResults.length > 1 ? 's' : ''}, the key decisions involve consistent patterns around confidence scoring, graceful error handling, and user-friendly fallbacks. Your approach emphasizes transparency and never completely blocking users.`;
        }

        return `
            <div class="ai-question-answer">
                <div class="ai-question-confidence">
                    <span class="ai-question-confidence-label">Confidence:</span>
                    <span class="ai-question-confidence-value">${confidence}%</span>
                    <div class="ai-question-confidence-bar">
                        <div class="ai-question-confidence-fill" style="width: ${confidence}%"></div>
                    </div>
                </div>
                <div class="ai-question-answer-text">
                    ${answerText}
                </div>
                <div class="ai-question-sources">
                    <div class="ai-question-sources-label">📚 Based on ${topResults.length} topic${topResults.length > 1 ? 's' : ''}:</div>
                    <div class="ai-question-sources-list">
                        ${topResults.map(r => {
                            const relativeConfidence = Math.round((r.score / topResults[0].score) * 100);
                            return `
                                <div class="ai-question-source-item" data-topic-id="${r.topic.id}">
                                    <div class="ai-question-source-title">${escapeHtml(r.topic.title)}</div>
                                    <div class="ai-question-source-meta">
                                        <span class="ai-question-source-confidence">${relativeConfidence}% relevant</span>
                                        <span class="ai-question-source-category">${r.topic.category}</span>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
    console.log('Structured AI Conversations Demo loaded');
    console.log('Try switching between views, clicking topics, and sending messages!');
});

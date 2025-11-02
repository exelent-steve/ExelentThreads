// Timeline View Component - Audacity-Style Interactive Timeline

class TimelineView {
    constructor(data) {
        this.data = data;
        this.viewport = {
            start: 0.7, // Start at 70% (recent topics)
            end: 1.0    // End at 100%
        };
        this.selectedTopicId = null;
        this.isDragging = false;
        this.dragMode = null;
        this.dragStartX = 0;
        this.dragStartViewport = null;

        // Calculate timeline bounds
        this.calculateTimelineBounds();
    }

    calculateTimelineBounds() {
        if (this.data.topics.length === 0) {
            const now = new Date();
            this.timelineStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            this.timelineEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            this.totalTimeRange = this.timelineEnd - this.timelineStart;
            return;
        }

        const now = new Date();
        const oldestTopic = this.data.topics.reduce((oldest, t) => {
            const tDate = new Date(t.updated);
            return tDate < oldest ? tDate : oldest;
        }, new Date(this.data.topics[0].updated));

        this.timelineStart = new Date(oldestTopic.getTime());
        this.timelineEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // Add 1 week buffer
        this.totalTimeRange = this.timelineEnd - this.timelineStart;
    }

    render() {
        const container = document.getElementById('view-container');

        container.innerHTML = `
            <div class="timeline-view-audacity">
                <div class="timeline-header">
                    <h2>📅 Interactive Timeline</h2>
                    <p class="timeline-subtitle">Explore ${this.data.topics.length} topics across time • Drag viewport to navigate</p>
                </div>

                <!-- Overview Timeline -->
                <div class="timeline-overview-section">
                    <div class="timeline-section-label">📊 Project Timeline Overview (All Time)</div>
                    <div class="timeline-overview" id="timeline-overview">
                        <div class="timeline-activity-bars" id="timeline-activity-bars">
                            <!-- Activity bars rendered by JS -->
                        </div>
                        <div class="timeline-viewport-selector" id="timeline-viewport-selector">
                            <div class="timeline-viewport-handle left" data-handle="left"></div>
                            <div class="timeline-viewport-label" id="timeline-viewport-label">Loading...</div>
                            <div class="timeline-viewport-handle right" data-handle="right"></div>
                        </div>
                    </div>
                    <div class="timeline-overview-labels" id="timeline-overview-labels">
                        <!-- Date labels rendered by JS -->
                    </div>
                </div>

                <!-- Detail Timeline -->
                <div class="timeline-detail-section">
                    <div class="timeline-section-label">🔍 Zoomed View</div>
                    <div class="timeline-viewing-info">
                        <span id="timeline-viewing-range">Loading...</span>
                        <div class="timeline-zoom-controls">
                            <button class="timeline-zoom-btn" id="timeline-zoom-in">🔍+ Zoom In</button>
                            <button class="timeline-zoom-btn" id="timeline-zoom-out">🔍- Zoom Out</button>
                            <button class="timeline-zoom-btn" id="timeline-fit-all">⬌ Fit All</button>
                        </div>
                    </div>
                    <div class="timeline-detail">
                        <div class="timeline-axis">
                            <div class="timeline-axis-line"></div>
                            <div class="timeline-axis-labels" id="timeline-detail-labels">
                                <!-- Detail labels rendered by JS -->
                            </div>
                            <div id="timeline-topic-dots">
                                <!-- Topic dots rendered by JS -->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Topics List -->
                <div class="timeline-topics-section">
                    <div class="timeline-section-label">📝 Topics in View (<span id="timeline-topic-count">0</span>)</div>
                    <div class="timeline-topics-list" id="timeline-topics-list">
                        <!-- Topic items rendered by JS -->
                    </div>
                </div>
            </div>
        `;

        this.renderActivityBars();
        this.renderOverviewLabels();
        this.updateViewport();
        this.attachEventListeners();
    }

    renderActivityBars() {
        const barsContainer = document.getElementById('timeline-activity-bars');
        if (!barsContainer) return;

        const numBars = 50;
        barsContainer.innerHTML = '';

        for (let i = 0; i < numBars; i++) {
            const barStart = this.timelineStart.getTime() + (i / numBars) * this.totalTimeRange;
            const barEnd = this.timelineStart.getTime() + ((i + 1) / numBars) * this.totalTimeRange;

            // Count topics in this bar's time range
            const count = this.data.topics.filter(t => {
                const time = new Date(t.updated).getTime();
                return time >= barStart && time < barEnd;
            }).length;

            const bar = document.createElement('div');
            bar.className = 'timeline-activity-bar';
            bar.style.height = count > 0 ? `${Math.min(100, count * 20)}%` : '5%';
            bar.title = `${count} topic${count !== 1 ? 's' : ''}`;
            barsContainer.appendChild(bar);
        }
    }

    renderOverviewLabels() {
        const labelsContainer = document.getElementById('timeline-overview-labels');
        if (!labelsContainer) return;

        const numLabels = 6;
        const labels = [];

        for (let i = 0; i <= numLabels; i++) {
            const time = new Date(this.timelineStart.getTime() + (i / numLabels) * this.totalTimeRange);
            labels.push(this.formatDate(time));
        }

        labelsContainer.innerHTML = labels.map(l => `<span>${l}</span>`).join('');
    }

    updateViewport() {
        const viewportEl = document.getElementById('timeline-viewport-selector');
        const viewportLabel = document.getElementById('timeline-viewport-label');

        if (!viewportEl || !viewportLabel) return;

        const startPercent = this.viewport.start * 100;
        const endPercent = this.viewport.end * 100;
        const widthPercent = endPercent - startPercent;

        viewportEl.style.left = `${startPercent}%`;
        viewportEl.style.width = `${widthPercent}%`;

        // Update label
        const startTime = new Date(this.timelineStart.getTime() + this.viewport.start * this.totalTimeRange);
        const endTime = new Date(this.timelineStart.getTime() + this.viewport.end * this.totalTimeRange);
        const daysDiff = Math.round((endTime - startTime) / (1000 * 60 * 60 * 24));

        viewportLabel.textContent = `${daysDiff} day${daysDiff !== 1 ? 's' : ''}`;

        this.renderDetailView();
    }

    renderDetailView() {
        const viewportStart = new Date(this.timelineStart.getTime() + this.viewport.start * this.totalTimeRange);
        const viewportEnd = new Date(this.timelineStart.getTime() + this.viewport.end * this.totalTimeRange);
        const viewportRange = viewportEnd - viewportStart;

        // Update viewing info
        const viewingRange = document.getElementById('timeline-viewing-range');
        if (viewingRange) {
            viewingRange.textContent = `${this.formatDate(viewportStart)} - ${this.formatDate(viewportEnd)}`;
        }

        // Filter visible topics
        const visibleTopics = this.data.topics.filter(t => {
            const topicDate = new Date(t.updated);
            return topicDate >= viewportStart && topicDate <= viewportEnd;
        });

        // Render detail labels
        const detailLabels = document.getElementById('timeline-detail-labels');
        if (detailLabels) {
            const numLabels = Math.min(7, Math.max(3, Math.floor(viewportRange / (7 * 24 * 60 * 60 * 1000))));
            const labels = [];

            for (let i = 0; i <= numLabels; i++) {
                const time = new Date(viewportStart.getTime() + (i / numLabels) * viewportRange);
                labels.push(`<div class="timeline-axis-tick">${this.formatDate(time, true)}</div>`);
            }

            detailLabels.innerHTML = labels.join('');
        }

        // Render topic dots
        const dotsContainer = document.getElementById('timeline-topic-dots');
        if (dotsContainer) {
            dotsContainer.innerHTML = '';

            visibleTopics.forEach(topic => {
                const topicDate = new Date(topic.updated);
                const position = ((topicDate - viewportStart) / viewportRange) * 100;
                const dot = document.createElement('div');
                dot.className = `timeline-topic-dot timeline-dot-${topic.status}`;
                if (topic.id === this.selectedTopicId) {
                    dot.classList.add('selected');
                }
                dot.style.left = `${position}%`;
                dot.dataset.topicId = topic.id;
                dot.addEventListener('click', () => this.selectTopic(topic.id));
                dotsContainer.appendChild(dot);
            });
        }

        // Render topics list
        this.renderTopicsList(visibleTopics);
    }

    renderTopicsList(visibleTopics) {
        const listContainer = document.getElementById('timeline-topics-list');
        const countEl = document.getElementById('timeline-topic-count');

        if (!listContainer) return;

        if (countEl) {
            countEl.textContent = visibleTopics.length;
        }

        if (visibleTopics.length === 0) {
            listContainer.innerHTML = '<div class="timeline-empty-state">No topics in this time range. Drag the viewport to see different periods.</div>';
            return;
        }

        // Sort by updated date (most recent first)
        const sortedTopics = [...visibleTopics].sort((a, b) => new Date(b.updated) - new Date(a.updated));
        const now = new Date();

        listContainer.innerHTML = sortedTopics.map(topic => {
            const daysAgo = Math.floor((now - new Date(topic.updated)) / (1000 * 60 * 60 * 24));
            const selected = topic.id === this.selectedTopicId ? 'selected' : '';
            return `
                <div class="timeline-topic-item ${selected}" data-topic-id="${topic.id}">
                    <div class="timeline-topic-status timeline-dot-${topic.status}"></div>
                    <div class="timeline-topic-info">
                        <div class="timeline-topic-title">${escapeHtml(topic.title)}</div>
                        <div class="timeline-topic-meta">${daysAgo}d ago • ${topic.status} • ${topic.exchanges.length} exchanges</div>
                        <div class="timeline-topic-snippet">${escapeHtml(topic.exchanges[topic.exchanges.length - 1]?.content || 'No exchanges yet')}</div>
                    </div>
                </div>
            `;
        }).join('');

        // Add click handlers - clicking anywhere on topic opens modal
        listContainer.querySelectorAll('.timeline-topic-item').forEach(item => {
            item.addEventListener('click', () => {
                const topicId = item.dataset.topicId;
                this.selectTopic(topicId);
                window.app.openTopicDetailModal(topicId);
            });
        });
    }

    selectTopic(topicId) {
        this.selectedTopicId = topicId;
        this.renderDetailView();
    }

    formatDate(date, short = false) {
        if (short) {
            const month = date.toLocaleDateString('en-US', { month: 'short' });
            const day = date.getDate();
            return `${month} ${day}`;
        }
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    attachEventListeners() {
        // Viewport dragging
        const viewportEl = document.getElementById('timeline-viewport-selector');
        const overviewTimeline = document.getElementById('timeline-overview');

        if (!viewportEl || !overviewTimeline) return;

        viewportEl.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('timeline-viewport-handle')) {
                this.dragMode = e.target.dataset.handle === 'left' ? 'resize-left' : 'resize-right';
            } else {
                this.dragMode = 'move';
            }
            this.isDragging = true;
            this.dragStartX = e.clientX;
            this.dragStartViewport = { ...this.viewport };
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;

            const rect = overviewTimeline.getBoundingClientRect();
            const deltaX = e.clientX - this.dragStartX;
            const deltaPercent = deltaX / rect.width;

            if (this.dragMode === 'move') {
                const width = this.dragStartViewport.end - this.dragStartViewport.start;
                let newStart = this.dragStartViewport.start + deltaPercent;
                let newEnd = this.dragStartViewport.end + deltaPercent;

                // Clamp to bounds
                if (newStart < 0) {
                    newStart = 0;
                    newEnd = width;
                }
                if (newEnd > 1) {
                    newEnd = 1;
                    newStart = 1 - width;
                }

                this.viewport.start = newStart;
                this.viewport.end = newEnd;
            } else if (this.dragMode === 'resize-left') {
                let newStart = Math.max(0, Math.min(this.dragStartViewport.end - 0.05, this.dragStartViewport.start + deltaPercent));
                this.viewport.start = newStart;
            } else if (this.dragMode === 'resize-right') {
                let newEnd = Math.min(1, Math.max(this.dragStartViewport.start + 0.05, this.dragStartViewport.end + deltaPercent));
                this.viewport.end = newEnd;
            }

            this.updateViewport();
        });

        document.addEventListener('mouseup', () => {
            this.isDragging = false;
            this.dragMode = null;
        });

        // Zoom controls
        const zoomIn = document.getElementById('timeline-zoom-in');
        const zoomOut = document.getElementById('timeline-zoom-out');
        const fitAll = document.getElementById('timeline-fit-all');

        if (zoomIn) {
            zoomIn.addEventListener('click', () => {
                const center = (this.viewport.start + this.viewport.end) / 2;
                const currentWidth = this.viewport.end - this.viewport.start;
                const newWidth = Math.max(0.05, currentWidth * 0.7);
                this.viewport.start = Math.max(0, center - newWidth / 2);
                this.viewport.end = Math.min(1, center + newWidth / 2);
                this.updateViewport();
            });
        }

        if (zoomOut) {
            zoomOut.addEventListener('click', () => {
                const center = (this.viewport.start + this.viewport.end) / 2;
                const currentWidth = this.viewport.end - this.viewport.start;
                const newWidth = Math.min(1, currentWidth * 1.3);
                this.viewport.start = Math.max(0, center - newWidth / 2);
                this.viewport.end = Math.min(1, center + newWidth / 2);
                this.updateViewport();
            });
        }

        if (fitAll) {
            fitAll.addEventListener('click', () => {
                this.viewport.start = 0;
                this.viewport.end = 1;
                this.updateViewport();
            });
        }
    }
}

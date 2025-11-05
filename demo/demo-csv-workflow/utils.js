// Utility functions

// Format relative time
function formatRelativeTime(timestamp) {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return then.toLocaleDateString();
}

// Format full time
function formatFullTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit' 
    });
}

// Truncate text
function truncate(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Get status icon
function getStatusIcon(status) {
    const icons = {
        'open': '●',
        'in-progress': '◐',
        'resolved': '✓',
        'archived': '□'
    };
    return icons[status] || '●';
}

// Get status color
function getStatusColor(status) {
    const colors = {
        'open': 'var(--status-open)',
        'in-progress': 'var(--status-progress)',
        'resolved': 'var(--status-resolved)',
        'archived': 'var(--status-archived)'
    };
    return colors[status] || 'var(--text-secondary)';
}

// Convert to CSV
function convertToCSV(data) {
    let csv = 'Issue,Status,Category,Updated,Exchanges,Latest Exchange\n';
    
    data.topics.forEach(topic => {
        const latestExchange = topic.exchanges[topic.exchanges.length - 1];
        const row = [
            `"${topic.title}"`,
            topic.status,
            topic.category,
            formatRelativeTime(topic.updated),
            topic.exchanges.length,
            `"${truncate(latestExchange.content, 100)}"`
        ];
        csv += row.join(',') + '\n';
    });
    
    return csv;
}

// Download file
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

// Show toast notification
function showToast(message, duration = 3000) {
    const container = document.getElementById('toast-container');
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Find topic by ID
function findTopicById(topics, id) {
    return topics.find(topic => topic.id === id);
}

// Find topic by ID across all projects
function findTopicByIdInProjects(projects, topicId) {
    for (const project of projects) {
        const topic = project.topics.find(t => t.id === topicId);
        if (topic) return topic;
    }
    return null;
}

// Sort topics
function sortTopics(topics, sortBy) {
    const sorted = [...topics];
    
    switch (sortBy) {
        case 'recent':
            sorted.sort((a, b) => new Date(b.updated) - new Date(a.updated));
            break;
        case 'alpha':
            sorted.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'status':
            const statusOrder = { 'open': 1, 'in-progress': 2, 'resolved': 3, 'archived': 4 };
            sorted.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
            break;
        case 'created':
            sorted.sort((a, b) => new Date(a.created) - new Date(b.created));
            break;
    }
    
    return sorted;
}

// Filter topics
function filterTopics(topics, filters) {
    return topics.filter(topic => {
        if (filters.status && filters.status !== 'all' && topic.status !== filters.status) {
            return false;
        }
        if (filters.category && filters.category !== 'all' && topic.category !== filters.category) {
            return false;
        }
        return true;
    });
}

// Group topics by status
function groupTopicsByStatus(topics) {
    return {
        'open': topics.filter(t => t.status === 'open'),
        'in-progress': topics.filter(t => t.status === 'in-progress'),
        'resolved': topics.filter(t => t.status === 'resolved'),
        'archived': topics.filter(t => t.status === 'archived')
    };
}

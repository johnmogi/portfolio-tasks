/**
 * Utility Functions Module
 * Contains all helper functions and formatting utilities
 */

// ==========================================
// FORMATTING FUNCTIONS
// ==========================================

export function formatDate(dateString) {
    if (!dateString) return 'No deadline';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

export function formatTimeSpent(minutes) {
    if (minutes < 60) {
        return `${Math.round(minutes)}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
}

export function formatTimeSpentDetailed(minutes) {
    if (minutes < 60) {
        return `${minutes} minutes`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) {
        return `${hours} hour${hours !== 1 ? 's' : ''}`;
    }
    return `${hours}h ${mins}m`;
}

// ==========================================
// UI HELPERS
// ==========================================

export function createCategoryBadge(category, color) {
    if (!category) return '';
    return `<span class="category-badge">
        <span class="category-dot" style="background-color: ${color || '#888888'}"></span>
        ${category}
    </span>`;
}

export function createStatusBadge(status) {
    const statusConfig = {
        'open': { text: 'Open', class: 'badge-warning' },
        'done': { text: 'Done', class: 'badge-success' },
        'in-progress': { text: 'In Progress', class: 'badge-info' }
    };

    const config = statusConfig[status] || statusConfig.open;
    return `<span class="badge ${config.class}">${config.text}</span>`;
}

export function createTimeTracker(task) {
    const timeSpent = task.timeSpent || 0;
    const isTracking = task.isTracking || false;

    if (timeSpent > 0 || isTracking) {
        return `
            <div class="time-tracker">
                <div class="time-display">
                    <i class="fas fa-stopwatch"></i>
                    <span>Time: ${formatTimeSpent(timeSpent)}</span>
                </div>
                <button class="timer-btn ${isTracking ? 'stop' : 'start'}"
                        onclick="toggleTimer('${task.id}')">
                    ${isTracking ? 'Stop' : 'Start'}
                </button>
                <button class="timer-btn reset"
                        onclick="resetTimer('${task.id}')"
                        title="Reset timer">
                    <i class="fas fa-undo"></i>
                </button>
            </div>
        `;
    }
    return '';
}

// ==========================================
// VALIDATION FUNCTIONS
// ==========================================

export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function isValidDate(dateString) {
    if (!dateString) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
}

export function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// ==========================================
// ARRAY UTILITIES
// ==========================================

export function groupBy(array, key) {
    return array.reduce((groups, item) => {
        const group = item[key] || 'Uncategorized';
        groups[group] = groups[group] || [];
        groups[group].push(item);
        return groups;
    }, {});
}

export function sortBy(array, key, direction = 'asc') {
    return array.sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];

        if (direction === 'desc') {
            return aVal < bVal ? 1 : -1;
        }
        return aVal > bVal ? 1 : -1;
    });
}

export function filterTasks(tasks, filters) {
    return tasks.filter(task => {
        // Status filter
        if (filters.status && filters.status !== 'all' && task.status !== filters.status) {
            return false;
        }

        // Category filter
        if (filters.category && filters.category !== 'all' && task.category !== filters.category) {
            return false;
        }

        // Search filter
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            const matchesTitle = task.title.toLowerCase().includes(searchTerm);
            const matchesDescription = task.description && task.description.toLowerCase().includes(searchTerm);
            const matchesCategory = task.category.toLowerCase().includes(searchTerm);

            if (!matchesTitle && !matchesDescription && !matchesCategory) {
                return false;
            }
        }

        // Date filters
        if (filters.deadlineBefore && task.deadline && new Date(task.deadline) > new Date(filters.deadlineBefore)) {
            return false;
        }

        if (filters.deadlineAfter && task.deadline && new Date(task.deadline) < new Date(filters.deadlineAfter)) {
            return false;
        }

        return true;
    });
}

// ==========================================
// LOCAL STORAGE HELPERS
// ==========================================

export function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

export function loadFromStorage(key, defaultValue = null) {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return defaultValue;
    }
}

export function clearStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error clearing localStorage:', error);
        return false;
    }
}

// ==========================================
// COLOR UTILITIES
// ==========================================

export function generateRandomColor() {
    const colors = [
        '#007bff', '#28a745', '#dc3545', '#ffc107',
        '#17a2b8', '#6610f2', '#fd7e14', '#20c997',
        '#e83e8c', '#6f42c1', '#6c757d', '#343a40'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

export function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

export function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// ==========================================
// DEBOUNCE AND THROTTLE
// ==========================================

export function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

export function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

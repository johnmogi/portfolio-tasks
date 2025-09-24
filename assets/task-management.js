// ==========================================
// TASK MANAGEMENT MODULE
// ==========================================

function addTask(taskData) {
    const newTask = {
        id: generateTaskId(),
        title: taskData.title,
        description: taskData.description || '',
        category: taskData.category || '',
        color: taskData.color || 'work',
        deadline: taskData.deadline || null,
        status: 'open',
        timeSpent: 0,
        isTracking: false,
        trackingStartTime: null,
        timeLogs: [],
        createdAt: Date.now()
    };

    tasks.push(newTask);
    saveTasks();
    refreshCurrentView();
    populateCategoryFilter();
    return newTask;
}

function updateTask(taskId, updates) {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return null;

    // Stop timer if status is being changed to done
    if (updates.status === 'done' && tasks[taskIndex].isTracking) {
        stopTimer(taskId);
    }

    tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
    saveTasks();
    refreshCurrentView();
    populateCategoryFilter();
    return tasks[taskIndex];
}

function deleteTask(taskId) {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return false;

    // Stop timer if task is being deleted
    if (tasks[taskIndex].isTracking) {
        stopTimer(taskId);
    }

    tasks.splice(taskIndex, 1);
    saveTasks();
    refreshCurrentView();
    populateCategoryFilter();
    return true;
}

function toggleTaskStatus(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === 'done' ? 'open' : 'done';

    // Stop timer if marking as done
    if (newStatus === 'done' && task.isTracking) {
        stopTimer(taskId);
    }

    updateTask(taskId, { status: newStatus });
}

function getUniqueCategories() {
    const categories = new Set();
    tasks.forEach(task => {
        if (task.category) {
            categories.add(task.category);
        }
    });
    return Array.from(categories);
}

function populateCategoryFilter() {
    const filterContainer = $('#categoryFilter');
    const categories = getUniqueCategories();

    let filterHtml = '<option value="all">All Categories</option>';
    categories.forEach(category => {
        filterHtml += `<option value="${category}">${category}</option>`;
    });

    filterContainer.html(filterHtml);
}

function filterTasksByCategory(category) {
    if (category === 'all') {
        refreshCurrentView(tasks);
    } else {
        const filteredTasks = tasks.filter(task => task.category === category);
        refreshCurrentView(filteredTasks);
    }
}

/**
 * To-Do Portfolio App - Enhanced Version with New Features
 * Features: Category filtering, background time tracking, cards default, dark mode
 */

$(document).ready(function() {
    console.log('🚀 Enhanced To-Do Portfolio app starting...');

    // ==========================================
    // GLOBAL VARIABLES
    // ==========================================

    const STORAGE_KEY = 'todo_portfolio_tasks_v1';
    let tasks = [];
    let currentView = 'card'; // Cards as default view
    let tasksTable = null;
    let activeTimer = null;
    let darkMode = localStorage.getItem('darkMode') === 'true';

    // ==========================================
    // DATA MANAGEMENT
    // ==========================================

    function loadTasks() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                tasks = JSON.parse(stored);
            } else {
                tasks = seedTasks();
            }
            console.log('📊 Loaded tasks:', tasks.length);
        } catch (error) {
            console.error('❌ Error loading tasks:', error);
            tasks = seedTasks();
        }
    }

    function saveTasks() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
            console.log('💾 Tasks saved to localStorage');
        } catch (error) {
            console.error('❌ Error saving tasks:', error);
        }
    }

    function generateId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function seedTasks() {
        const now = Date.now();
        const tomorrow = now + (24 * 60 * 60 * 1000);
        const nextWeek = now + (7 * 24 * 60 * 60 * 1000);

        return [
            {
                id: generateId(),
                title: 'Complete project proposal',
                description: 'Write and finalize the project proposal document',
                category: 'Work',
                color: '#007bff',
                createdAt: now,
                deadline: tomorrow,
                status: 'open',
                estimatedHours: 4,
                timeSpent: 0,
                isTracking: false,
                trackingStartTime: null
            },
            {
                id: generateId(),
                title: 'Review design mockups',
                description: 'Review and provide feedback on the latest design mockups',
                category: 'Design',
                color: '#28a745',
                createdAt: now,
                deadline: nextWeek,
                status: 'open',
                estimatedHours: 2,
                timeSpent: 0,
                isTracking: false,
                trackingStartTime: null
            },
            {
                id: generateId(),
                title: 'Team meeting preparation',
                description: 'Prepare agenda and materials for the upcoming team meeting',
                category: 'Work',
                color: '#007bff',
                createdAt: now - (2 * 60 * 60 * 1000),
                deadline: null,
                status: 'done',
                estimatedHours: 1,
                timeSpent: 45,
                isTracking: false,
                trackingStartTime: null
            }
        ];
    }

    // ==========================================
    // CATEGORY FILTERING
    // ==========================================

    function getUniqueCategories() {
        const categories = new Set(tasks.map(task => task.category).filter(Boolean));
        return Array.from(categories).sort();
    }

    function populateCategoryFilter() {
        const categories = getUniqueCategories();
        const select = $('#categoryFilter');

        // Clear existing options (except "All Categories")
        select.find('option:not(:first)').remove();

        // Add categories
        categories.forEach(category => {
            select.append(`<option value="${category}">${category}</option>`);
        });
    }

    function filterTasksByCategory(category) {
        if (!category) {
            return tasks;
        }
        return tasks.filter(task => task.category === category);
    }

    // ==========================================
    // BACKGROUND TIME TRACKING
    // ==========================================

    function startBackgroundTimer() {
        // Check every minute for active timers
        setInterval(() => {
            const now = Date.now();
            let hasActiveTimer = false;

            tasks.forEach(task => {
                if (task.isTracking && task.trackingStartTime) {
                    const elapsed = Math.floor((now - task.trackingStartTime) / 1000 / 60); // minutes
                    task.timeSpent = (task.timeSpent || 0) + elapsed;
                    task.trackingStartTime = now - 1000; // Update to current time minus 1 second
                    hasActiveTimer = true;
                }
            });

            if (hasActiveTimer) {
                saveTasks();
                refreshCurrentView();
            }
        }, 60000); // Check every minute
    }

    function toggleTimer(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        if (task.isTracking) {
            // Stop timer
            const now = Date.now();
            const elapsed = Math.floor((now - task.trackingStartTime) / 1000 / 60);
            task.timeSpent = (task.timeSpent || 0) + elapsed;
            task.isTracking = false;
            task.trackingStartTime = null;
            showToast('Timer stopped', 'info');
        } else {
            // Start timer
            const now = Date.now();
            task.isTracking = true;
            task.trackingStartTime = now - 1000; // Start from current time minus 1 second
            showToast('Timer started', 'success');
        }

        saveTasks();
        refreshCurrentView();
    }

    function resetTimer(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        if (confirm('Are you sure you want to reset the timer? This cannot be undone.')) {
            task.timeSpent = 0;
            if (task.isTracking) {
                task.isTracking = false;
                task.trackingStartTime = null;
            }
            saveTasks();
            refreshCurrentView();
            showToast('Timer reset', 'info');
        }
    }

    // ==========================================
    // DARK MODE SUPPORT
    // ==========================================

    function toggleDarkMode() {
        darkMode = !darkMode;
        localStorage.setItem('darkMode', darkMode);
        applyDarkMode();
        showToast(`Dark mode ${darkMode ? 'enabled' : 'disabled'}`, 'info');
    }

    function applyDarkMode() {
        if (darkMode) {
            $('body').addClass('dark-mode');
            $('.navbar').removeClass('bg-primary').addClass('bg-dark');
            $('.btn-primary').removeClass('btn-primary').addClass('btn-secondary');
        } else {
            $('body').removeClass('dark-mode');
            $('.navbar').removeClass('bg-dark').addClass('bg-primary');
            $('.btn-secondary').removeClass('btn-secondary').addClass('btn-primary');
        }

        // Update toggle button
        const icon = darkMode ? '☀️' : '🌙';
        const text = darkMode ? 'Light Mode' : 'Dark Mode';
        $('#darkModeToggle').html(`${icon} ${text}`);
    }

    // ==========================================
    // VIEW MANAGEMENT
    // ==========================================

    function initializeDataTable() {
        if ($('#tasksTable').length && $.fn.DataTable) {
            tasksTable = $('#tasksTable').DataTable({
                data: tasks,
                columns: [
                    {
                        data: 'status',
                        title: 'Status',
                        width: '80px',
                        orderable: false,
                        render: function(data, type, row) {
                            if (type === 'display') {
                                const checked = data === 'done' ? 'checked' : '';
                                return `<div class="form-check">
                                    <input class="form-check-input task-status" type="checkbox" ${checked}
                                           data-task-id="${row.id}">
                                </div>`;
                            }
                            return data;
                        }
                    },
                    {
                        data: 'title',
                        title: 'Title',
                        render: function(data, type, row) {
                            if (type === 'display') {
                                const isDone = row.status === 'done' ? 'is-done' : '';
                                return `<span class="${isDone}" title="${row.description || ''}">${data}</span>`;
                            }
                            return data;
                        }
                    },
                    {
                        data: 'category',
                        title: 'Category',
                        render: function(data, type, row) {
                            if (type === 'display') {
                                return createCategoryBadge(data, row.color);
                            }
                            return data || '';
                        }
                    },
                    {
                        data: 'deadline',
                        title: 'Deadline',
                        render: function(data, type, row) {
                            if (type === 'display') {
                                const formatted = formatDate(data);
                                const isOverdue = data && new Date(data) < new Date() && row.status === 'open';
                                const overdueClass = isOverdue ? 'overdue' : '';
                                return `<span class="${overdueClass}" title="${isOverdue ? 'Overdue' : ''}">${formatted}</span>`;
                            }
                            if (type === 'sort') {
                                return data ? new Date(data).getTime() : 0;
                            }
                            return data;
                        }
                    },
                    {
                        data: 'createdAt',
                        title: 'Created',
                        render: function(data, type, row) {
                            if (type === 'display') {
                                return formatDate(data);
                            }
                            if (type === 'sort') {
                                return new Date(data).getTime();
                            }
                            return data;
                        }
                    },
                    {
                        data: null,
                        title: 'Actions',
                        width: '120px',
                        orderable: false,
                        render: function(data, type, row) {
                            if (type === 'display') {
                                return `
                                    <button class="btn btn-sm btn-outline-primary edit-task" data-task-id="${row.id}">
                                        Edit
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger delete-task" data-task-id="${row.id}">
                                        Delete
                                    </button>
                                `;
                            }
                            return '';
                        }
                    }
                ],
                order: [[3, 'asc']],
                pageLength: 25,
                responsive: true,
                rowGroup: {
                    dataSrc: 'category',
                    startRender: function(rows, group) {
                        if (!group) return null;
                        return $('<tr class="table-info">')
                            .append('<td colspan="6"><strong>' + group + '</strong></td>')
                            .get(0);
                    }
                }
            });
        }
    }

    function refreshTable(tasksToShow = null) {
        const displayTasks = tasksToShow || tasks;
        if (tasksTable) {
            tasksTable.clear();
            if (displayTasks.length > 0) {
                tasksTable.rows.add(displayTasks);
            }
            tasksTable.draw();
        }
    }

    function renderCardView(tasksToShow = null) {
        const displayTasks = tasksToShow || tasks;
        const container = $('#tasksCardGrid');
        container.empty();

        if (displayTasks.length === 0) {
            container.html(`
                <div class="col-12">
                    <div class="text-center text-muted py-5">
                        <i class="fas fa-tasks" style="font-size: 4rem; opacity: 0.3;"></i>
                        <p class="mt-3">No tasks yet. Click "Add Task" to get started!</p>
                    </div>
                </div>
            `);
            return;
        }

        displayTasks.forEach(task => {
            container.append(createTaskCard(task));
        });
    }

    function renderListView(tasksToShow = null) {
        const displayTasks = tasksToShow || tasks;
        const container = $('#tasksList');
        container.empty();

        if (displayTasks.length === 0) {
            container.html(`
                <div class="col-12">
                    <div class="text-center text-muted py-5">
                        <i class="fas fa-tasks" style="font-size: 3rem; opacity: 0.3;"></i>
                        <p class="mt-2">No tasks yet. Click "Add Task" to get started!</p>
                    </div>
                </div>
            `);
            return;
        }

        const list = $('<ul class="list-group"></ul>');
        displayTasks.forEach(task => {
            list.append(createTaskListItem(task));
        });
        container.append(list);
    }

    // ==========================================
    // UTILITY FUNCTIONS
    // ==========================================

    function formatDate(dateString) {
        if (!dateString) return 'No deadline';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    function formatTimeSpent(minutes) {
        if (minutes < 60) {
            return `${Math.round(minutes)}m`;
        }
        const hours = Math.floor(minutes / 60);
        const mins = Math.round(minutes % 60);
        return `${hours}h ${mins}m`;
    }

    function createCategoryBadge(category, color) {
        if (!category) return '';
        return `<span class="category-badge">
            <span class="category-dot" style="background-color: ${color || '#888888'}"></span>
            ${category}
        </span>`;
    }

    function createTaskCard(task) {
        return `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${task.title || 'Untitled Task'}</h5>
                        <p class="card-text">${task.description || 'No description'}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="badge" style="background-color: ${task.color || '#6c757d'}">
                                ${task.category || 'Uncategorized'}
                            </span>
                            <small class="text-muted">${formatDate(task.deadline) || 'No deadline'}</small>
                        </div>
                        ${createTimeTracker(task)}
                    </div>
                </div>
            </div>
        `;
    }

    function createTaskListItem(task) {
        return `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div class="form-check">
                    <input class="form-check-input task-status" type="checkbox"
                           data-task-id="${task.id}"
                           ${task.status === 'done' ? 'checked' : ''}>
                    <label class="form-check-label ${task.status === 'done' ? 'text-decoration-line-through' : ''}">
                        ${task.title}
                    </label>
                </div>
                <div>
                    <button class="btn btn-sm btn-outline-primary edit-task" data-task-id="${task.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-task" data-task-id="${task.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </li>
        `;
    }

    function createTimeTracker(task) {
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
    // TASK OPERATIONS
    // ==========================================

    function addTask(taskData) {
        const newTask = {
            id: generateId(),
            title: taskData.title,
            description: taskData.description,
            category: taskData.category,
            color: taskData.color,
            deadline: taskData.deadline,
            status: 'open',
            createdAt: Date.now(),
            estimatedHours: taskData.estimatedHours || 0,
            timeSpent: 0,
            isTracking: false,
            trackingStartTime: null
        };

        tasks.push(newTask);
        saveTasks();
        populateCategoryFilter();
        return newTask;
    }

    function updateTask(taskId, updates) {
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) {
            throw new Error('Task not found');
        }

        tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
        saveTasks();
        populateCategoryFilter();
        return tasks[taskIndex];
    }

    function deleteTask(taskId) {
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) {
            throw new Error('Task not found');
        }

        const deletedTask = tasks.splice(taskIndex, 1)[0];
        saveTasks();
        populateCategoryFilter();
        return deletedTask;
    }

    function toggleTaskStatus(taskId) {
        const task = tasks.find(task => task.id === taskId);
        if (!task) {
            throw new Error('Task not found');
        }

        task.status = task.status === 'done' ? 'open' : 'done';
        saveTasks();
        return task;
    }

    // ==========================================
    // UI MANAGEMENT
    // ==========================================

    function openTaskModal(taskId = null) {
        const modal = $('#taskModal');
        const form = $('#taskForm');

        if (taskId) {
            const task = tasks.find(t => t.id === taskId);
            if (!task) {
                showToast('Task not found', 'error');
                return;
            }

            $('#taskModalLabel').text('Edit Task');
            $('#taskId').val(task.id);
            $('#taskTitle').val(task.title);
            $('#taskDescription').val(task.description);
            $('#taskCategory').val(task.category);
            $('#taskColor').val(task.color);
            $('#taskDeadline').val(task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : '');
            $('#taskEstimatedHours').val(task.estimatedHours || '');
            $('#taskTimeSpentDisplay').text(formatTimeSpent(task.timeSpent || 0));
        } else {
            $('#taskModalLabel').text('Add Task');
            form[0].reset();
            $('#taskId').val('');
            $('#taskColor').val('#888888');
            $('#taskTimeSpentDisplay').text('0h 0m');
        }

        setTimeout(() => $('#taskTitle').focus(), 500);
        modal.modal('show');
    }

    function saveTask() {
        const form = $('#taskForm');
        const taskId = $('#taskId').val();
        const formData = getFormData();

        if (!validateFormData(formData)) {
            return;
        }

        try {
            if (taskId) {
                updateTask(taskId, formData);
                showToast('Task updated successfully!', 'success');
            } else {
                addTask(formData);
                showToast('Task created successfully!', 'success');
            }

            $('#taskModal').modal('hide');
            refreshCurrentView();
        } catch (error) {
            console.error('Error saving task:', error);
            showToast('Error saving task. Please try again.', 'error');
        }
    }

    function getFormData() {
        return {
            title: $('#taskTitle').val().trim(),
            description: $('#taskDescription').val().trim(),
            category: $('#taskCategory').val().trim(),
            color: $('#taskColor').val(),
            deadline: $('#taskDeadline').val() || null,
            estimatedHours: parseFloat($('#taskEstimatedHours').val()) || 0
        };
    }

    function validateFormData(data) {
        if (!data.title) {
            showToast('Title is required', 'error');
            $('#taskTitle').focus();
            return false;
        }
        return true;
    }

    // ==========================================
    // EVENT HANDLERS
    // ==========================================

    function setupEventHandlers() {
        // View switching
        $('#tableViewBtn').on('click', () => switchView('table'));
        $('#cardViewBtn').on('click', () => switchView('card'));
        $('#listViewBtn').on('click', () => switchView('list'));

        // Add task
        $('#addTaskBtn').on('click', () => openTaskModal());

        // Category filtering
        $('#categoryFilter').on('change', function() {
            const selectedCategory = $(this).val();
            const filteredTasks = filterTasksByCategory(selectedCategory);
            refreshCurrentView(filteredTasks);
        });

        // Dark mode toggle
        $('#darkModeToggle').on('click', toggleDarkMode);

        // Form submission
        $('#taskForm').on('submit', function(e) {
            e.preventDefault();
            saveTask();
        });

        // Task operations
        $(document).on('click', '.edit-task', function() {
            const taskId = $(this).data('task-id');
            openTaskModal(taskId);
        });

        $(document).on('click', '.delete-task', function() {
            const taskId = $(this).data('task-id');
            if (confirm('Are you sure you want to delete this task?')) {
                deleteTask(taskId);
                refreshCurrentView();
                showToast('Task deleted successfully!', 'success');
            }
        });

        $(document).on('change', '.task-status', function() {
            const taskId = $(this).data('task-id');
            const isChecked = $(this).is(':checked');
            toggleTaskStatus(taskId);
            refreshCurrentView();
            showToast(`Task marked as ${isChecked ? 'completed' : 'open'}!`, 'success');
        });
    }

    function switchView(viewType) {
        if (currentView === viewType) return;

        $('.view-toggle').removeClass('active');
        $(`#${viewType}ViewBtn`).addClass('active');

        $('.view-container').removeClass('active');
        $(`#tasks${viewType.charAt(0).toUpperCase() + viewType.slice(1)}Container`).addClass('active');

        currentView = viewType;
        refreshCurrentView();
    }

    function refreshCurrentView(tasksToShow = null) {
        const displayTasks = tasksToShow || tasks;

        switch (currentView) {
            case 'card':
                renderCardView(displayTasks);
                break;
            case 'list':
                renderListView(displayTasks);
                break;
            case 'table':
                refreshTable(displayTasks);
                break;
        }
    }

    // ==========================================
    // GLOBAL UTILITIES
    // ==========================================

    window.showToast = function(message, type = 'success') {
        const toastHtml = `
            <div class="toast align-items-center text-white bg-${type} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body">${message}</div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;

        $('.toast-container').append(toastHtml);
        const toastElement = $('.toast:last')[0];
        const bsToast = new bootstrap.Toast(toastElement);
        bsToast.show();

        setTimeout(() => $(toastElement).remove(), 5000);
    };

    // Make timer functions globally accessible
    window.toggleTimer = toggleTimer;
    window.resetTimer = resetTimer;

    // ==========================================
    // INITIALIZATION
    // ==========================================

    function initialize() {
        loadTasks();
        setupEventHandlers();
        initializeDataTable();
        refreshCurrentView();
        populateCategoryFilter();
        applyDarkMode();
        startBackgroundTimer();
        console.log('✅ Enhanced Application initialized successfully');
    }

    // Start the application
    initialize();
});

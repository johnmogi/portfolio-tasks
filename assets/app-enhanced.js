/**
 * To-Do Portfolio App - Enhanced Version with Tailwind CSS
 * Features: Category filtering, background time tracking, cards default, dark mode, Tailwind UX
 */

$(document).ready(function() {
    console.log('🚀 Enhanced To-Do Portfolio app with Tailwind CSS starting...');

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
                color: '#3b82f6',
                createdAt: now,
                deadline: tomorrow,
                status: 'open',
                estimatedHours: 4,
                timeSpent: 0,
                isTracking: false,
                trackingStartTime: null,
                timeLogs: [] // New: Time logging history
            },
            {
                id: generateId(),
                title: 'Review design mockups',
                description: 'Review and provide feedback on the latest design mockups',
                category: 'Design',
                color: '#10b981',
                createdAt: now,
                deadline: nextWeek,
                status: 'open',
                estimatedHours: 2,
                timeSpent: 0,
                isTracking: false,
                trackingStartTime: null,
                timeLogs: []
            },
            {
                id: generateId(),
                title: 'Team meeting preparation',
                description: 'Prepare agenda and materials for the upcoming team meeting',
                category: 'Work',
                color: '#3b82f6',
                createdAt: now - (2 * 60 * 60 * 1000),
                deadline: null,
                status: 'done',
                estimatedHours: 1,
                timeSpent: 45,
                isTracking: false,
                trackingStartTime: null,
                timeLogs: []
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
    // ENHANCED TIME RECORDING WITH LOGGING
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

                    // Log time every 15 minutes
                    if (elapsed % 15 === 0 && elapsed > 0) {
                        logTime(task.id, elapsed, 'auto');
                    }
                }
            });

            if (hasActiveTimer) {
                saveTasks();
                refreshCurrentView();
            }
        }, 60000); // Check every minute
    }

    function logTime(taskId, minutes, type = 'manual') {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        const logEntry = {
            timestamp: Date.now(),
            minutes: minutes,
            type: type,
            date: new Date().toISOString().split('T')[0]
        };

        if (!task.timeLogs) {
            task.timeLogs = [];
        }
        task.timeLogs.push(logEntry);

        console.log(`⏰ Time logged for task "${task.title}": ${minutes} minutes (${type})`);
    }

    function getTimeLogs(taskId) {
        const task = tasks.find(t => t.id === taskId);
        return task ? task.timeLogs || [] : [];
    }

    function getTimeSpentToday(taskId) {
        const today = new Date().toISOString().split('T')[0];
        const logs = getTimeLogs(taskId);
        return logs
            .filter(log => log.date === today)
            .reduce((total, log) => total + log.minutes, 0);
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

            // Log the time
            logTime(taskId, elapsed, 'stop');

            showToast(`Timer stopped - ${elapsed} minutes logged`, 'info');
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

        if (confirm('Are you sure you want to reset the timer? This will clear all recorded time and logs.')) {
            task.timeSpent = 0;
            task.timeLogs = [];
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

        // Update HTML class
        if (darkMode) {
            $('html').addClass('dark');
        } else {
            $('html').removeClass('dark');
        }

        // Update button icon
        const icon = darkMode ? 'fa-sun' : 'fa-moon';
        const text = darkMode ? 'Light Mode' : 'Dark Mode';
        $('#darkModeToggle').html(`<i class="fas ${icon}"></i><span class="ml-2">${text}</span>`);

        showToast(`Dark mode ${darkMode ? 'enabled' : 'disabled'}`, 'info');
    }

    function applyDarkMode() {
        if (darkMode) {
            $('html').addClass('dark');
        } else {
            $('html').removeClass('dark');
        }

        // Update toggle button
        const icon = darkMode ? 'fa-sun' : 'fa-moon';
        const text = darkMode ? 'Light Mode' : 'Dark Mode';
        $('#darkModeToggle').html(`<i class="fas ${icon}"></i><span class="ml-2">${text}</span>`);
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
                                return `<div class="flex items-center">
                                    <input class="task-status w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" type="checkbox" ${checked}
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
                                const isDone = row.status === 'done' ? 'line-through opacity-75' : '';
                                return `<span class="${isDone} font-medium" title="${row.description || ''}">${data}</span>`;
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
                                const overdueClass = isOverdue ? 'text-red-600 dark:text-red-400 font-semibold' : '';
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
                                    <button class="edit-task bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm mr-2" data-task-id="${row.id}">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="delete-task bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm" data-task-id="${row.id}">
                                        <i class="fas fa-trash"></i>
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
                        return $('<tr class="bg-blue-50 dark:bg-blue-900/20">')
                            .append('<td colspan="6" class="px-6 py-3 text-left text-sm font-medium text-blue-800 dark:text-blue-200"><strong>' + group + '</strong></td>')
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
                <div class="col-span-full text-center py-12">
                    <div class="text-gray-400 dark:text-gray-500 mb-4">
                        <i class="fas fa-tasks text-6xl"></i>
                    </div>
                    <p class="text-lg text-gray-500 dark:text-gray-400">No tasks yet. Click "Add Task" to get started!</p>
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
                <div class="text-center py-12">
                    <div class="text-gray-400 dark:text-gray-500 mb-4">
                        <i class="fas fa-tasks text-4xl"></i>
                    </div>
                    <p class="text-gray-500 dark:text-gray-400">No tasks yet. Click "Add Task" to get started!</p>
                </div>
            `);
            return;
        }

        displayTasks.forEach(task => {
            container.append(createTaskListItem(task));
        });
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
        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            <span class="w-2 h-2 rounded-full mr-2" style="background-color: ${color || '#888888'}"></span>
            ${category}
        </span>`;
    }

    function createTaskCard(task) {
        const timeSpent = task.timeSpent || 0;
        const isTracking = task.isTracking || false;
        const overdue = task.deadline && new Date(task.deadline) < new Date() && task.status === 'open';

        return `
            <div class="task-card group ${task.status === 'done' ? 'completed' : ''}" data-id="${task.id}">
                <div class="space-y-4">
                    <div>
                        <h3 class="task-card-title">${task.title || 'Untitled Task'}</h3>
                        <p class="task-card-description text-sm">${task.description || 'No description'}</p>
                    </div>

                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-2">
                            ${createCategoryBadge(task.category, task.color)}
                            ${overdue ? '<span class="text-red-500 dark:text-red-400">⚠️ Overdue</span>' : ''}
                        </div>
                        <span class="task-card-meta text-sm">${formatDate(task.deadline) || 'No deadline'}</span>
                    </div>

                    ${timeSpent > 0 || isTracking ? `
                        <div class="time-tracker">
                            <div class="time-display">
                                <i class="fas fa-stopwatch"></i>
                                <span>Time: ${formatTimeSpent(timeSpent)}</span>
                                ${isTracking ? '<span class="text-green-500 ml-2">●</span>' : ''}
                            </div>
                            <div class="flex space-x-1">
                                <button class="timer-btn start ${isTracking ? 'stop' : 'start'}"
                                        onclick="toggleTimer('${task.id}')">
                                    ${isTracking ? '<i class="fas fa-stop"></i>' : '<i class="fas fa-play"></i>'}
                                </button>
                                <button class="timer-btn reset"
                                        onclick="resetTimer('${task.id}')"
                                        title="Reset timer">
                                    <i class="fas fa-undo"></i>
                                </button>
                            </div>
                        </div>
                    ` : ''}

                    <div class="task-card-actions">
                        <button class="edit-task bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200" data-task-id="${task.id}">
                            <i class="fas fa-edit mr-1"></i>Edit
                        </button>
                        <button class="delete-task bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200" data-task-id="${task.id}">
                            <i class="fas fa-trash mr-1"></i>Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function createTaskListItem(task) {
        const timeSpent = task.timeSpent || 0;
        const isTracking = task.isTracking || false;

        return `
            <div class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <input class="task-status w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" type="checkbox"
                               data-task-id="${task.id}" ${task.status === 'done' ? 'checked' : ''}>
                        <div>
                            <h4 class="font-medium ${task.status === 'done' ? 'line-through opacity-75' : ''}">${task.title}</h4>
                            <p class="text-sm text-gray-600 dark:text-gray-400">${task.description || 'No description'}</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        ${createCategoryBadge(task.category, task.color)}
                        <div class="flex space-x-2">
                            <button class="edit-task bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm" data-task-id="${task.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="delete-task bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm" data-task-id="${task.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
                ${timeSpent > 0 || isTracking ? `
                    <div class="mt-3 flex items-center justify-between">
                        <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <i class="fas fa-stopwatch mr-2"></i>
                            <span>Time: ${formatTimeSpent(timeSpent)}</span>
                            ${isTracking ? '<span class="text-green-500 ml-2">● Recording</span>' : ''}
                        </div>
                        <div class="flex space-x-1">
                            <button class="timer-btn start ${isTracking ? 'stop' : 'start'} text-xs px-2 py-1"
                                    onclick="toggleTimer('${task.id}')">
                                ${isTracking ? '<i class="fas fa-stop"></i>' : '<i class="fas fa-play"></i>'}
                            </button>
                            <button class="timer-btn reset text-xs px-2 py-1"
                                    onclick="resetTimer('${task.id}')"
                                    title="Reset timer">
                                <i class="fas fa-undo"></i>
                            </button>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
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
            trackingStartTime: null,
            timeLogs: [] // Time logging history
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
            $('#taskColor').val('#3b82f6');
            $('#taskTimeSpentDisplay').text('0h 0m');
        }

        // Show modal
        modal.removeClass('hidden').addClass('flex');
        $('body').addClass('overflow-hidden');
    }

    function closeTaskModal() {
        const modal = $('#taskModal');
        modal.removeClass('flex').addClass('hidden');
        $('body').removeClass('overflow-hidden');
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

            closeTaskModal();
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

        // Modal close
        $('#taskModal').on('click', function(e) {
            if (e.target === this) {
                closeTaskModal();
            }
        });

        // Modal close button
        $('#taskModal .btn-close, #taskModal button[data-bs-dismiss="modal"]').on('click', closeTaskModal);

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

        // Update button states
        $('.view-toggle').removeClass('active');
        $(`#${viewType}ViewBtn`).addClass('active');

        // Hide all view containers
        $('.view-container').addClass('hidden');

        // Show selected view container
        $(`#tasks${viewType.charAt(0).toUpperCase() + viewType.slice(1)}Container`).removeClass('hidden');

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
        const toastContainer = $('.fixed.top-4.right-4.z-50.space-y-2');
        const toastId = 'toast-' + Date.now();

        const toastHtml = `
            <div id="${toastId}" class="bg-white dark:bg-gray-800 border-l-4 border-${type === 'success' ? 'green' : type === 'error' ? 'red' : type === 'warning' ? 'yellow' : 'blue'}-500 rounded-lg shadow-lg p-4 flex items-center max-w-sm">
                <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900 dark:text-gray-100">${message}</p>
                </div>
                <button onclick="hideToast('${toastId}')" class="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        toastContainer.append(toastHtml);

        // Auto hide after 5 seconds
        setTimeout(() => {
            hideToast(toastId);
        }, 5000);
    };

    window.hideToast = function(toastId) {
        $(`#${toastId}`).fadeOut(300, function() {
            $(this).remove();
        });
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
        console.log('✅ Enhanced Application with Tailwind initialized successfully');
    }

    // Start the application
    initialize();
});

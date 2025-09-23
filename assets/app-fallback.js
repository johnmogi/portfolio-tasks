/**
 * To-Do Portfolio App - Fallback Version (No ES6 Modules)
 * Compatible with file:// protocol for direct browser opening
 */

$(document).ready(function() {
    console.log('🚀 To-Do Portfolio app starting (Fallback version)...');

    // ==========================================
    // DATA MANAGEMENT (Embedded)
    // ==========================================

    const STORAGE_KEY = 'todo_portfolio_tasks_v1';
    let tasks = [];

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
            },
            {
                id: generateId(),
                title: 'Update portfolio website',
                description: 'Add new projects and update existing content on portfolio',
                category: 'Personal',
                color: '#dc3545',
                createdAt: now - (24 * 60 * 60 * 1000),
                deadline: nextWeek + (3 * 24 * 60 * 60 * 1000),
                status: 'open',
                estimatedHours: 8,
                timeSpent: 120,
                isTracking: false,
                trackingStartTime: null
            },
            {
                id: generateId(),
                title: 'Learn new JavaScript framework',
                description: 'Study and complete tutorials for the new framework',
                category: 'Learning',
                color: '#ffc107',
                createdAt: now - (3 * 24 * 60 * 60 * 1000),
                deadline: nextWeek + (7 * 24 * 60 * 60 * 1000),
                status: 'open',
                estimatedHours: 16,
                timeSpent: 0,
                isTracking: false,
                trackingStartTime: null
            }
        ];
    }

    // ==========================================
    // VIEW MANAGEMENT (Embedded)
    // ==========================================

    let currentView = 'table';
    let tasksTable = null;

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

    function refreshTable() {
        if (tasksTable) {
            tasksTable.clear();
            if (tasks.length > 0) {
                tasksTable.rows.add(tasks);
            }
            tasksTable.draw();
        }
    }

    function renderCardView() {
        const container = $('#tasksCardGrid');
        container.empty();

        if (tasks.length === 0) {
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

        tasks.forEach(task => {
            container.append(createTaskCard(task));
        });
    }

    function renderListView() {
        const container = $('#tasksList');
        container.empty();

        if (tasks.length === 0) {
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
        tasks.forEach(task => {
            list.append(createTaskListItem(task));
        });
        container.append(list);
    }

    // ==========================================
    // UTILITY FUNCTIONS (Embedded)
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

    // ==========================================
    // TASK OPERATIONS (Embedded)
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
        return newTask;
    }

    function updateTask(taskId, updates) {
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) {
            throw new Error('Task not found');
        }

        tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
        saveTasks();
        return tasks[taskIndex];
    }

    function deleteTask(taskId) {
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) {
            throw new Error('Task not found');
        }

        const deletedTask = tasks.splice(taskIndex, 1)[0];
        saveTasks();
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
    // UI MANAGEMENT (Embedded)
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
        $('#tableViewBtn').on('click', () => switchView('table'));
        $('#cardViewBtn').on('click', () => switchView('card'));
        $('#listViewBtn').on('click', () => switchView('list'));

        $('#addTaskBtn').on('click', () => openTaskModal());

        $('#taskForm').on('submit', function(e) {
            e.preventDefault();
            saveTask();
        });

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

        $(`.view-container`).removeClass('active');
        $(`#tasks${viewType.charAt(0).toUpperCase() + viewType.slice(1)}Container`).addClass('active');

        currentView = viewType;
        refreshCurrentView();
    }

    function refreshCurrentView() {
        switch (currentView) {
            case 'card':
                renderCardView();
                break;
            case 'list':
                renderListView();
                break;
            case 'table':
                refreshTable();
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

    // ==========================================
    // INITIALIZATION
    // ==========================================

    function initialize() {
        loadTasks();
        setupEventHandlers();
        initializeDataTable();
        refreshCurrentView();
        console.log('✅ Application initialized successfully');
    }

    // Start the application
    initialize();
});

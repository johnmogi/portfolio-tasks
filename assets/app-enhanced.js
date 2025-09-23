/**
 * Enhanced To-Do Portfolio Application
 * Advanced time tracking with modal integration
 */

// Global variables
let tasks = [];
let currentView = 'card';
let darkMode = localStorage.getItem('darkMode') === 'true';
let activeTimer = null;
let tasksTable = null;

$(document).ready(function() {
    // ==========================================
    // TIME TRACKING FUNCTIONS
    // ==========================================

    function startBackgroundTimer() {
        // Check every minute for active timers and update display
        setInterval(() => {
            const now = Date.now();
            let hasActiveTimer = false;

            tasks.forEach(task => {
                if (task.isTracking && task.trackingStartTime) {
                    hasActiveTimer = true;
                    const elapsed = Math.floor((now - task.trackingStartTime) / 1000 / 60); // minutes
                    // Only update timeSpent if we have accumulated minutes
                    if (elapsed > 0) {
                        task.timeSpent = (task.timeSpent || 0) + elapsed;
                        task.trackingStartTime = now; // Reset start time to avoid double counting
                    }

                    // Log time every 15 minutes for each active timer
                    const totalElapsed = Math.floor((now - task.trackingStartTime) / 1000 / 60);
                    if (totalElapsed >= 15) {
                        logTime(task.id, 15, 'auto');
                        // Reset tracking start time after logging
                        task.trackingStartTime = now;
                    }
                }
            });

            if (hasActiveTimer) {
                saveTasks();
                refreshCurrentView();
            }
        }, 60000); // Check every minute

        // Live timer display update every second
        setInterval(() => {
            let hasActiveTimers = false;
            const activeCount = tasks.filter(task => task.isTracking && task.trackingStartTime).length;

            // Update active timer count display
            const activeCountElement = $('#activeCount');
            const activeTimersCountElement = $('#activeTimersCount');

            // Update mobile active timer count
            const mobileActiveCountElement = $('#mobileActiveCount');
            const mobileActiveTimersCountElement = $('#mobileActiveTimersCount');

            if (activeCount > 0) {
                activeCountElement.text(activeCount);
                activeTimersCountElement.show();
                mobileActiveCountElement.text(activeCount);
                mobileActiveTimersCountElement.show();
                hasActiveTimers = true;
            } else {
                activeTimersCountElement.hide();
                mobileActiveTimersCountElement.hide();
            }

            tasks.forEach(task => {
                if (task.isTracking && task.trackingStartTime) {
                    hasActiveTimers = true;
                    const elapsedSeconds = Math.floor((Date.now() - task.trackingStartTime) / 1000);
                    const minutes = Math.floor(elapsedSeconds / 60);
                    const seconds = elapsedSeconds % 60;

                    // Update live display for active tracking
                    const timeDisplay = minutes > 0 ?
                        `${minutes}m ${seconds}s` :
                        `${seconds}s`;

                    // Update in all views - show both accumulated time and live time
                    const totalTime = task.timeSpent || 0;
                    const totalMinutes = Math.floor(totalTime / 60);
                    const totalSeconds = totalTime % 60;

                    // Format total time
                    const totalTimeDisplay = totalMinutes > 0 ?
                        `${totalMinutes}h ${totalSeconds}m` :
                        `${totalSeconds}m`;

                    // Update card view
                    $(`.task-card[data-id="${task.id}"] .time-display span`).first().text(`Time: ${totalTimeDisplay} (+${timeDisplay})`);
                    $(`.task-card[data-id="${task.id}"] .time-display .text-red-500`).text('🔴').show();

                    // Update list view
                    $(`.task-list-item[data-id="${task.id}"] .time-display span`).first().text(`Time: ${totalTimeDisplay} (+${timeDisplay})`);

                    // Update table view
                    if (tasksTable) {
                        tasksTable.draw(false); // Refresh table to show updated times
                    }

                    // Update modal if open and task is selected
                    if ($('#taskModal').is(':visible')) {
                        const taskId = $('#taskId').val();
                        if (taskId === task.id) {
                            $('#taskTimeSpentDisplay').text(formatTimeSpent(totalTime));
                            updateLiveTimerDisplay(taskId);
                        }
                    }
                } else {
                    // Hide red dot when not tracking
                    $(`.task-card[data-id="${task.id}"] .time-display .text-red-500`).hide();
                    $(`.task-list-item[data-id="${task.id}"] .time-display .text-red-500`).hide();
                }
            });

            // Update background timer only if there are active timers
            if (hasActiveTimers) {
                saveTasks();
                refreshCurrentView();
            }
        }, 1000); // Update every second for live display
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
        if (!task) {
            showToast('Task not found', 'error');
            return;
        }

        const isCurrentlyTracking = task.isTracking;

        // Allow multiple simultaneous timers - no stopping of other timers
        // Removed: tasks.forEach(t => { if (t.isTracking && t.id !== taskId) stopTimer(t.id); });

        if (isCurrentlyTracking) {
            // Stop the timer
            stopTimer(taskId);
            showToast('Timer stopped', 'success');
        } else {
            // Start the timer
            startTimer(taskId);
            showToast('Timer started', 'success');
        }

        refreshCurrentView();
    }

    function startTimer(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        task.isTracking = true;
        task.trackingStartTime = Date.now();

        // Add initial log entry
        const logEntry = {
            timestamp: Date.now(),
            duration: 0,
            date: new Date().toISOString().split('T')[0],
            type: 'start'
        };

        task.timeLogs.push(logEntry);
        saveTasks();
    }

    function stopTimer(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (!task || !task.isTracking) return;

        const elapsedTime = Date.now() - task.trackingStartTime;
        const elapsedMinutes = Math.floor(elapsedTime / (1000 * 60));

        if (elapsedMinutes > 0) {
            task.timeSpent += elapsedMinutes;

            // Add stop log entry
            const logEntry = {
                timestamp: Date.now(),
                duration: elapsedMinutes,
                date: new Date().toISOString().split('T')[0],
                type: 'stop'
            };

            task.timeLogs.push(logEntry);
        }

        task.isTracking = false;
        task.trackingStartTime = null;
        saveTasks();
    }

    function resetTimer(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) {
            showToast('Task not found', 'error');
            return;
        }

        if (task.isTracking) {
            stopTimer(taskId);
        }

        // Clear all time logs
        task.timeLogs = [];
        task.timeSpent = 0;

        saveTasks();
        refreshCurrentView();
        showToast('Timer reset', 'success');
    }

    // ==========================================
    // DATA MANAGEMENT
    // ==========================================

    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    function loadTasks() {
        const savedTasks = localStorage.getItem('portfolioTasks');
        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
        }
    }

    function saveTasks() {
        localStorage.setItem('portfolioTasks', JSON.stringify(tasks));
    }

    // ==========================================
    // UI FUNCTIONS
    // ==========================================

    function openTaskModal(taskId = null) {
        const modal = $('#taskModal');
        const form = $('#taskForm');

        // Clear any existing errors
        $('.error-message').remove();
        $('.border-red-500').removeClass('border-red-500');

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

        // Update modal timer controls
        updateModalTimerControls();

        // Show modal with improved animation
        modal.removeClass('hidden').addClass('flex');
        modal.hide().fadeIn(200);
        $('body').addClass('overflow-hidden');

        // Focus on title field for better UX
        setTimeout(() => {
            $('#taskTitle').focus();
        }, 100);
    }

    function closeTaskModal() {
        const modal = $('#taskModal');

        // Hide live timer when modal closes
        $('#taskLiveTimerDisplay').hide();

        // Close modal with animation
        modal.fadeOut(200, function() {
            modal.removeClass('flex').addClass('hidden');
            $('body').removeClass('overflow-hidden');
        });
    }

    function updateModalTimerControls() {
        const taskId = $('#taskId').val();
        const hasTask = taskId && tasks.find(t => t.id === taskId);

        const startBtn = $('#modalStartTimer');
        const stopBtn = $('#modalStopTimer');
        const resetBtn = $('#modalResetTimer');
        const liveDisplay = $('#taskLiveTimerDisplay');

        if (taskId && hasTask) {
            // Enable buttons for saved tasks
            startBtn.prop('disabled', false);
            stopBtn.prop('disabled', false);
            resetBtn.prop('disabled', false);

            const task = tasks.find(t => t.id === taskId);
            if (task.isTracking) {
                startBtn.hide();
                stopBtn.show();
                liveDisplay.show();

                // Update live timer display every second when visible
                if (!$('#taskModal').is(':visible')) {
                    updateLiveTimerDisplay(taskId);
                }
            } else {
                startBtn.show();
                stopBtn.hide();
                liveDisplay.hide();
            }
        } else {
            // Disable buttons for unsaved tasks
            startBtn.prop('disabled', true);
            stopBtn.prop('disabled', true);
            resetBtn.prop('disabled', true);

            startBtn.show();
            stopBtn.hide();
            liveDisplay.hide();
        }
    }

    function updateLiveTimerDisplay(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (!task || !task.isTracking || !task.trackingStartTime) return;

        const elapsedSeconds = Math.floor((Date.now() - task.trackingStartTime) / 1000);
        const minutes = Math.floor(elapsedSeconds / 60);
        const seconds = elapsedSeconds % 60;

        const timeDisplay = minutes > 0 ?
            `${minutes}m ${seconds}s` :
            `${seconds}s`;

        $('#taskLiveTimerDisplay').text(`🔴 Recording (${timeDisplay})`);
    }

    function startTimerFromModal() {
        const taskId = $('#taskId').val();
        if (!taskId) {
            showToast('Please save the task first before starting the timer', 'warning');
            return;
        }

        const task = tasks.find(t => t.id === taskId);
        if (!task) {
            showToast('Task not found. Please save the task first.', 'error');
            return;
        }

        toggleTimer(taskId);
        updateModalTimerControls();
    }

    function stopTimerFromModal() {
        const taskId = $('#taskId').val();
        if (!taskId) {
            showToast('Please save the task first before stopping the timer', 'warning');
            return;
        }

        const task = tasks.find(t => t.id === taskId);
        if (!task) {
            showToast('Task not found. Please save the task first.', 'error');
            return;
        }

        toggleTimer(taskId);
        updateModalTimerControls();
    }

    function resetTimerFromModal() {
        const taskId = $('#taskId').val();
        if (!taskId) {
            showToast('Please save the task first before resetting the timer', 'warning');
            return;
        }

        const task = tasks.find(t => t.id === taskId);
        if (!task) {
            showToast('Task not found. Please save the task first.', 'error');
            return;
        }

        resetTimer(taskId);
        updateModalTimerControls();
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

        // Modal close - improved event handling
        $('#taskModal').on('click', function(e) {
            // Only close if clicking directly on the modal backdrop
            if (e.target === this) {
                closeTaskModal();
            }
        });

        // Prevent modal close when clicking on modal content or timer buttons
        $('#taskModal .modal-content, #taskModal form, #taskModal .time-tracker, #taskModal .taskTimerControls, #taskModal button, #taskModal input, #taskModal textarea').on('click', function(e) {
            e.stopPropagation();
        });

        // Modal close button
        $('#taskModal .btn-close, #taskModal button[data-bs-dismiss="modal"]').on('click', closeTaskModal);

        // ESC key to close modal
        $(document).on('keydown', function(e) {
            if (e.key === 'Escape' && $('#taskModal').is(':visible')) {
                closeTaskModal();
            }
        });

        // Prevent modal close when pressing Enter in form fields
        $('#taskForm input, #taskForm textarea').on('keydown', function(e) {
            if (e.key === 'Enter' && !$(this).is('textarea')) {
                e.preventDefault();
            }
        });

        // Category filtering
        $('#categoryFilter').on('change', function() {
            const selectedCategory = $(this).val();
            const filteredTasks = filterTasksByCategory(selectedCategory);
            refreshCurrentView(filteredTasks);
        });

        // Mobile menu toggle
        $('#mobileMenuToggle').on('click', function() {
            const mobileMenu = $('#mobileMenu');
            const isVisible = !mobileMenu.hasClass('hidden');

            if (isVisible) {
                mobileMenu.addClass('hidden');
                $(this).find('i').removeClass('fa-times').addClass('fa-bars');
            } else {
                mobileMenu.removeClass('hidden');
                $(this).find('i').removeClass('fa-bars').addClass('fa-times');
            }
        });

        // Mobile add task button
        $('#mobileAddTaskBtn').on('click', function() {
            openTaskModal();
            // Hide mobile menu after clicking
            $('#mobileMenu').addClass('hidden');
            $('#mobileMenuToggle').find('i').removeClass('fa-times').addClass('fa-bars');
        });

        // Language switcher toggle
        $('#languageToggle').on('click', function(e) {
            e.stopPropagation();
            const languageMenu = $('#languageMenu');
            const isVisible = !languageMenu.hasClass('hidden');

            // Hide mobile menu if open
            $('#mobileMenu').addClass('hidden');
            $('#mobileMenuToggle').find('i').removeClass('fa-times').addClass('fa-bars');

            if (isVisible) {
                languageMenu.addClass('hidden');
                $(this).removeClass('text-gray-200').addClass('hover:text-gray-200');
            } else {
                languageMenu.removeClass('hidden');
                $(this).addClass('text-gray-200').removeClass('hover:text-gray-200');
            }
        });

        // Language selection
        $('#langEn, #langEs, #langFr').on('click', function() {
            const lang = $(this).attr('id').replace('lang', '').toLowerCase();
            switchLanguage(lang);
            $('#languageMenu').addClass('hidden');
            $('#languageToggle').removeClass('text-gray-200').addClass('hover:text-gray-200');
        });

        // Close language menu when clicking outside
        $(document).on('click', function(e) {
            if (!$(e.target).closest('#languageToggle, #languageMenu').length) {
                $('#languageMenu').addClass('hidden');
                $('#languageToggle').removeClass('text-gray-200').addClass('hover:text-gray-200');
            }
        });

        // Form submission
        $('#taskForm').on('submit', function(e) {
            e.preventDefault();
            saveTask();
        });

        // Task operations
        $(document).on('click', '.edit-task', function(e) {
            e.stopPropagation();
            const taskId = $(this).data('task-id');
            openTaskModal(taskId);
        });

        $(document).on('click', '.delete-task', function(e) {
            e.stopPropagation();
            const taskId = $(this).data('task-id');
            if (confirm('Are you sure you want to delete this task?')) {
                deleteTask(taskId);
                refreshCurrentView();
                showToast('Task deleted successfully!', 'success');
            }
        });

        $(document).on('change', '.task-status', function(e) {
            e.stopPropagation();
            const taskId = $(this).data('task-id');
            const isChecked = $(this).is(':checked');
            toggleTaskStatus(taskId);
            refreshCurrentView();
            showToast(`Task marked as ${isChecked ? 'completed' : 'open'}!`, 'success');
        });
    }

    // ==========================================
    // VIEW MANAGEMENT
    // ==========================================

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
    // RENDERING FUNCTIONS
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

    function createTaskCard(task) {
        const timeSpent = task.timeSpent || 0;
        const isTracking = task.isTracking || false;
        const overdue = task.deadline && new Date(task.deadline) < new Date() && task.status === 'open';

        return `
            <div class="task-card group ${task.status === 'done' ? 'completed' : ''} cursor-pointer hover:shadow-lg transition-all duration-200" data-id="${task.id}" onclick="openTaskModal('${task.id}')">
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

                    <div class="time-tracker" ${timeSpent > 0 || isTracking ? '' : 'style="opacity: 0.7;"'}>
                        <div class="time-display">
                            <i class="fas fa-stopwatch"></i>
                            <span>Time: ${formatTimeSpent(timeSpent)}</span>
                            ${isTracking ? '<span class="text-red-500 ml-2">🔴</span>' : ''}
                        </div>
                        <div class="flex space-x-1">
                            <button class="timer-btn start ${isTracking ? 'stop' : 'start'}"
                                    onclick="event.stopPropagation(); toggleTimer('${task.id}')">
                                ${isTracking ? '<i class="fas fa-stop"></i>' : '<i class="fas fa-play"></i>'}
                            </button>
                            <button class="timer-btn reset"
                                    onclick="event.stopPropagation(); resetTimer('${task.id}')"
                                    title="Reset timer">
                                <i class="fas fa-undo"></i>
                            </button>
                        </div>
                    </div>

                    <div class="task-card-actions" onclick="event.stopPropagation()">
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
            <div class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 task-list-item cursor-pointer" data-id="${task.id}" onclick="openTaskModal('${task.id}')">
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
                        <div class="flex space-x-2" onclick="event.stopPropagation()">
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
                            ${isTracking ? '<span class="text-red-500 ml-2">🔴</span>' : ''}
                        </div>
                        <div class="flex space-x-1" onclick="event.stopPropagation()">
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

                <div class="mt-3 flex items-center justify-between" ${timeSpent > 0 || isTracking ? '' : 'style="opacity: 0.7;"'}>
                    <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <i class="fas fa-stopwatch mr-2"></i>
                        <span>Time: ${formatTimeSpent(timeSpent)}</span>
                        ${isTracking ? '<span class="text-red-500 ml-2">🔴</span>' : ''}
                    </div>
                    <div class="flex space-x-1" onclick="event.stopPropagation()">
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

    function switchLanguage(lang) {
        // Store current language preference
        localStorage.setItem('selectedLanguage', lang);

        // Language translations (can be expanded)
        const translations = {
            en: {
                title: 'To-Do Portfolio',
                addTask: 'Add Task',
                activeTimers: 'active',
                filterCategory: 'Filter by Category',
                allCategories: 'All Categories',
                noTasks: 'No tasks yet. Click "Add Task" to get started!',
                editTask: 'Edit Task',
                addEditTask: 'Add/Edit Task',
                titleLabel: 'Title *',
                descriptionLabel: 'Description',
                categoryLabel: 'Category',
                colorLabel: 'Color',
                deadlineLabel: 'Deadline',
                estimatedHoursLabel: 'Estimated Hours',
                timeSpentLabel: 'Time Spent',
                saveTask: 'Save Task',
                cancel: 'Cancel',
                delete: 'Delete',
                edit: 'Edit',
                start: 'Start',
                stop: 'Stop',
                reset: 'Reset',
                recording: 'Recording',
                hours: 'hours',
                minutes: 'minutes',
                success: 'Success',
                error: 'Error',
                warning: 'Warning'
            },
            es: {
                title: 'Portafolio de Tareas',
                addTask: 'Agregar Tarea',
                activeTimers: 'activos',
                filterCategory: 'Filtrar por Categoría',
                allCategories: 'Todas las Categorías',
                noTasks: 'No hay tareas aún. Haz clic en "Agregar Tarea" para comenzar!',
                editTask: 'Editar Tarea',
                addEditTask: 'Agregar/Editar Tarea',
                titleLabel: 'Título *',
                descriptionLabel: 'Descripción',
                categoryLabel: 'Categoría',
                colorLabel: 'Color',
                deadlineLabel: 'Fecha Límite',
                estimatedHoursLabel: 'Horas Estimadas',
                timeSpentLabel: 'Tiempo Empleado',
                saveTask: 'Guardar Tarea',
                cancel: 'Cancelar',
                delete: 'Eliminar',
                edit: 'Editar',
                start: 'Iniciar',
                stop: 'Detener',
                reset: 'Reiniciar',
                recording: 'Grabando',
                hours: 'horas',
                minutes: 'minutos',
                success: 'Éxito',
                error: 'Error',
                warning: 'Advertencia'
            },
            fr: {
                title: 'Portefeuille de Tâches',
                addTask: 'Ajouter une Tâche',
                activeTimers: 'actifs',
                filterCategory: 'Filtrer par Catégorie',
                allCategories: 'Toutes les Catégories',
                noTasks: 'Aucune tâche pour le moment. Cliquez sur "Ajouter une Tâche" pour commencer!',
                editTask: 'Modifier la Tâche',
                addEditTask: 'Ajouter/Modifier la Tâche',
                titleLabel: 'Titre *',
                descriptionLabel: 'Description',
                categoryLabel: 'Catégorie',
                colorLabel: 'Couleur',
                deadlineLabel: 'Date Limite',
                estimatedHoursLabel: 'Heures Estimées',
                timeSpentLabel: 'Temps Passé',
                saveTask: 'Sauvegarder la Tâche',
                cancel: 'Annuler',
                delete: 'Supprimer',
                edit: 'Modifier',
                start: 'Démarrer',
                stop: 'Arrêter',
                reset: 'Réinitialiser',
                recording: 'Enregistrement',
                hours: 'heures',
                minutes: 'minutes',
                success: 'Succès',
                error: 'Erreur',
                warning: 'Avertissement'
            }
        };

        const langData = translations[lang] || translations.en;

        // Update UI text (basic implementation - can be expanded)
        document.title = langData.title;
        $('.brand-title, h1').text(langData.title);
        $('#addTaskBtn span').text(langData.addTask);
        $('#mobileAddTaskBtn span').text(langData.addTask);

        // Store current language for persistence
        showToast(`Language switched to ${langData.title}`, 'success');

        console.log(`🌐 Language switched to: ${lang}`);
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
    // DATATABLE INTEGRATION
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
                        data: 'timeSpent',
                        title: 'Time',
                        width: '120px',
                        orderable: false,
                        render: function(data, type, row) {
                            if (type === 'display') {
                                const timeSpent = data || 0;
                                const isTracking = row.isTracking || false;
                                const totalMinutes = Math.floor(timeSpent / 60);
                                const totalSeconds = timeSpent % 60;

                                // Format total time
                                const totalTimeDisplay = totalMinutes > 0 ?
                                    `${totalMinutes}h ${totalSeconds}m` :
                                    `${totalSeconds}m`;

                                // Show live time if currently tracking
                                if (isTracking && row.trackingStartTime) {
                                    const elapsedSeconds = Math.floor((Date.now() - row.trackingStartTime) / 1000);
                                    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
                                    const elapsedSecs = elapsedSeconds % 60;
                                    const liveTimeDisplay = elapsedMinutes > 0 ?
                                        `${elapsedMinutes}m ${elapsedSecs}s` :
                                        `${elapsedSecs}s`;

                                    return `
                                        <div class="flex flex-col items-center space-y-1">
                                            <div class="flex items-center text-sm ${isTracking ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}">
                                                <i class="fas fa-stopwatch mr-1"></i>
                                                <span>${totalTimeDisplay} (+${liveTimeDisplay})</span>
                                                ${isTracking ? '<span class="text-red-500 ml-1">🔴</span>' : ''}
                                            </div>
                                            <div class="flex space-x-1">
                                                <button class="timer-btn start ${isTracking ? 'stop' : 'start'} text-xs px-1 py-0.5"
                                                        onclick="event.stopPropagation(); toggleTimer('${row.id}')">
                                                    ${isTracking ? '<i class="fas fa-stop text-xs"></i>' : '<i class="fas fa-play text-xs"></i>'}
                                                </button>
                                                <button class="timer-btn reset text-xs px-1 py-0.5"
                                                        onclick="event.stopPropagation(); resetTimer('${row.id}')"
                                                        title="Reset timer">
                                                    <i class="fas fa-undo text-xs"></i>
                                                </button>
                                            </div>
                                        </div>
                                    `;
                                } else {
                                    return `
                                        <div class="flex flex-col items-center space-y-1">
                                            <div class="flex items-center text-sm ${isTracking ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}">
                                                <i class="fas fa-stopwatch mr-1"></i>
                                                <span>${totalTimeDisplay}</span>
                                                ${isTracking ? '<span class="text-red-500 ml-1">🔴</span>' : ''}
                                            </div>
                                            <div class="flex space-x-1">
                                                <button class="timer-btn start ${isTracking ? 'stop' : 'start'} text-xs px-1 py-0.5"
                                                        onclick="event.stopPropagation(); toggleTimer('${row.id}')">
                                                    ${isTracking ? '<i class="fas fa-stop text-xs"></i>' : '<i class="fas fa-play text-xs"></i>'}
                                                </button>
                                                <button class="timer-btn reset text-xs px-1 py-0.5"
                                                        onclick="event.stopPropagation(); resetTimer('${row.id}')"
                                                        title="Reset timer">
                                                    <i class="fas fa-undo text-xs"></i>
                                                </button>
                                            </div>
                                        </div>
                                    `;
                                }
                            }
                            return data || 0;
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

    // Make all functions globally accessible for HTML onclick attributes
    window.toggleTimer = toggleTimer;
    window.resetTimer = resetTimer;
    window.startTimer = startTimer;
    window.stopTimer = stopTimer;

    // Modal functions
    window.openTaskModal = openTaskModal;
    window.closeTaskModal = closeTaskModal;
    window.updateModalTimerControls = updateModalTimerControls;
    window.startTimerFromModal = startTimerFromModal;
    window.stopTimerFromModal = stopTimerFromModal;
    window.resetTimerFromModal = resetTimerFromModal;

    // Utility functions
    window.showToast = showToast;
    window.hideToast = hideToast;

    // Language and UI functions
    window.switchLanguage = switchLanguage;
    window.toggleDarkMode = toggleDarkMode;

    // Make sure these are accessible
    if (typeof startTimerFromModal === 'undefined') {
        console.error('startTimerFromModal is not defined');
    }
    if (typeof stopTimerFromModal === 'undefined') {
        console.error('stopTimerFromModal is not defined');
    }
    if (typeof resetTimerFromModal === 'undefined') {
        console.error('resetTimerFromModal is not defined');
    }

    console.log('✅ All modal timer functions are now globally accessible');

    // Debug function
    window.getTimerStatus = function() {
        console.log('=== DETAILED TIMER STATUS DEBUG ===');
        const now = Date.now();
        tasks.forEach(task => {
            console.log(`\n📋 Task: "${task.title}" (ID: ${task.id})`);
            console.log(`   Status: ${task.status}`);
            console.log(`   isTracking: ${task.isTracking}`);
            console.log(`   trackingStartTime: ${task.trackingStartTime ? new Date(task.trackingStartTime).toLocaleTimeString() : 'null'}`);
            console.log(`   timeSpent: ${task.timeSpent || 0} minutes`);

            if (task.isTracking && task.trackingStartTime) {
                const elapsedSeconds = Math.floor((now - task.trackingStartTime) / 1000);
                const elapsedMinutes = Math.floor(elapsedSeconds / 60);
                const remainingSeconds = elapsedSeconds % 60;
                console.log(`   🔴 CURRENTLY TRACKING:`);
                console.log(`      - Elapsed: ${elapsedMinutes}m ${remainingSeconds}s`);
                console.log(`      - Since: ${new Date(task.trackingStartTime).toLocaleTimeString()}`);
            }

            if (task.timeLogs && task.timeLogs.length > 0) {
                console.log(`   📊 Recent logs:`);
                task.timeLogs.slice(-3).forEach((log, i) => {
                    console.log(`      ${i+1}. ${log.minutes}min (${log.type}) - ${new Date(log.timestamp).toLocaleTimeString()}`);
                });
            }
        });
        console.log('\n=== END DEBUG INFO ===');
    };

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

        // Load saved language preference
        const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
        if (savedLanguage !== 'en') {
            switchLanguage(savedLanguage);
        }

        startBackgroundTimer();
        console.log('✅ Enhanced Application with Mobile Menu & Language Switcher initialized successfully');
    }

    // Start the application
    initialize();
});

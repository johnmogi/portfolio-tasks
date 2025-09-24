// ==========================================
// MODULAR APP - CLEAN MAIN FILE
// ==========================================

$(document).ready(function() {
    console.log('🚀 Modular To-Do Portfolio App Starting...');

    // ==========================================
    // INITIALIZATION
    // ==========================================

    function initialize() {
        // Load saved preferences
        const savedView = localStorage.getItem('currentView') || 'card';
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';

        currentView = savedView;
        darkMode = savedDarkMode;
        selectedLanguage = savedLanguage;

        // Apply preferences
        applyDarkMode();
        switchLanguage(savedLanguage);

        // Initialize UI
        refreshCurrentView();
        populateCategoryFilter();

        // Initialize DataTable if in table view
        if (currentView === 'table') {
            initializeDataTable();
        }

        startBackgroundTimer();
        console.log('✅ Modular Application initialized successfully');
    }

    // ==========================================
    // EVENT HANDLERS
    // ==========================================

    // View switching
    $('#cardViewBtn').on('click', () => switchView('card'));
    $('#listViewBtn').on('click', () => switchView('list'));
    $('#tableViewBtn').on('click', () => switchView('table'));

    // Category filtering
    $('#categoryFilter').on('change', function() {
        const category = $(this).val();
        filterTasksByCategory(category);
    });

    // Add task button
    $('#addTaskBtn').on('click', () => openTaskModal());

    // Modal form submission
    $('#taskForm').on('submit', function(e) {
        e.preventDefault();

        const taskData = {
            title: $('#taskTitle').val(),
            description: $('#taskDescription').val(),
            category: $('#taskCategory').val(),
            color: $('#taskColor').val(),
            deadline: $('#taskDeadline').val()
        };

        if (currentTaskId) {
            // Update existing task
            updateTask(currentTaskId, taskData);
            showToast('Task updated successfully!', 'success');
        } else {
            // Add new task
            addTask(taskData);
            showToast('Task added successfully!', 'success');
        }

        closeTaskModal();
    });

    // Modal cancel button
    $('#modalCancelBtn').on('click', closeTaskModal);

    // Task status toggle
    $(document).on('change', '.task-status', function() {
        const taskId = $(this).data('task-id');
        toggleTaskStatus(taskId);
    });

    // Edit task buttons
    $(document).on('click', '.edit-task', function(e) {
        e.stopPropagation();
        const taskId = $(this).data('task-id');
        openTaskModal(taskId);
    });

    // Delete task buttons
    $(document).on('click', '.delete-task', function(e) {
        e.stopPropagation();
        const taskId = $(this).data('task-id');

        if (confirm('Are you sure you want to delete this task?')) {
            deleteTask(taskId);
            showToast('Task deleted successfully!', 'success');
        }
    });

    // Dark mode toggle
    $('#darkModeToggle').on('click', toggleDarkMode);

    // Language switcher
    $('#languageSelect').on('change', function() {
        const lang = $(this).val();
        switchLanguage(lang);
    });

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

    // Debug function
    window.getTimerStatus = getTimerStatus;

    console.log('✅ Event handlers registered successfully');

    // Start the application
    initialize();
});

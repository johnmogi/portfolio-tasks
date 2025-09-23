/**
 * To-Do Portfolio App - Main Entry Point
 * A modular, well-structured task management application
 */

$(document).ready(function() {
    console.log('🚀 To-Do Portfolio app starting...');

    // ==========================================
    // APPLICATION INITIALIZATION
    // ==========================================

    let currentView = 'table';
    let tasksTable = null;

    // Initialize the application
    async function initializeApp() {
        try {
            // Import and initialize modules
            const { TaskManager } = await import('./modules/data-manager.js');
            const { ViewManager } = await import('./modules/view-manager.js');
            const { UIManager } = await import('./modules/ui-manager.js');

            // Initialize core modules
            const taskManager = new TaskManager();
            const viewManager = new ViewManager();
            const uiManager = new UIManager(taskManager, viewManager);

            // Set up global event handlers
            setupEventHandlers(taskManager, viewManager, uiManager);

            // Initialize views
            await viewManager.initialize(currentView);
            uiManager.updateView(currentView);

            console.log('✅ Application initialized successfully');

        } catch (error) {
            console.error('❌ Failed to initialize application:', error);
            alert('Failed to initialize the application. Please refresh the page.');
        }
    }

    // ==========================================
    // EVENT HANDLERS
    // ==========================================

    function setupEventHandlers(taskManager, viewManager, uiManager) {
        // View switching
        $('#tableViewBtn').on('click', () => switchView('table', viewManager, uiManager));
        $('#cardViewBtn').on('click', () => switchView('card', viewManager, uiManager));
        $('#listViewBtn').on('click', () => switchView('list', viewManager, uiManager));

        // Task operations
        $('#addTaskBtn').on('click', () => uiManager.openTaskModal());

        // Modal form submission
        $('#taskForm').on('submit', function(e) {
            e.preventDefault();
            uiManager.saveTask();
        });

        // Global task event handlers (delegated)
        $(document).on('click', '.edit-task', function() {
            const taskId = $(this).data('task-id');
            uiManager.openTaskModal(taskId);
        });

        $(document).on('click', '.delete-task', function() {
            const taskId = $(this).data('task-id');
            uiManager.deleteTask(taskId);
        });

        $(document).on('change', '.task-status', function() {
            const taskId = $(this).data('task-id');
            const isChecked = $(this).is(':checked');
            uiManager.toggleTaskStatus(taskId, isChecked);
        });
    }

    function switchView(viewType, viewManager, uiManager) {
        if (currentView === viewType) return;

        currentView = viewType;
        uiManager.updateView(viewType);
        viewManager.renderView(viewType);
    }

    // ==========================================
    // GLOBAL UTILITY FUNCTIONS
    // ==========================================

    // Make utility functions globally accessible
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
    // START APPLICATION
    // ==========================================

    initializeApp();
});

/**
 * UI Manager Module
 * Handles all user interactions and UI operations
 */

import { formatTimeSpent } from './utils.js';

class UIManager {
    constructor(taskManager, viewManager) {
        this.taskManager = taskManager;
        this.viewManager = viewManager;
    }

    // ==========================================
    // TASK MODAL OPERATIONS
    // ==========================================

    openTaskModal(taskId = null) {
        const modal = $('#taskModal');
        const form = $('#taskForm');

        if (taskId) {
            // Edit mode
            const task = this.taskManager.getTaskById(taskId);
            if (!task) {
                window.showToast('Task not found', 'error');
                return;
            }

            this.populateEditForm(task);
        } else {
            // Add mode
            this.populateAddForm();
        }

        // Focus first input
        setTimeout(() => $('#taskTitle').focus(), 500);
        modal.modal('show');
    }

    populateEditForm(task) {
        $('#taskModalLabel').text('Edit Task');
        $('#taskId').val(task.id);
        $('#taskTitle').val(task.title);
        $('#taskDescription').val(task.description);
        $('#taskCategory').val(task.category);
        $('#taskColor').val(task.color);
        $('#taskDeadline').val(task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : '');
        $('#taskEstimatedHours').val(task.estimatedHours || '');
        $('#taskTimeSpentDisplay').text(formatTimeSpent(task.timeSpent || 0));
    }

    populateAddForm() {
        $('#taskModalLabel').text('Add Task');
        $('#taskForm')[0].reset();
        $('#taskId').val('');
        $('#taskColor').val('#888888');
        $('#taskTimeSpentDisplay').text('0h 0m');
    }

    // ==========================================
    // TASK OPERATIONS
    // ==========================================

    saveTask() {
        const form = $('#taskForm');
        const taskId = $('#taskId').val();
        const formData = this.getFormData();

        // Validation
        if (!this.validateFormData(formData)) {
            return;
        }

        try {
            if (taskId) {
                this.taskManager.updateTask(taskId, formData);
                window.showToast('Task updated successfully!', 'success');
            } else {
                this.taskManager.addTask(formData);
                window.showToast('Task created successfully!', 'success');
            }

            // Close modal and refresh views
            $('#taskModal').modal('hide');
            this.refreshViews();

        } catch (error) {
            console.error('Error saving task:', error);
            window.showToast('Error saving task. Please try again.', 'error');
        }
    }

    deleteTask(taskId) {
        const task = this.taskManager.getTaskById(taskId);
        if (!task) {
            window.showToast('Task not found', 'error');
            return;
        }

        if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
            try {
                this.taskManager.deleteTask(taskId);
                this.refreshViews();
                window.showToast('Task deleted successfully!', 'success');
            } catch (error) {
                console.error('Error deleting task:', error);
                window.showToast('Error deleting task. Please try again.', 'error');
            }
        }
    }

    toggleTaskStatus(taskId, isDone) {
        try {
            const task = this.taskManager.toggleTaskStatus(taskId);
            this.refreshViews();
            window.showToast(`Task marked as ${task.status === 'done' ? 'completed' : 'open'}!`, 'success');
        } catch (error) {
            console.error('Error toggling task status:', error);
            window.showToast('Error updating task status. Please try again.', 'error');
        }
    }

    // ==========================================
    // HELPER METHODS
    // ==========================================

    getFormData() {
        return {
            title: $('#taskTitle').val().trim(),
            description: $('#taskDescription').val().trim(),
            category: $('#taskCategory').val().trim(),
            color: $('#taskColor').val(),
            deadline: $('#taskDeadline').val() || null,
            estimatedHours: parseFloat($('#taskEstimatedHours').val()) || 0
        };
    }

    validateFormData(data) {
        if (!data.title) {
            window.showToast('Title is required', 'error');
            $('#taskTitle').focus();
            return false;
        }

        if (data.deadline && !this.isValidDate(data.deadline)) {
            window.showToast('Please enter a valid deadline', 'error');
            $('#taskDeadline').focus();
            return false;
        }

        return true;
    }

    isValidDate(dateString) {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    }

    refreshViews() {
        const tasks = this.taskManager.getTasks();
        this.viewManager.renderView(this.viewManager.currentView, tasks);
    }

    updateView(viewType) {
        this.viewManager.updateActiveView(viewType);
    }

    // ==========================================
    // EXPORT/IMPORT OPERATIONS
    // ==========================================

    exportTasks() {
        const tasks = this.taskManager.getTasks();
        const dataStr = JSON.stringify(tasks, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `todo-portfolio-${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        URL.revokeObjectURL(link.href);
        window.showToast('Tasks exported successfully!', 'success');
    }

    async importTasks(file) {
        try {
            const text = await file.text();
            const importedTasks = JSON.parse(text);

            if (!Array.isArray(importedTasks)) {
                throw new Error('Invalid file format');
            }

            // Validate imported tasks
            const validTasks = importedTasks.filter(task =>
                task.title && task.id && typeof task === 'object'
            );

            if (validTasks.length === 0) {
                throw new Error('No valid tasks found in file');
            }

            // Confirm import
            if (confirm(`Import ${validTasks.length} tasks? This will replace all existing tasks.`)) {
                // Replace current tasks
                this.taskManager.tasks = validTasks;
                this.taskManager.saveTasks();
                this.refreshViews();
                window.showToast(`Successfully imported ${validTasks.length} tasks!`, 'success');
            }
        } catch (error) {
            console.error('Error importing tasks:', error);
            window.showToast('Error importing tasks. Please check the file format.', 'error');
        }
    }
}

export { UIManager };

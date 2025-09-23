/**
 * View Manager Module
 * Handles all view rendering and switching logic
 */

import { formatDate, formatTimeSpent, createCategoryBadge } from './utils.js';

class ViewManager {
    constructor() {
        this.tasksTable = null;
        this.currentView = 'table';
    }

    // ==========================================
    // INITIALIZATION
    // ==========================================

    async initialize(initialView = 'table') {
        this.currentView = initialView;
        await this.initializeDataTable();
        console.log('🔄 View manager initialized');
    }

    async initializeDataTable() {
        // Dynamic import to ensure DOM is ready
        return new Promise((resolve) => {
            if (typeof $ !== 'undefined' && $('#tasksTable').length) {
                this.tasksTable = $('#tasksTable').DataTable({
                    columns: [
                        {
                            data: 'status',
                            title: 'Status',
                            width: '80px',
                            orderable: false,
                            render: (data, type, row) => {
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
                            render: (data, type, row) => {
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
                            render: (data, type, row) => {
                                if (type === 'display') {
                                    return createCategoryBadge(data, row.color);
                                }
                                return data || '';
                            }
                        },
                        {
                            data: 'deadline',
                            title: 'Deadline',
                            render: (data, type, row) => {
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
                            render: (data, type, row) => {
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
                            render: (data, type, row) => {
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
                    order: [[3, 'asc']], // Sort by deadline
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
                resolve();
            } else {
                setTimeout(() => resolve(this.initializeDataTable()), 100);
            }
        });
    }

    // ==========================================
    // VIEW RENDERING
    // ==========================================

    renderView(viewType, tasks = []) {
        this.currentView = viewType;

        switch (viewType) {
            case 'card':
                this.renderCardView(tasks);
                break;
            case 'list':
                this.renderListView(tasks);
                break;
            case 'table':
            default:
                this.refreshTable(tasks);
                break;
        }
    }

    renderCardView(tasks) {
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
            container.append(this.createTaskCard(task));
        });
    }

    renderListView(tasks) {
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
            list.append(this.createTaskListItem(task));
        });
        container.append(list);
    }

    refreshTable(tasks) {
        if (this.tasksTable) {
            this.tasksTable.clear();
            if (tasks.length > 0) {
                this.tasksTable.rows.add(tasks);
            }
            this.tasksTable.draw();
        }
    }

    // ==========================================
    // HELPER METHODS
    // ==========================================

    createTaskCard(task) {
        return `
            <div class="col-md-4 mb-4 task-card" data-id="${task.id}">
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

    createTaskListItem(task) {
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
    // VIEW MANAGEMENT
    // ==========================================

    updateActiveView(viewType) {
        // Update button states
        $('.view-toggle').removeClass('active');
        $(`#${viewType}ViewBtn`).addClass('active');

        // Show/hide containers
        const containers = ['table', 'card', 'list'];
        containers.forEach(container => {
            $(`#tasks${container.charAt(0).toUpperCase() + container.slice(1)}Container`)
                .toggleClass('d-none', container !== viewType);
        });
    }
}

export { ViewManager };

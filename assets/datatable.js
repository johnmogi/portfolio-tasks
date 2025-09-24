// ==========================================
// DATATABLE MODULE
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

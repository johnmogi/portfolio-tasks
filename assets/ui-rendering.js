// ==========================================
// UI RENDERING MODULE
// ==========================================

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

function formatTimeSpent(minutes) {
    if (!minutes) return '0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
        return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
}

function createCategoryBadge(category, color) {
    const colorMap = {
        work: 'blue',
        personal: 'green',
        urgent: 'red'
    };
    const badgeColor = colorMap[color] || 'gray';
    return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${badgeColor}-100 text-${badgeColor}-800 dark:bg-${badgeColor}-900 dark:text-${badgeColor}-200">${category || 'uncategorized'}</span>`;
}

function switchView(viewType) {
    currentView = viewType;
    localStorage.setItem('currentView', viewType);
    refreshCurrentView();
}

function refreshCurrentView(tasksToShow = null) {
    const displayTasks = tasksToShow || tasks;

    if (currentView === 'card') {
        renderCardView(displayTasks);
    } else {
        renderListView(displayTasks);
    }
}

function renderCardView(tasksToShow = null) {
    const displayTasks = tasksToShow || tasks;
    const container = $('#tasksContainer');
    container.empty();

    if (displayTasks.length === 0) {
        container.html(`<div class="text-center py-8 text-gray-500 dark:text-gray-400"><i class="fas fa-tasks text-4xl mb-4"></i><p>${getTranslation('noTasks')}</p></div>`);
        return;
    }

    displayTasks.forEach(task => {
        const card = createTaskCard(task);
        container.append(card);
    });
}

function renderListView(tasksToShow = null) {
    const displayTasks = tasksToShow || tasks;
    const container = $('#tasksContainer');
    container.empty();

    if (displayTasks.length === 0) {
        container.html(`<div class="text-center py-8 text-gray-500 dark:text-gray-400"><i class="fas fa-list text-4xl mb-4"></i><p>${getTranslation('noTasks')}</p></div>`);
        return;
    }

    const tableHtml = `
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Deadline</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    ${displayTasks.map(task => createTaskListItem(task)).join('')}
                </tbody>
            </table>
        </div>
    `;

    container.html(tableHtml);
}

function createTaskCard(task) {
    const isDone = task.status === 'done' ? 'line-through opacity-75' : '';
    const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status === 'open';
    const overdueClass = isOverdue ? 'text-red-600 dark:text-red-400 font-semibold' : '';
    const timeSpent = task.timeSpent || 0;
    const isTracking = task.isTracking || false;
    const totalMinutes = Math.floor(timeSpent / 60);
    const totalSeconds = timeSpent % 60;
    const totalTimeDisplay = totalMinutes > 0 ? `${totalMinutes}h ${totalSeconds}m` : `${totalSeconds}m`;

    let liveTimeDisplay = '';
    if (isTracking && task.trackingStartTime) {
        const elapsedSeconds = Math.floor((Date.now() - task.trackingStartTime) / 1000);
        const elapsedMinutes = Math.floor(elapsedSeconds / 60);
        const elapsedSecs = elapsedSeconds % 60;
        liveTimeDisplay = elapsedMinutes > 0 ? `${elapsedMinutes}m ${elapsedSecs}s` : `${elapsedSecs}s`;
    }

    return `
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 mb-4">
            <div class="flex items-start justify-between">
                <div class="flex items-center">
                    <input class="task-status w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mr-3"
                           type="checkbox" ${task.status === 'done' ? 'checked' : ''}
                           data-task-id="${task.id}">
                    <div>
                        <h3 class="text-lg font-semibold ${isDone} ${overdueClass}">${task.title}</h3>
                        ${task.description ? `<p class="text-gray-600 dark:text-gray-400 mt-1">${task.description}</p>` : ''}
                    </div>
                </div>
                <div class="flex space-x-2">
                    <button class="edit-task bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm" data-task-id="${task.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-task bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm" data-task-id="${task.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>

            <div class="mt-4 flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    ${createCategoryBadge(task.category, task.color)}
                    ${task.deadline ? `<span class="text-sm text-gray-500 dark:text-gray-400">Due: ${formatDate(task.deadline)}</span>` : ''}
                </div>

                <div class="flex items-center space-x-2">
                    <div class="flex items-center text-sm ${isTracking ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}">
                        <i class="fas fa-stopwatch mr-1"></i>
                        <span>${totalTimeDisplay}${liveTimeDisplay ? ` (+${liveTimeDisplay})` : ''}</span>
                        ${isTracking ? '<span class="text-red-500 ml-1">🔴</span>' : ''}
                    </div>
                    <button class="timer-btn start ${isTracking ? 'stop' : 'start'} text-xs px-2 py-1 rounded"
                            onclick="toggleTimer('${task.id}')">
                        ${isTracking ? '<i class="fas fa-stop text-xs"></i>' : '<i class="fas fa-play text-xs"></i>'}
                    </button>
                    <button class="timer-btn reset text-xs px-2 py-1 rounded"
                            onclick="resetTimer('${task.id}')"
                            title="Reset timer">
                        <i class="fas fa-undo text-xs"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function createTaskListItem(task) {
    const isDone = task.status === 'done' ? 'line-through opacity-75' : '';
    const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status === 'open';
    const overdueClass = isOverdue ? 'text-red-600 dark:text-red-400 font-semibold' : '';
    const timeSpent = task.timeSpent || 0;
    const isTracking = task.isTracking || false;
    const totalMinutes = Math.floor(timeSpent / 60);
    const totalSeconds = timeSpent % 60;
    const totalTimeDisplay = totalMinutes > 0 ? `${totalMinutes}h ${totalSeconds}m` : `${totalSeconds}m`;

    let liveTimeDisplay = '';
    if (isTracking && task.trackingStartTime) {
        const elapsedSeconds = Math.floor((Date.now() - task.trackingStartTime) / 1000);
        const elapsedMinutes = Math.floor(elapsedSeconds / 60);
        const elapsedSecs = elapsedSeconds % 60;
        liveTimeDisplay = elapsedMinutes > 0 ? `${elapsedMinutes}m ${elapsedSecs}s` : `${elapsedSecs}s`;
    }

    return `
        <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td class="px-6 py-4 whitespace-nowrap">
                <input class="task-status w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                       type="checkbox" ${task.status === 'done' ? 'checked' : ''}
                       data-task-id="${task.id}">
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium ${isDone} ${overdueClass}">${task.title}</div>
                ${task.description ? `<div class="text-sm text-gray-500 dark:text-gray-400">${task.description}</div>` : ''}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                ${createCategoryBadge(task.category, task.color)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                ${task.deadline ? formatDate(task.deadline) : '-'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center text-sm ${isTracking ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}">
                    <i class="fas fa-stopwatch mr-1"></i>
                    <span>${totalTimeDisplay}${liveTimeDisplay ? ` (+${liveTimeDisplay})` : ''}</span>
                    ${isTracking ? '<span class="text-red-500 ml-1">🔴</span>' : ''}
                </div>
                <div class="flex space-x-1 mt-1">
                    <button class="timer-btn start ${isTracking ? 'stop' : 'start'} text-xs px-1 py-0.5"
                            onclick="event.stopPropagation(); toggleTimer('${task.id}')">
                        ${isTracking ? '<i class="fas fa-stop text-xs"></i>' : '<i class="fas fa-play text-xs"></i>'}
                    </button>
                    <button class="timer-btn reset text-xs px-1 py-0.5"
                            onclick="event.stopPropagation(); resetTimer('${task.id}')"
                            title="Reset timer">
                        <i class="fas fa-undo text-xs"></i>
                    </button>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="edit-task bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm mr-2" data-task-id="${task.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-task bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm" data-task-id="${task.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `;
}

// ==========================================
// UI UTILITIES MODULE
// ==========================================

// Helper function for time formatting
function formatTimeSpent(minutes) {
    if (!minutes) return '0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
        return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
}

function showToast(message, type = 'success') {
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
}

function hideToast(toastId) {
    $(`#${toastId}`).fadeOut(300, function() {
        $(this).remove();
    });
}

function toggleDarkMode() {
    darkMode = !darkMode;
    localStorage.setItem('darkMode', darkMode);
    applyDarkMode();
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

function switchLanguage(lang) {
    selectedLanguage = lang;
    localStorage.setItem('selectedLanguage', lang);

    // Update UI text
    updateUIText();

    // Refresh views to show new language
    refreshCurrentView();
    populateCategoryFilter();
}

function updateUIText() {
    // Update button texts and labels
    $('[data-translate]').each(function() {
        const key = $(this).data('translate');
        if (translations[selectedLanguage][key]) {
            $(this).text(translations[selectedLanguage][key]);
        }
    });
}

// Modal functions
let currentTaskId = null;

function openTaskModal(taskId = null) {
    currentTaskId = taskId;
    const modal = $('#taskModal');

    if (taskId) {
        // Edit mode
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            $('#modalTitle').text('Edit Task');
            $('#taskTitle').val(task.title);
            $('#taskDescription').val(task.description || '');
            $('#taskCategory').val(task.category || '');
            $('#taskDeadline').val(task.deadline || '');
            $('#taskColor').val(task.color || 'work');
        }
    } else {
        // Add mode
        $('#modalTitle').text('Add New Task');
        $('#taskForm')[0].reset();
        $('#taskColor').val('work');
    }

    modal.removeClass('hidden');
    updateModalTimerControls();
}

function closeTaskModal() {
    // Stop any running timer for this task
    if (currentTaskId) {
        const task = tasks.find(t => t.id === currentTaskId);
        if (task && task.isTracking) {
            stopTimer(currentTaskId);
        }
    }

    $('#taskModal').addClass('hidden');
    currentTaskId = null;
}

function updateModalTimerControls() {
    if (!currentTaskId) return;

    const task = tasks.find(t => t.id === currentTaskId);
    if (!task) return;

    const isTracking = task.isTracking || false;
    const timeSpent = task.timeSpent || 0;

    $('#modalTimerDisplay').text(formatTimeSpent(timeSpent));
    $('#modalStartTimer').toggleClass('hidden', isTracking);
    $('#modalStopTimer').toggleClass('hidden', !isTracking);
}

function startTimerFromModal() {
    if (currentTaskId) {
        startTimer(currentTaskId);
        updateModalTimerControls();
    }
}

function stopTimerFromModal() {
    if (currentTaskId) {
        stopTimer(currentTaskId);
        updateModalTimerControls();
    }
}

function resetTimerFromModal() {
    if (currentTaskId) {
        resetTimer(currentTaskId);
        updateModalTimerControls();
    }
}

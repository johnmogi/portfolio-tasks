// ==========================================
// TIME TRACKING MODULE
// ==========================================

function startTimer(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Stop any currently running timer
    tasks.forEach(t => {
        if (t.isTracking && t.id !== taskId) {
            stopTimer(t.id);
        }
    });

    // Start the new timer
    task.isTracking = true;
    task.trackingStartTime = Date.now();
    task.timeLogs = task.timeLogs || [];
    task.timeLogs.push({
        type: 'start',
        timestamp: Date.now(),
        minutes: 0
    });

    saveTasks();
    refreshCurrentView();
    updateModalTimerControls();
}

function stopTimer(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.isTracking) return;

    const elapsedMs = Date.now() - task.trackingStartTime;
    const elapsedMinutes = Math.floor(elapsedMs / (1000 * 60));

    task.isTracking = false;
    task.timeSpent = (task.timeSpent || 0) + elapsedMinutes;
    task.trackingStartTime = null;

    task.timeLogs = task.timeLogs || [];
    task.timeLogs.push({
        type: 'stop',
        timestamp: Date.now(),
        minutes: elapsedMinutes
    });

    saveTasks();
    refreshCurrentView();
    updateModalTimerControls();
}

function resetTimer(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    if (task.isTracking) {
        stopTimer(taskId);
    }

    task.timeSpent = 0;
    task.timeLogs = [];
    task.isTracking = false;
    task.trackingStartTime = null;

    saveTasks();
    refreshCurrentView();
}

function startBackgroundTimer() {
    setInterval(() => {
        if (tasks.some(task => task.isTracking)) {
            refreshCurrentView();
        }
    }, 1000);
}

function toggleTimer(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    if (task.isTracking) {
        stopTimer(taskId);
    } else {
        startTimer(taskId);
    }
}

function getTimerStatus() {
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
}

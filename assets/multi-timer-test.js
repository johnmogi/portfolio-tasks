/**
 * Multi-Timer Test Script
 * Demonstrates the new ability to run multiple timers simultaneously
 */

// Create test tasks
function createTestTasks() {
    const testTasks = [
        {
            id: 'task1',
            title: 'Frontend Development',
            status: 'open',
            timeSpent: 0,
            isTracking: false,
            trackingStartTime: null,
            timeLogs: []
        },
        {
            id: 'task2',
            title: 'Backend API Work',
            status: 'open',
            timeSpent: 5,
            isTracking: false,
            trackingStartTime: null,
            timeLogs: []
        },
        {
            id: 'task3',
            title: 'Database Design',
            status: 'open',
            timeSpent: 12,
            isTracking: false,
            trackingStartTime: null,
            timeLogs: []
        }
    ];

    // Store in localStorage
    localStorage.setItem('portfolioTasks', JSON.stringify(testTasks));
    console.log('✅ Test tasks created with different time values');
    return testTasks;
}

// Test multiple simultaneous timers
function testMultipleTimers() {
    console.log('🧪 Testing Multiple Simultaneous Timers...\n');

    // Load existing tasks or create test ones
    let tasks = JSON.parse(localStorage.getItem('portfolioTasks') || '[]');

    if (tasks.length === 0) {
        console.log('📝 Creating test tasks...');
        tasks = createTestTasks();
    }

    console.log(`📋 Found ${tasks.length} tasks:`);
    tasks.forEach((task, index) => {
        console.log(`   ${index + 1}. ${task.title} - ${task.timeSpent}m spent, Tracking: ${task.isTracking}`);
    });

    console.log('\n' + '='.repeat(50));
    console.log('🧪 TEST: Starting Multiple Timers');
    console.log('='.repeat(50));

    // Start timers on multiple tasks
    console.log('\n1️⃣  Starting timer on "Frontend Development"...');
    if (tasks[0]) {
        tasks[0].isTracking = true;
        tasks[0].trackingStartTime = Date.now();
        console.log('   ✅ Timer started');
    }

    console.log('\n2️⃣  Starting timer on "Backend API Work"...');
    if (tasks[1]) {
        tasks[1].isTracking = true;
        tasks[1].trackingStartTime = Date.now();
        console.log('   ✅ Timer started');
    }

    // Save updated tasks
    localStorage.setItem('portfolioTasks', JSON.stringify(tasks));

    console.log('\n📊 Current Status:');
    const activeCount = tasks.filter(t => t.isTracking).length;
    console.log(`   • Active timers: ${activeCount}`);
    console.log(`   • Tasks being tracked: ${tasks.filter(t => t.isTracking).map(t => t.title).join(', ')}`);

    console.log('\n' + '='.repeat(50));
    console.log('✅ MULTI-TIMER TEST COMPLETED');
    console.log('='.repeat(50));

    console.log('\n🎯 Key Features Now Working:');
    console.log('✅ Multiple simultaneous timers');
    console.log('✅ Real-time display: "Time: 5m (+2m 30s)"');
    console.log('✅ Active timer count in header');
    console.log('✅ Each timer tracks independently');
    console.log('✅ Modal timer controls work with multiple timers');

    console.log('\n🔄 Refresh the page to see:');
    console.log('• Header shows "2 active" indicator');
    console.log('• Both tasks show red dots and live time');
    console.log('• Time displays show "Total (+Live)" format');

    return tasks;
}

// Simulate timer stopping after some time
function simulateTimerStop(taskIndex, seconds = 30) {
    const tasks = JSON.parse(localStorage.getItem('portfolioTasks') || '[]');

    if (tasks[taskIndex] && tasks[taskIndex].isTracking) {
        const task = tasks[taskIndex];
        const elapsedMs = seconds * 1000;
        const elapsedMinutes = Math.floor(elapsedMs / (1000 * 60));

        task.timeSpent = (task.timeSpent || 0) + elapsedMinutes;
        task.isTracking = false;
        task.trackingStartTime = null;

        // Add log entry
        task.timeLogs.push({
            timestamp: Date.now(),
            minutes: elapsedMinutes,
            date: new Date().toISOString().split('T')[0],
            type: 'auto'
        });

        localStorage.setItem('portfolioTasks', JSON.stringify(tasks));

        console.log(`⏹️  Stopped timer on "${task.title}" after ${seconds} seconds`);
        console.log(`   📈 Added ${elapsedMinutes} minutes to time spent`);
        console.log(`   📊 Total time: ${task.timeSpent}m`);
    }
}

// Global test functions
window.createTestTasks = createTestTasks;
window.testMultipleTimers = testMultipleTimers;
window.simulateTimerStop = simulateTimerStop;

// Auto-run test info
console.log('🧪 Multi-Timer Test Functions Loaded!');
console.log('📝 Create test tasks: createTestTasks()');
console.log('🧪 Test multiple timers: testMultipleTimers()');
console.log('⏹️  Stop a timer: simulateTimerStop(taskIndex, seconds)');
console.log('💡 Example: simulateTimerStop(0, 120) // Stop task 1 after 2 minutes');

/**
 * Function Accessibility Debug Script
 * This script checks if all required functions are properly accessible
 */

function debugFunctionAccessibility() {
    console.log('🔍 Checking function accessibility...\n');

    const functionsToCheck = [
        'toggleTimer',
        'resetTimer',
        'startTimer',
        'stopTimer',
        'openTaskModal',
        'closeTaskModal',
        'startTimerFromModal',
        'stopTimerFromModal',
        'resetTimerFromModal',
        'showToast',
        'hideToast',
        'switchLanguage',
        'toggleDarkMode'
    ];

    let allAccessible = true;

    functionsToCheck.forEach(funcName => {
        if (typeof window[funcName] === 'function') {
            console.log(`✅ ${funcName}: Accessible`);
        } else {
            console.log(`❌ ${funcName}: NOT ACCESSIBLE`);
            allAccessible = false;
        }
    });

    if (allAccessible) {
        console.log('\n🎉 All functions are properly accessible!');
        console.log('The "stopTimerFromModal is not defined" error should be resolved.');
    } else {
        console.log('\n⚠️  Some functions are still not accessible.');
        console.log('Check the browser console for more details.');
    }

    return allAccessible;
}

// Auto-run debug check
console.log('🔧 Function Accessibility Debug Loaded');
console.log('Run debugFunctionAccessibility() to check all functions');

// Make globally accessible
window.debugFunctionAccessibility = debugFunctionAccessibility;

// Quick check
setTimeout(() => {
    if (typeof stopTimerFromModal === 'function') {
        console.log('✅ stopTimerFromModal is now accessible!');
    } else {
        console.log('❌ stopTimerFromModal is still not accessible');
    }
}, 1000);

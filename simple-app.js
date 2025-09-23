// Simplified app.js for testing - no external dependencies
document.addEventListener('DOMContentLoaded', function() {
    console.log('Simple app.js loaded successfully');

    // Test function
    function toggleTaskStatus(taskId, isDone) {
        console.log('toggleTaskStatus called with:', taskId, isDone);
        return 'success';
    }

    // Make function global
    window.toggleTaskStatus = toggleTaskStatus;

    console.log('Test function created successfully');
});

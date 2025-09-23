// Test version of app.js - minimal version
$(document).ready(function() {
    console.log('Document ready');

    // Test function
    function testFunction() {
        console.log('Test function called');
        return 'success';
    }

    // Make it global
    window.testFunction = testFunction;

    console.log('app.js loaded successfully');
});

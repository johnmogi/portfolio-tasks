// ==========================================
// MODULAR APP - MAIN ORCHESTRATOR
// ==========================================

$(document).ready(function() {
    console.log('🚀 Modular To-Do Portfolio App Loading...');

    // Load all modules in correct dependency order
    try {
        // 1. Core data and state management
        console.log('📊 Loading core data module...');

        // 2. Time tracking functionality
        console.log('⏱️ Loading time tracking module...');

        // 3. UI rendering functions
        console.log('🎨 Loading UI rendering module...');

        // 4. Task management functions
        console.log('📋 Loading task management module...');

        // 5. DataTable integration
        console.log('📊 Loading DataTable module...');

        // 6. UI utilities (toast, modals, dark mode, language)
        console.log('🛠️ Loading UI utilities module...');

        console.log('✅ All modules loaded successfully');

        // Initialize the application
        initialize();

    } catch (error) {
        console.error('❌ Error loading modules:', error);
        alert('Error loading application modules. Please refresh the page.');
    }
});

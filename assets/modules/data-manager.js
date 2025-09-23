/**
 * Data Manager Module
 * Handles all data operations and local storage
 */

class TaskManager {
    constructor() {
        this.STORAGE_KEY = 'todo_portfolio_tasks_v1';
        this.tasks = [];
        this.initializeStorage();
    }

    // ==========================================
    // STORAGE MANAGEMENT
    // ==========================================

    initializeStorage() {
        this.loadTasks();
    }

    loadTasks() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                this.tasks = JSON.parse(stored);
            } else {
                this.tasks = this.seedTasks();
                this.saveTasks();
            }
            console.log('📊 Loaded tasks:', this.tasks.length);
        } catch (error) {
            console.error('❌ Error loading tasks:', error);
            this.tasks = this.seedTasks();
        }
    }

    saveTasks() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks));
            console.log('💾 Tasks saved to localStorage');
        } catch (error) {
            console.error('❌ Error saving tasks:', error);
        }
    }

    // ==========================================
    // TASK OPERATIONS
    // ==========================================

    getTasks() {
        return this.tasks;
    }

    getTaskById(taskId) {
        return this.tasks.find(task => task.id === taskId);
    }

    addTask(taskData) {
        const newTask = {
            id: this.generateId(),
            title: taskData.title,
            description: taskData.description,
            category: taskData.category,
            color: taskData.color,
            deadline: taskData.deadline,
            status: 'open',
            createdAt: Date.now(),
            estimatedHours: taskData.estimatedHours || 0,
            timeSpent: 0,
            isTracking: false,
            trackingStartTime: null
        };

        this.tasks.push(newTask);
        this.saveTasks();
        console.log('➕ Task added:', newTask.title);
        return newTask;
    }

    updateTask(taskId, updates) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) {
            throw new Error('Task not found');
        }

        this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updates };
        this.saveTasks();
        console.log('📝 Task updated:', this.tasks[taskIndex].title);
        return this.tasks[taskIndex];
    }

    deleteTask(taskId) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) {
            throw new Error('Task not found');
        }

        const deletedTask = this.tasks.splice(taskIndex, 1)[0];
        this.saveTasks();
        console.log('🗑️ Task deleted:', deletedTask.title);
        return deletedTask;
    }

    toggleTaskStatus(taskId) {
        const task = this.getTaskById(taskId);
        if (!task) {
            throw new Error('Task not found');
        }

        task.status = task.status === 'done' ? 'open' : 'done';
        this.saveTasks();
        console.log('🔄 Task status toggled:', task.title, task.status);
        return task;
    }

    // ==========================================
    // UTILITY FUNCTIONS
    // ==========================================

    generateId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    seedTasks() {
        const now = Date.now();
        const tomorrow = now + (24 * 60 * 60 * 1000);
        const nextWeek = now + (7 * 24 * 60 * 60 * 1000);

        return [
            {
                id: this.generateId(),
                title: 'Complete project proposal',
                description: 'Write and finalize the project proposal document',
                category: 'Work',
                color: '#007bff',
                createdAt: now,
                deadline: tomorrow,
                status: 'open',
                estimatedHours: 4,
                timeSpent: 0,
                isTracking: false,
                trackingStartTime: null
            },
            {
                id: this.generateId(),
                title: 'Review design mockups',
                description: 'Review and provide feedback on the latest design mockups',
                category: 'Design',
                color: '#28a745',
                createdAt: now,
                deadline: nextWeek,
                status: 'open',
                estimatedHours: 2,
                timeSpent: 0,
                isTracking: false,
                trackingStartTime: null
            },
            {
                id: this.generateId(),
                title: 'Team meeting preparation',
                description: 'Prepare agenda and materials for the upcoming team meeting',
                category: 'Work',
                color: '#007bff',
                createdAt: now - (2 * 60 * 60 * 1000),
                deadline: null,
                status: 'done',
                estimatedHours: 1,
                timeSpent: 45,
                isTracking: false,
                trackingStartTime: null
            },
            {
                id: this.generateId(),
                title: 'Update portfolio website',
                description: 'Add new projects and update existing content on portfolio',
                category: 'Personal',
                color: '#dc3545',
                createdAt: now - (24 * 60 * 60 * 1000),
                deadline: nextWeek + (3 * 24 * 60 * 60 * 1000),
                status: 'open',
                estimatedHours: 8,
                timeSpent: 120,
                isTracking: false,
                trackingStartTime: null
            },
            {
                id: this.generateId(),
                title: 'Learn new JavaScript framework',
                description: 'Study and complete tutorials for the new framework',
                category: 'Learning',
                color: '#ffc107',
                createdAt: now - (3 * 24 * 60 * 60 * 1000),
                deadline: nextWeek + (7 * 24 * 60 * 60 * 1000),
                status: 'open',
                estimatedHours: 16,
                timeSpent: 0,
                isTracking: false,
                trackingStartTime: null
            }
        ];
    }
}

export { TaskManager };

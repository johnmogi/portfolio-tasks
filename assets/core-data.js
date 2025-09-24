// ==========================================
// TASK DATA & STATE MANAGEMENT
// ==========================================

let tasks = [];
let tasksTable = null;
let currentView = 'card';
let darkMode = false;
let selectedLanguage = 'en';

// Language translations
const translations = {
    en: {
        addTask: 'Add Task',
        title: 'Title',
        description: 'Description',
        category: 'Category',
        deadline: 'Deadline',
        status: 'Status',
        timeSpent: 'Time Spent',
        actions: 'Actions',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        lightMode: 'Light Mode',
        darkMode: 'Dark Mode',
        open: 'Open',
        done: 'Done',
        work: 'Work',
        personal: 'Personal',
        urgent: 'Urgent',
        overdue: 'Overdue'
    },
    es: {
        addTask: 'Agregar Tarea',
        title: 'Título',
        description: 'Descripción',
        category: 'Categoría',
        deadline: 'Fecha Límite',
        status: 'Estado',
        timeSpent: 'Tiempo Empleado',
        actions: 'Acciones',
        save: 'Guardar',
        cancel: 'Cancelar',
        delete: 'Eliminar',
        edit: 'Editar',
        lightMode: 'Modo Claro',
        darkMode: 'Modo Oscuro',
        open: 'Abierto',
        done: 'Completado',
        work: 'Trabajo',
        personal: 'Personal',
        urgent: 'Urgente',
        overdue: 'Vencido'
    }
};

function getTranslation(key) {
    return translations[selectedLanguage][key] || key;
}

function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    } else {
        tasks = [];
    }
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function generateTaskId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

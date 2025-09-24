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
        // Navigation
        appTitle: 'To-Do Portfolio',
        language: 'Language',
        activeTimers: 'Active Timers',
        active: 'active',

        // Buttons
        addTask: 'Add Task',
        start: 'Start',
        stop: 'Stop',
        reset: 'Reset',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        lightMode: 'Light Mode',
        darkMode: 'Dark Mode',

        // Views
        table: 'Table',
        cards: 'Cards',
        list: 'List',

        // Filters
        filterByCategory: 'Filter by Category',
        allCategories: 'All Categories',

        // Form labels
        title: 'Title',
        description: 'Description',
        category: 'Category',
        deadline: 'Deadline',
        estimatedHours: 'Estimated Hours',
        hours: 'hours',
        timeSpent: 'Time Spent',
        color: 'Color',

        // Status
        status: 'Status',
        open: 'Open',
        done: 'Done',
        overdue: 'Overdue',

        // Categories
        work: 'Work',
        personal: 'Personal',
        urgent: 'Urgent',

        // Actions
        actions: 'Actions',

        // Modal
        addEditTask: 'Add/Edit Task',
        enterTaskTitle: 'Enter task title...',
        enterTaskDescription: 'Enter task description...',

        // Table headers
        created: 'Created',

        // Messages
        taskAdded: 'Task added successfully!',
        taskUpdated: 'Task updated successfully!',
        taskDeleted: 'Task deleted successfully!',
        confirmDelete: 'Are you sure you want to delete this task?',

        // Language names
        english: 'English',
        spanish: 'Español',
        french: 'Français',

        // UI text
        moreLanguages: 'More languages coming soon...',
        noTasks: 'No tasks yet. Create your first task!',
        recording: '🔴 Recording',

        // Footer
        allRightsReserved: 'All rights reserved.',
        builtWith: 'Built with ❤️ using modern web technologies'
    },
    es: {
        // Navigation
        appTitle: 'Portafolio de Tareas',
        language: 'Idioma',
        activeTimers: 'Temporizadores Activos',
        active: 'activos',

        // Buttons
        addTask: 'Agregar Tarea',
        start: 'Iniciar',
        stop: 'Detener',
        reset: 'Reiniciar',
        save: 'Guardar',
        cancel: 'Cancelar',
        delete: 'Eliminar',
        edit: 'Editar',
        lightMode: 'Modo Claro',
        darkMode: 'Modo Oscuro',

        // Views
        table: 'Tabla',
        cards: 'Tarjetas',
        list: 'Lista',

        // Filters
        filterByCategory: 'Filtrar por Categoría',
        allCategories: 'Todas las Categorías',

        // Form labels
        title: 'Título',
        description: 'Descripción',
        category: 'Categoría',
        deadline: 'Fecha Límite',
        estimatedHours: 'Horas Estimadas',
        hours: 'horas',
        timeSpent: 'Tiempo Empleado',
        color: 'Color',

        // Status
        status: 'Estado',
        open: 'Abierto',
        done: 'Completado',
        overdue: 'Vencido',

        // Categories
        work: 'Trabajo',
        personal: 'Personal',
        urgent: 'Urgente',

        // Actions
        actions: 'Acciones',

        // Modal
        addEditTask: 'Agregar/Editar Tarea',
        enterTaskTitle: 'Ingrese el título de la tarea...',
        enterTaskDescription: 'Ingrese la descripción de la tarea...',

        // Table headers
        created: 'Creado',

        // Messages
        taskAdded: '¡Tarea agregada exitosamente!',
        taskUpdated: '¡Tarea actualizada exitosamente!',
        taskDeleted: '¡Tarea eliminada exitosamente!',
        confirmDelete: '¿Está seguro de que desea eliminar esta tarea?',

        // Language names
        english: 'Inglés',
        spanish: 'Español',
        french: 'Francés',

        // UI text
        moreLanguages: 'Más idiomas próximamente...',
        noTasks: '¡Aún no hay tareas. ¡Crea tu primera tarea!',
        recording: '🔴 Grabando',

        // Footer
        allRightsReserved: 'Todos los derechos reservados.',
        builtWith: 'Construido con ❤️ usando tecnologías web modernas'
    },
    fr: {
        // Navigation
        appTitle: 'Portefeuille de Tâches',
        language: 'Langue',
        activeTimers: 'Minuteries Actives',
        active: 'actives',

        // Buttons
        addTask: 'Ajouter une Tâche',
        start: 'Démarrer',
        stop: 'Arrêter',
        reset: 'Réinitialiser',
        save: 'Sauvegarder',
        cancel: 'Annuler',
        delete: 'Supprimer',
        edit: 'Modifier',
        lightMode: 'Mode Clair',
        darkMode: 'Mode Sombre',

        // Views
        table: 'Tableau',
        cards: 'Cartes',
        list: 'Liste',

        // Filters
        filterByCategory: 'Filtrer par Catégorie',
        allCategories: 'Toutes les Catégories',

        // Form labels
        title: 'Titre',
        description: 'Description',
        category: 'Catégorie',
        deadline: 'Échéance',
        estimatedHours: 'Heures Estimées',
        hours: 'heures',
        timeSpent: 'Temps Passé',
        color: 'Couleur',

        // Status
        status: 'Statut',
        open: 'Ouvert',
        done: 'Terminé',
        overdue: 'En Retard',

        // Categories
        work: 'Travail',
        personal: 'Personnel',
        urgent: 'Urgent',

        // Actions
        actions: 'Actions',

        // Modal
        addEditTask: 'Ajouter/Modifier une Tâche',
        enterTaskTitle: 'Entrez le titre de la tâche...',
        enterTaskDescription: 'Entrez la description de la tâche...',

        // Table headers
        created: 'Créé',

        // Messages
        taskAdded: 'Tâche ajoutée avec succès !',
        taskUpdated: 'Tâche mise à jour avec succès !',
        taskDeleted: 'Tâche supprimée avec succès !',
        confirmDelete: 'Êtes-vous sûr de vouloir supprimer cette tâche ?',

        // Language names
        english: 'Anglais',
        spanish: 'Espagnol',
        french: 'Français',

        // UI text
        moreLanguages: 'Plus de langues bientôt...',
        noTasks: 'Aucune tâche pour le moment. Créez votre première tâche !',
        recording: '🔴 Enregistrement',

        // Footer
        allRightsReserved: 'Tous droits réservés.',
        builtWith: 'Construit avec ❤️ en utilisant des technologies web modernes'
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

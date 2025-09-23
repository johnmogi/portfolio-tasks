<body class="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
    <!-- Navbar -->
    <nav class="bg-primary-600 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center">
                    <h1 class="text-xl font-bold text-white">To-Do Portfolio</h1>
                </div>
                <div class="flex items-center space-x-4">
                    <button id="darkModeToggle" class="text-white hover:text-gray-200 transition-colors duration-200"><i class="fas fa-sun"></i><span class="ml-2">Light Mode</span></button>
                    <button id="languageToggle" class="text-white hover:text-gray-200 transition-colors duration-200" title="Language / Idioma">
                        <i class="fas fa-globe"></i>
                    </button>
                    <div class="flex items-center space-x-2">
                        <button id="addTaskBtn" class="bg-white text-primary-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2">
                            <i class="fas fa-plus"></i>
                            <span>Add Task</span>
                        </button>
                        <div id="activeTimersCount" class="hidden bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-2 rounded-lg text-sm font-medium" style="display: block;">
                            <i class="fas fa-stopwatch mr-1"></i>
                            <span id="activeCount">1</span> active
                        </div>
                    </div>
                    <!-- Mobile menu button -->
                    <button id="mobileMenuToggle" class="md:hidden text-white hover:text-gray-200 transition-colors duration-200">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Mobile Menu -->
    <div id="mobileMenu" class="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div class="flex flex-col space-y-3">
                <button id="mobileAddTaskBtn" class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2">
                    <i class="fas fa-plus"></i>
                    <span>Add Task</span>
                </button>
                <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400">Active Timers:</span>
                    <div id="mobileActiveTimersCount" class="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-2 rounded-lg text-sm font-medium" style="">
                        <i class="fas fa-stopwatch mr-1"></i>
                        <span id="mobileActiveCount">1</span> active
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Language Switcher -->
    <div id="languageMenu" class="hidden absolute top-16 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 min-w-[200px]">
        <div class="p-2">
            <div class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold mb-2">Language / Idioma</div>
            <button id="langEn" class="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-3">
                <span class="text-lg">🇺🇸</span>
                <div>
                    <div class="font-medium text-gray-900 dark:text-gray-100">English</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">English</div>
                </div>
            </button>
            <button id="langEs" class="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-3">
                <span class="text-lg">🇪🇸</span>
                <div>
                    <div class="font-medium text-gray-900 dark:text-gray-100">Español</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">Spanish</div>
                </div>
            </button>
            <button id="langFr" class="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-3">
                <span class="text-lg">🇫🇷</span>
                <div>
                    <div class="font-medium text-gray-900 dark:text-gray-100">Français</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">French</div>
                </div>
            </button>
            <div class="border-t border-gray-200 dark:border-gray-700 my-2"></div>
            <div class="text-xs text-gray-500 dark:text-gray-400 px-3 py-1">
                More languages coming soon...
            </div>
        </div>
    </div>

    <!-- Main Container -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Toolbar -->
        <div class="mb-8">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div class="flex-1 max-w-md">
                    <label for="categoryFilter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Filter by Category
                    </label>
                    <select id="categoryFilter" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                        <option value="">All Categories</option>
                    <option value="כלשהיא">כלשהיא</option></select>
                </div>

                <div class="flex items-center space-x-4">
                    <!-- View Toggle Buttons -->
                    <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                        <button id="tableViewBtn" class="px-4 py-2 rounded-md font-medium transition-colors duration-200 active">
                            <i class="fas fa-table mr-2"></i>Table
                        </button>
                        <button id="cardViewBtn" class="px-4 py-2 rounded-md font-medium bg-white dark:bg-gray-600 shadow-sm transition-colors duration-200">
                            <i class="fas fa-th-large mr-2"></i>Cards
                        </button>
                        <button id="listViewBtn" class="px-4 py-2 rounded-md font-medium transition-colors duration-200 active">
                            <i class="fas fa-list mr-2"></i>List
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- DataTable -->
        <div id="tasksTableContainer" class="view-container hidden">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div id="tasksTable_wrapper" class="dataTables_wrapper no-footer"><div class="dataTables_length" id="tasksTable_length"><label>Show <select name="tasksTable_length" aria-controls="tasksTable" class=""><option value="10">10</option><option value="25">25</option><option value="50">50</option><option value="100">100</option></select> entries</label></div><div id="tasksTable_filter" class="dataTables_filter"><label>Search:<input type="search" class="" placeholder="" aria-controls="tasksTable"></label></div><table id="tasksTable" class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 dataTable no-footer" aria-describedby="tasksTable_info" style="width: 896px;">
                    <thead class="bg-gray-50 dark:bg-gray-700">
                        <tr><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider sorting_disabled" rowspan="1" colspan="1" aria-label="Status" style="width: 80px;">Status</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider sorting" tabindex="0" aria-controls="tasksTable" rowspan="1" colspan="1" aria-label="Title: activate to sort column ascending" style="width: 106px;">Title</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider sorting" tabindex="0" aria-controls="tasksTable" rowspan="1" colspan="1" aria-label="Category: activate to sort column ascending" style="width: 142px;">Category</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider sorting sorting_asc" tabindex="0" aria-controls="tasksTable" rowspan="1" colspan="1" aria-label="Deadline: activate to sort column descending" style="width: 160px;" aria-sort="ascending">Deadline</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider sorting_disabled" rowspan="1" colspan="1" aria-label="Time" style="width: 120px;">Time</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider sorting_disabled" rowspan="1" colspan="1" aria-label="Actions" style="width: 120px;">Actions</th></tr>
                    </thead>
                    <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        <!-- Table body will be populated by DataTables -->
                    <tr class="bg-blue-50 dark:bg-blue-900/20 dtrg-group dtrg-start dtrg-level-0"><td colspan="6" class="px-6 py-3 text-left text-sm font-medium text-blue-800 dark:text-blue-200"><strong>כלשהיא</strong></td></tr><tr class="odd"><td><div class="flex items-center">
                                    <input class="task-status w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" type="checkbox" data-task-id="mfwopajxo28meh76trf">
                                </div></td><td><span class=" font-medium" title="תיאור">משימה 1</span></td><td><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            <span class="w-2 h-2 rounded-full mr-2" style="background-color: #3b82f6"></span>
            כלשהיא
        </span></td><td class="sorting_1"><span class="" title="">25 sept 2025</span></td><td>
                                        <div class="flex flex-col items-center space-y-1">
                                            <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                <i class="fas fa-stopwatch mr-1"></i>
                                                <span>52m</span>
                                                
                                            </div>
                                            <div class="flex space-x-1">
                                                <button class="timer-btn start start text-xs px-1 py-0.5" onclick="event.stopPropagation(); toggleTimer('mfwopajxo28meh76trf')">
                                                    <i class="fas fa-play text-xs"></i>
                                                </button>
                                                <button class="timer-btn reset text-xs px-1 py-0.5" onclick="event.stopPropagation(); resetTimer('mfwopajxo28meh76trf')" title="Reset timer">
                                                    <i class="fas fa-undo text-xs"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </td><td>
                                    <button class="edit-task bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm mr-2" data-task-id="mfwopajxo28meh76trf">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="delete-task bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm" data-task-id="mfwopajxo28meh76trf">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td></tr><tr class="dtrg-group dtrg-start dtrg-level-0"><th colspan="6" scope="row">No group</th></tr><tr class="even"><td><div class="flex items-center">
                                    <input class="task-status w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" type="checkbox" data-task-id="mfwollmqezrbfvezeg4">
                                </div></td><td><span class=" font-medium" title="">test</span></td><td></td><td class="sorting_1"><span class="" title="">No deadline</span></td><td>
                                        <div class="flex flex-col items-center space-y-1">
                                            <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                <i class="fas fa-stopwatch mr-1"></i>
                                                <span>9m</span>
                                                
                                            </div>
                                            <div class="flex space-x-1">
                                                <button class="timer-btn start start text-xs px-1 py-0.5" onclick="event.stopPropagation(); toggleTimer('mfwollmqezrbfvezeg4')">
                                                    <i class="fas fa-play text-xs"></i>
                                                </button>
                                                <button class="timer-btn reset text-xs px-1 py-0.5" onclick="event.stopPropagation(); resetTimer('mfwollmqezrbfvezeg4')" title="Reset timer">
                                                    <i class="fas fa-undo text-xs"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </td><td>
                                    <button class="edit-task bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm mr-2" data-task-id="mfwollmqezrbfvezeg4">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="delete-task bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm" data-task-id="mfwollmqezrbfvezeg4">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td></tr></tbody>
                </table><div class="dataTables_info" id="tasksTable_info" role="status" aria-live="polite">Showing 1 to 2 of 2 entries</div><div class="dataTables_paginate paging_simple_numbers" id="tasksTable_paginate"><a class="paginate_button previous disabled" aria-controls="tasksTable" aria-disabled="true" aria-role="link" data-dt-idx="previous" tabindex="-1" id="tasksTable_previous">Previous</a><span><a class="paginate_button current" aria-controls="tasksTable" aria-role="link" aria-current="page" data-dt-idx="0" tabindex="0">1</a></span><a class="paginate_button next disabled" aria-controls="tasksTable" aria-disabled="true" aria-role="link" data-dt-idx="next" tabindex="-1" id="tasksTable_next">Next</a></div></div>
            </div>
        </div>

        <!-- Card View Container -->
        <div id="tasksCardContainer" class="view-container hidden">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="tasksCardGrid">
            <div class="task-card group  cursor-pointer hover:shadow-lg transition-all duration-200" data-id="mfwollmqezrbfvezeg4" onclick="openTaskModal('mfwollmqezrbfvezeg4')">
                <div class="space-y-4">
                    <div>
                        <h3 class="task-card-title">test</h3>
                        <p class="task-card-description text-sm">No description</p>
                    </div>

                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-2">
                            
                            
                        </div>
                        <span class="task-card-meta text-sm">No deadline</span>
                    </div>

                    <div class="time-tracker">
                        <div class="time-display">
                            <i class="fas fa-stopwatch"></i>
                            <span>Time: 9m (+54s)</span>
                            
                        </div>
                        <div class="flex space-x-1">
                            <button class="timer-btn start start" onclick="event.stopPropagation(); toggleTimer('mfwollmqezrbfvezeg4')">
                                <i class="fas fa-play"></i>
                            </button>
                            <button class="timer-btn reset" onclick="event.stopPropagation(); resetTimer('mfwollmqezrbfvezeg4')" title="Reset timer">
                                <i class="fas fa-undo"></i>
                            </button>
                        </div>
                    </div>

                    <div class="task-card-actions" onclick="event.stopPropagation()">
                        <button class="edit-task bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200" data-task-id="mfwollmqezrbfvezeg4">
                            <i class="fas fa-edit mr-1"></i>Edit
                        </button>
                        <button class="delete-task bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200" data-task-id="mfwollmqezrbfvezeg4">
                            <i class="fas fa-trash mr-1"></i>Delete
                        </button>
                    </div>
                </div>
            </div>
        
            <div class="task-card group  cursor-pointer hover:shadow-lg transition-all duration-200" data-id="mfwopajxo28meh76trf" onclick="openTaskModal('mfwopajxo28meh76trf')">
                <div class="space-y-4">
                    <div>
                        <h3 class="task-card-title">משימה 1</h3>
                        <p class="task-card-description text-sm">תיאור</p>
                    </div>

                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-2">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            <span class="w-2 h-2 rounded-full mr-2" style="background-color: #3b82f6"></span>
            כלשהיא
        </span>
                            
                        </div>
                        <span class="task-card-meta text-sm">25 sept 2025</span>
                    </div>

                    <div class="time-tracker">
                        <div class="time-display">
                            <i class="fas fa-stopwatch"></i>
                            <span>Time: 52m</span>
                            
                        </div>
                        <div class="flex space-x-1">
                            <button class="timer-btn start start" onclick="event.stopPropagation(); toggleTimer('mfwopajxo28meh76trf')">
                                <i class="fas fa-play"></i>
                            </button>
                            <button class="timer-btn reset" onclick="event.stopPropagation(); resetTimer('mfwopajxo28meh76trf')" title="Reset timer">
                                <i class="fas fa-undo"></i>
                            </button>
                        </div>
                    </div>

                    <div class="task-card-actions" onclick="event.stopPropagation()">
                        <button class="edit-task bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200" data-task-id="mfwopajxo28meh76trf">
                            <i class="fas fa-edit mr-1"></i>Edit
                        </button>
                        <button class="delete-task bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200" data-task-id="mfwopajxo28meh76trf">
                            <i class="fas fa-trash mr-1"></i>Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </div>

        <!-- List View Container -->
        <div id="tasksListContainer" class="view-container">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div class="divide-y divide-gray-200 dark:divide-gray-700" id="tasksList">
            <div class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 task-list-item cursor-pointer" data-id="mfwollmqezrbfvezeg4" onclick="openTaskModal('mfwollmqezrbfvezeg4')">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <input class="task-status w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" type="checkbox" data-task-id="mfwollmqezrbfvezeg4">
                        <div>
                            <h4 class="font-medium ">test</h4>
                            <p class="text-sm text-gray-600 dark:text-gray-400">No description</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        
                        <div class="flex space-x-2" onclick="event.stopPropagation()">
                            <button class="edit-task bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm" data-task-id="mfwollmqezrbfvezeg4">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="delete-task bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm" data-task-id="mfwollmqezrbfvezeg4">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                    <div class="mt-3 flex items-center justify-between">
                        <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <i class="fas fa-stopwatch mr-2"></i>
                            <span>Time: 9m</span>
                            <span class="text-red-500 ml-2">🔴</span>
                        </div>
                        <div class="flex space-x-1" onclick="event.stopPropagation()">
                            <button class="timer-btn start stop text-xs px-2 py-1" onclick="toggleTimer('mfwollmqezrbfvezeg4')">
                                <i class="fas fa-stop"></i>
                            </button>
                            <button class="timer-btn reset text-xs px-2 py-1" onclick="resetTimer('mfwollmqezrbfvezeg4')" title="Reset timer">
                                <i class="fas fa-undo"></i>
                            </button>
                        </div>
                    </div>
                

                <div class="mt-3 flex items-center justify-between">
                    <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <i class="fas fa-stopwatch mr-2"></i>
                        <span>Time: 9m</span>
                        <span class="text-red-500 ml-2">🔴</span>
                    </div>
                    <div class="flex space-x-1" onclick="event.stopPropagation()">
                        <button class="timer-btn start stop text-xs px-2 py-1" onclick="toggleTimer('mfwollmqezrbfvezeg4')">
                            <i class="fas fa-stop"></i>
                        </button>
                        <button class="timer-btn reset text-xs px-2 py-1" onclick="resetTimer('mfwollmqezrbfvezeg4')" title="Reset timer">
                            <i class="fas fa-undo"></i>
                        </button>
                    </div>
                </div>
            </div>
        
            <div class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 task-list-item cursor-pointer" data-id="mfwopajxo28meh76trf" onclick="openTaskModal('mfwopajxo28meh76trf')">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <input class="task-status w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" type="checkbox" data-task-id="mfwopajxo28meh76trf">
                        <div>
                            <h4 class="font-medium ">משימה 1</h4>
                            <p class="text-sm text-gray-600 dark:text-gray-400">תיאור</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            <span class="w-2 h-2 rounded-full mr-2" style="background-color: #3b82f6"></span>
            כלשהיא
        </span>
                        <div class="flex space-x-2" onclick="event.stopPropagation()">
                            <button class="edit-task bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm" data-task-id="mfwopajxo28meh76trf">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="delete-task bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm" data-task-id="mfwopajxo28meh76trf">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                    <div class="mt-3 flex items-center justify-between">
                        <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <i class="fas fa-stopwatch mr-2"></i>
                            <span>Time: 52m</span>
                            
                        </div>
                        <div class="flex space-x-1" onclick="event.stopPropagation()">
                            <button class="timer-btn start start text-xs px-2 py-1" onclick="toggleTimer('mfwopajxo28meh76trf')">
                                <i class="fas fa-play"></i>
                            </button>
                            <button class="timer-btn reset text-xs px-2 py-1" onclick="resetTimer('mfwopajxo28meh76trf')" title="Reset timer">
                                <i class="fas fa-undo"></i>
                            </button>
                        </div>
                    </div>
                

                <div class="mt-3 flex items-center justify-between">
                    <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <i class="fas fa-stopwatch mr-2"></i>
                        <span>Time: 52m</span>
                        
                    </div>
                    <div class="flex space-x-1" onclick="event.stopPropagation()">
                        <button class="timer-btn start start text-xs px-2 py-1" onclick="toggleTimer('mfwopajxo28meh76trf')">
                            <i class="fas fa-play"></i>
                        </button>
                        <button class="timer-btn reset text-xs px-2 py-1" onclick="resetTimer('mfwopajxo28meh76trf')" title="Reset timer">
                            <i class="fas fa-undo"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
            </div>
        </div>
    </div>

    <!-- Task Modal -->
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 hidden" id="taskModal">
        <div class="modal-content bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <div class="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100" id="taskModalLabel">Add/Edit Task</h3>
                    <button type="button" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200" onclick="closeTaskModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>

            <form id="taskForm" class="p-6" role="dialog" aria-labelledby="taskModalLabel" aria-modal="true">
                <input type="hidden" id="taskId" name="taskId">

                <div class="mb-4">
                    <label for="taskTitle" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title *</label>
                    <input type="text" id="taskTitle" name="taskTitle" required="" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200" placeholder="Enter task title...">
                </div>

                <div class="mb-4">
                    <label for="taskDescription" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                    <textarea id="taskDescription" name="taskDescription" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 resize-none" placeholder="Enter task description..."></textarea>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label for="taskCategory" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                        <input type="text" id="taskCategory" name="taskCategory" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    </div>
                    <div>
                        <label for="taskColor" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color</label>
                        <input type="color" id="taskColor" name="taskColor" value="#888888" class="w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                    </div>
                </div>

                <div class="mb-4">
                    <label for="taskDeadline" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Deadline</label>
                    <input type="datetime-local" id="taskDeadline" name="taskDeadline" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label for="taskEstimatedHours" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estimated Hours</label>
                        <div class="flex">
                            <input type="number" id="taskEstimatedHours" name="taskEstimatedHours" min="0" step="0.5" class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                            <span class="px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-lg text-gray-700 dark:text-gray-300">hours</span>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time Spent</label>
                        <div class="flex items-center px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                            <i class="fas fa-stopwatch text-gray-500 dark:text-gray-400 mr-2"></i>
                            <span id="taskTimeSpentDisplay" class="text-gray-900 dark:text-gray-100">0h 0m</span>
                            <span id="taskLiveTimerDisplay" class="text-green-500 dark:text-green-400 ml-2 hidden">🔴 Recording</span>
                            <div class="ml-auto flex space-x-2" id="taskTimerControls">
                                <button id="modalStartTimer" class="timer-btn start bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-500" onclick="event.stopPropagation(); startTimerFromModal()">
                                    <i class="fas fa-play"></i> Start
                                </button>
                                <button id="modalStopTimer" class="timer-btn stop bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-500" onclick="event.stopPropagation(); stopTimerFromModal()">
                                    <i class="fas fa-stop"></i> Stop
                                </button>
                                <button id="modalResetTimer" class="timer-btn reset bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-yellow-500" onclick="event.stopPropagation(); resetTimerFromModal()">
                                    <i class="fas fa-undo"></i> Reset
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button type="button" class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200" onclick="closeTaskModal()">
                        Cancel
                    </button>
                    <button type="submit" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200">
                        Save Task
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Toast Container -->
    <div class="fixed top-4 right-4 z-50 space-y-2">
            
        
            
        
            
        </div>

    <!-- Footer -->
    <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div class="text-center">
                <p class="text-gray-600 dark:text-gray-400 text-sm">
                    © <span id="currentYear">2025</span> <a href="https://johnmogi.com" target="_blank" class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200">johnmogi.com</a>. All rights reserved.
                </p>
                <p class="text-gray-500 dark:text-gray-500 text-xs mt-2">
                    Built with ❤️ using Tailwind CSS and modern web technologies
                </p>
            </div>
        </div>
    </footer>

    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>

    <!-- DataTables JS -->
    <script src="https://cdn.datatables.net/1.13.4/js/jquery.dataTables.min.js"></script>

    <!-- DataTables RowGroup extension -->
    <script src="https://cdn.datatables.net/rowgroup/1.3.1/js/dataTables.rowGroup.min.js"></script>

    <!-- App JS -->
    <script src="assets/app-enhanced.js"></script>

    <!-- Set current year -->
    <script>
        document.getElementById('currentYear').textContent = new Date().getFullYear();
    </script>


</body>
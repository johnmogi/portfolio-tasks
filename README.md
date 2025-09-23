# To-Do Portfolio App

A modern, modular task management application built with vanilla JavaScript, jQuery, Bootstrap 5, and DataTables.

## 🏗️ Architecture

The application has been refactored into a clean, modular architecture for better maintainability:

```
assets/
├── app-new.js              # Main entry point
├── modules/
│   ├── data-manager.js     # Data operations and localStorage
│   ├── view-manager.js     # View rendering and switching
│   ├── ui-manager.js       # User interactions and modals
│   └── utils.js            # Utility functions and helpers
├── styles.css             # Custom styles
└── app.js                 # Legacy monolithic file (backup)
```

## 📦 Module Structure

### 1. Main Entry Point (`app-new.js`)
- Application initialization
- Global event handlers

## 🚀 Features

### 📋 **Core Features**
- **Multiple Views**: Table, Card, and List views (Cards default)
- **Data Persistence**: Local storage with automatic saving
- **Export/Import**: JSON-based task backup and restore
- **Responsive Design**: Mobile-friendly interface

### 🆕 **New Features**
- **🎯 Smart Category Filtering**: Dropdown populated from your tasks
- **⏱️ Background Time Tracking**: Start timer and close modal - tracking continues!
- **🌙 Dark Mode**: Toggle with navbar button, persists across sessions
- **📱 Enhanced Mobile Support**: Better responsive design

### ⚡ **Time Tracking**
- Start timer on any task
- Timer runs in background even when modal is closed
- Automatic saving every minute
- Reset timer functionality
- Visual time display in all views

### 🎨 **Theme Support**
- Light mode (default)
- Dark mode with complete styling
- Smooth transitions
- All components themed (tables, cards, modals, forms)

## 🛠️ Development

### Running Locally
```bash
# Start local server
python -m http.server 8080

# Or with Node.js
npx serve .
```

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires ES6 module support for the new modular version

## 📝 Usage

### 🔍 **Category Filtering**
1. The category dropdown automatically populates with your task categories
2. Select "All Categories" to show all tasks
3. Choose a specific category to filter tasks
4. Works with all view modes (Table, Cards, List)

### ⏱️ **Time Tracking**
1. Click the "Start" button on any task to begin tracking
2. Timer continues running even when you close the task modal
3. Time is automatically saved every minute
4. Click "Stop" to pause tracking
5. Use "Reset" to clear recorded time

### 🌙 **Dark Mode**
1. Click the "🌙 Dark Mode" button in the navbar
2. Toggle between light and dark themes
3. Your preference is saved and persists across sessions
4. All UI elements are properly themed

### 📋 **Default View**
- Cards view is now the default (most user-friendly)
- Use view toggle buttons to switch between Table/Cards/List
- Your view preference is remembered

## 🎨 Customization

### Adding New Categories
Edit the seed data in `app-enhanced.js` to add new default categories with colors.

### Dark Mode Customization
Modify the dark mode CSS in `styles.css`:
- `.dark-mode` class controls all dark theme styles
- Customize colors, backgrounds, and transitions
- Add new themed components as needed

### Time Tracking
- Timer interval is set to 1 minute (line 152 in app-enhanced.js)
- Modify `startBackgroundTimer()` function for different intervals
- Customize time display format in `formatTimeSpent()`

## 🐛 Troubleshooting

### Common Issues
1. **Timer not working**: Check browser console for errors
2. **Dark mode not applying**: Clear localStorage and refresh
3. **Categories not showing**: Add tasks with categories first
4. **Data not persisting**: Check browser's localStorage settings

### Debug Mode
The application logs to console. Check browser developer tools for debugging information.

## 🔄 Migration from Previous Versions

The enhanced version (`app-enhanced.js`) is designed to be a drop-in replacement for previous versions. All existing functionality is preserved and enhanced.

### What's New:
- ✅ Category filtering dropdown
- ✅ Background time tracking
- ✅ Dark mode support
- ✅ Cards as default view
- ✅ Enhanced error handling
- ✅ Better mobile responsiveness

## 📈 Future Enhancements

- [ ] User authentication
- [ ] Cloud synchronization
- [ ] Advanced filtering with date ranges
- [ ] Task templates
- [ ] Team collaboration
- [ ] Mobile app version
- [ ] Task dependencies
- [ ] Priority levels
- [ ] Subtasks support
- [ ] Calendar integration

---

Built with ❤️ using modern web technologies

**✨ Latest Update: Enhanced with category filtering, background time tracking, and dark mode support!**
# portfolio-tasks

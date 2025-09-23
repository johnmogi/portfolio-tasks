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
- Module coordination
- Utility functions

### 2. Data Manager (`modules/data-manager.js`)
- Task CRUD operations
- Local storage management
- Data validation
- Seed data generation

### 3. View Manager (`modules/view-manager.js`)
- DataTable initialization
- View rendering (table, card, list)
- View switching logic
- Template generation

### 4. UI Manager (`modules/ui-manager.js`)
- Modal operations
- Form handling
- User interactions
- Export/import functionality

### 5. Utils (`modules/utils.js`)
- Formatting functions
- Validation helpers
- Array utilities
- Color utilities
- Debounce/throttle functions

## 🚀 Features

- **Multiple Views**: Table, Card, and List views
- **Data Persistence**: Local storage with automatic saving
- **Export/Import**: JSON-based task backup and restore
- **Responsive Design**: Mobile-friendly interface
- **Time Tracking**: Built-in time tracking functionality
- **Category Management**: Color-coded task categories
- **Search & Filter**: Advanced filtering options

## 🛠️ Development

### Running Locally
```bash
# Start local server
python -m http.server 8080

# Or with Node.js
npx serve .
```

### Testing
Open `http://localhost:8080` in your browser to test the application.

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires ES6 module support for the new modular version

## 🔧 Configuration

The application uses the following key:
- `todo_portfolio_tasks_v1` - Local storage key for tasks
- Default view: Table view
- Page length: 25 tasks per page

## 📝 Usage

1. **Add Tasks**: Click "Add Task" button to create new tasks
2. **Edit Tasks**: Click "Edit" button on any task
3. **Delete Tasks**: Click "Delete" button and confirm
4. **Mark Complete**: Check/uncheck the status checkbox
5. **Switch Views**: Use the view toggle buttons (Table/Cards/List)
6. **Export/Import**: Use the export/import buttons for data backup

## 🎨 Customization

### Adding New Categories
Edit the seed data in `data-manager.js` to add new default categories with colors.

### Styling
Modify `styles.css` to customize the appearance:
- Task card styles
- View switching animations
- Responsive breakpoints
- Color schemes

### Adding New Views
1. Add new view type to the view manager
2. Create rendering method
3. Add HTML container
4. Update view switching logic

## 🐛 Troubleshooting

### Common Issues
1. **Module loading errors**: Ensure all module files are in the correct location
2. **CORS issues**: Use a local server instead of opening directly in browser
3. **Data not persisting**: Check browser's localStorage settings

### Debug Mode
The application logs to console. Check browser developer tools for debugging information.

## 🔄 Migration from Legacy Version

The new modular version (`app-new.js`) is designed to be a drop-in replacement for the legacy `app.js`. Simply update the HTML script reference to use the new file.

Legacy features maintained:
- All existing functionality
- Data compatibility
- UI consistency
- Export/import format

## 📈 Future Enhancements

- [ ] User authentication
- [ ] Cloud synchronization
- [ ] Advanced filtering
- [ ] Task templates
- [ ] Team collaboration
- [ ] Mobile app version
- [ ] Dark mode support

---

Built with ❤️ using modern web technologies
# portfolio-tasks

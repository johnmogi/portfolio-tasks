const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'assets', 'app.js');

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// Fix jQuery selectors
content = content.replace(/\$\(#([^)]+)\)/g, "$('#$1')");

// Fix any remaining template literal issues
content = content.replace(/task\.status = isDone \? done : open/g, "task.status = isDone ? 'done' : 'open'");
content = content.replace(/task\.status === done \? completed : open/g, "task.status === 'done' ? 'completed' : 'open'");

// Write the fixed content back to the file
fs.writeFileSync(filePath, content, 'utf8');

console.log('Fixed syntax errors in app.js');

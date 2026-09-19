const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('src', function(filePath) {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // Specific overrides for dashboard cards to maintain variety if needed, 
        // but wait, changing the Orders card to purple-500 is good to avoid duplicate blue.
        if (filePath.replace(/\\/g, '/').includes('src/app/dashboard/page.tsx')) {
            content = content.replace(/text-pink-500/g, 'text-purple-500');
            content = content.replace(/bg-pink-50/g, 'bg-purple-50');
            modified = true;
        }

        // Global replacement for the primary theme colors
        const originalContent = content;
        content = content.replace(/-pink-/g, '-blue-');
        
        // Also fix active tabs in dashboard/layout.tsx which had text-slate-900 on pink background.
        // It should be text-white on blue background!
        if (filePath.replace(/\\/g, '/').includes('src/app/dashboard/layout.tsx')) {
            content = content.replace(/bg-blue-500 text-slate-900/g, 'bg-blue-600 text-white');
            content = content.replace(/bg-blue-600 text-slate-900/g, 'bg-blue-600 text-white');
        }

        if (originalContent !== content || modified) {
            fs.writeFileSync(filePath, content);
            console.log("Updated theme in: " + filePath);
        }
    }
});

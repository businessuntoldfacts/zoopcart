const fs = require('fs');
const path = require('path');

function fixUseClient(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  if (content.includes('"use client";')) {
    // Remove all instances of "use client";
    content = content.replace(/"use client";\s*/g, '');
    // Add it exactly once at the top
    content = '"use client";\n' + content;
  }
  
  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (fullPath.includes('node_modules') || fullPath.includes('.git') || fullPath.includes('.next')) continue;
      walkDir(fullPath);
    } else {
      if (['.ts', '.tsx'].some(ext => fullPath.endsWith(ext))) {
        fixUseClient(fullPath);
      }
    }
  }
}

walkDir('./src');

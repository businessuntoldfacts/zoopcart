const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  // Replace <img src="/logo.png" ... className="... bg-white ..." />
  // We want to remove bg-white, px-2, px-1.5, py-1, py-0.5, rounded-xl, rounded-lg from the logo classes.
  content = content.replace(/bg-white px-2 py-1 rounded-xl/g, '');
  content = content.replace(/bg-white px-1.5 py-0.5 rounded-md/g, '');
  content = content.replace(/bg-white px-1.5 py-0.5 rounded-lg/g, '');
  content = content.replace(/bg-white px-2 py-1 rounded-lg/g, '');
  
  // Clean up any double spaces left behind
  content = content.replace(/className="([^"]*?)\s+"/g, 'className="$1"');
  
  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${filePath}`);
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
        replaceInFile(fullPath);
      }
    }
  }
}

walkDir('./src');

const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  // Replace /logo.png with /logo.png?v=2
  content = content.replace(/\/logo\.png/g, '/logo.png?v=2');
  // Just in case it already has ?v=2 and we are running it again, fix it
  content = content.replace(/\/logo\.png\?v=2\?v=2/g, '/logo.png?v=2');
  
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

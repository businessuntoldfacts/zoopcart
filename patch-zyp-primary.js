const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /text-zyp-primary/g, replacement: 'text-[#111111]' },
  { regex: /bg-zyp-primary/g, replacement: 'bg-[#111111]' },
  { regex: /border-zyp-primary/g, replacement: 'border-[#111111]' },
  { regex: /ring-zyp-primary/g, replacement: 'ring-[#111111]' }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const { regex, replacement } of replacements) {
        if (regex.test(content)) {
          content = content.replace(regex, replacement);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated zyp-primary in ${fullPath}`);
      }
    }
  }
}

processDirectory('src');
console.log("Done updating zyp-primary!");

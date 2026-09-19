const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /bg-blue-500/g, replacement: 'bg-[#111111]' },
  { regex: /bg-blue-600/g, replacement: 'bg-[#111111]' },
  { regex: /hover:bg-blue-600/g, replacement: 'hover:bg-black' },
  { regex: /hover:bg-blue-700/g, replacement: 'hover:bg-black' },
  { regex: /text-blue-500/g, replacement: 'text-[#111111]' },
  { regex: /text-blue-600/g, replacement: 'text-[#111111]' },
  { regex: /text-blue-700/g, replacement: 'text-black' },
  { regex: /bg-blue-50(?!\/)/g, replacement: 'bg-slate-100' }, // match bg-blue-50 but not bg-blue-50/50
  { regex: /bg-blue-100/g, replacement: 'bg-slate-200' },
  { regex: /border-blue-500/g, replacement: 'border-[#111111]' },
  { regex: /border-blue-600/g, replacement: 'border-black' },
  { regex: /border-blue-200/g, replacement: 'border-slate-300' },
  { regex: /ring-blue-500/g, replacement: 'ring-[#111111]' },
  { regex: /shadow-blue-500\/[0-9]+/g, replacement: 'shadow-black/20' },
  { regex: /shadow-blue-600\/[0-9]+/g, replacement: 'shadow-black/20' },
  { regex: /shadow-blue-900\/[0-9]+/g, replacement: 'shadow-black/20' },
  { regex: /fill-blue-600/g, replacement: 'fill-[#111111]' },
  { regex: /bg-gradient-to-br from-blue-100 to-indigo-100/g, replacement: 'bg-slate-100' },
  { regex: /from-blue-600 to-indigo-600/g, replacement: 'from-[#111111] to-black' },
  { regex: /from-blue-500 to-blue-600/g, replacement: 'from-[#111111] to-black' }
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
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory('src');
console.log("Done updating colors!");

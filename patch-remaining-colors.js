const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /bg-indigo-50(?!\/)/g, replacement: 'bg-slate-100' },
  { regex: /text-indigo-600/g, replacement: 'text-[#111111]' },
  { regex: /text-indigo-700/g, replacement: 'text-[#111111]' },
  { regex: /bg-indigo-600/g, replacement: 'bg-[#111111]' },
  { regex: /hover:bg-indigo-700/g, replacement: 'hover:bg-black' },
  { regex: /from-indigo-600/g, replacement: 'from-[#111111]' },
  { regex: /from-indigo-700/g, replacement: 'from-[#111111]' },
  { regex: /to-indigo-500/g, replacement: 'to-black' },
  { regex: /to-indigo-600/g, replacement: 'to-black' },
  { regex: /via-indigo-900/g, replacement: 'via-slate-900' },
  { regex: /via-purple-600/g, replacement: 'via-[#111111]' },
  { regex: /to-blue-900/g, replacement: 'to-black' },
  { regex: /bg-gradient-to-r from-slate-700 via-slate-900 to-black/g, replacement: 'text-black' },
  { regex: /text-transparent bg-clip-text text-black/g, replacement: 'text-[#111111]' }
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
console.log("Done updating remaining colorful classes!");

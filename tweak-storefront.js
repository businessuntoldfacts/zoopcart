const fs = require('fs');
let code = fs.readFileSync('src/app/[username]/page.tsx', 'utf8');

// Adjust padding
code = code.replace(/className="p-5"/g, 'className="p-3"');
// Adjust title size
code = code.replace(/text-lg text-slate-900 leading-tight/g, 'text-sm sm:text-base text-slate-900 leading-tight');
// Adjust price size
code = code.replace(/text-xl font-extrabold text-slate-900/g, 'text-base sm:text-lg font-extrabold text-slate-900');
// Adjust original price size
code = code.replace(/text-sm font-bold text-slate-400 line-through/g, 'text-xs font-bold text-slate-400 line-through');

fs.writeFileSync('src/app/[username]/page.tsx', code);

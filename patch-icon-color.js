const fs = require('fs');

let code = fs.readFileSync('src/app/dashboard/layout.tsx', 'utf8');
code = code.replace(/<Icon className=\{cn\("w-5 h-5", isActive \? "text-slate-900" : "text-slate-500 group-hover:text-slate-900"\)\} \/>/, '<Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-500 group-hover:text-slate-900")} />');

fs.writeFileSync('src/app/dashboard/layout.tsx', code);
console.log("Fixed icon color for active tab");

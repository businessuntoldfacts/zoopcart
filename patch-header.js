const fs = require('fs');
let code = fs.readFileSync('src/components/HeaderMenu.tsx', 'utf8');

// Fix HeaderMenu
code = code.replace(/<Button className="rounded-full px-6 bg-blue-600 hover:bg-blue-700 text-slate-900 shadow-sm font-bold">Get Started<\/Button>/, '<Button variant="primary" className="rounded-full px-6 shadow-sm font-bold">Start free</Button>');
code = code.replace(/<Button className="w-full py-6 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700">Get Started Free<\/Button>/, '<Button variant="primary" className="w-full py-6 rounded-full font-bold">Start free</Button>');
code = code.replace(/<Button variant="secondary" className="w-full py-6 rounded-xl font-bold border-slate-200 text-slate-800">Log in<\/Button>/, '<Button variant="secondary" className="w-full py-6 rounded-full font-bold border-slate-200 text-slate-800">Log in</Button>');

fs.writeFileSync('src/components/HeaderMenu.tsx', code);
console.log("Updated HeaderMenu buttons");

const fs = require('fs');
let code = fs.readFileSync('src/components/HeaderMenu.tsx', 'utf8');

// The mobile menu is currently a fullscreen fixed overlay:
// <div className="md:hidden bg-white fixed inset-0 top-16 z-40 border-t border-slate-100">
//   <div className="flex flex-col p-6 space-y-6">

// Change to a sleek side drawer sliding in from the right:
code = code.replace(
  /<div className="md:hidden bg-white fixed inset-0 top-16 z-40 border-t border-slate-100">/, 
  '<div className="md:hidden bg-white/50 backdrop-blur-sm fixed inset-0 top-16 z-40">\n<div className="absolute right-0 top-0 h-[calc(100vh-64px)] w-64 bg-white border-l border-slate-100 shadow-2xl p-6 flex flex-col space-y-6 transform transition-transform">'
);
// We need to add the closing div for the overlay
code = code.replace(
  /<\/div>\n\s*<\/div>\n\s*<\/header>/,
  '</div>\n</div>\n</div>\n    </header>'
);

fs.writeFileSync('src/components/HeaderMenu.tsx', code);
console.log("Updated Mobile Menu to Side Drawer");

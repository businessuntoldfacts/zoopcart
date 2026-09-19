const fs = require('fs');

let code = fs.readFileSync('src/app/page.tsx', 'utf8');

// Animate Hero section
code = code.replace(/<div className="flex-1 text-center lg:text-left z-10">/, `<div className="flex-1 text-center lg:text-left z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">`);
code = code.replace(/<div className="flex-1 relative flex justify-center lg:justify-end animate-float">/, `<div className="flex-1 relative flex justify-center lg:justify-end animate-in fade-in zoom-in-95 duration-1000 delay-300 fill-mode-both">`);

// Add a simple pulse to the main CTA
code = code.replace(/<Button variant="primary" className="text-lg py-6 px-10 rounded-full font-bold shadow-xl shadow-black\/20 hover:shadow-2xl hover:-translate-y-1 transition-all w-full sm:w-auto">/, `<Button variant="primary" className="text-lg py-6 px-10 rounded-full font-bold shadow-xl shadow-black/20 hover:shadow-2xl hover:-translate-y-1 transition-all w-full sm:w-auto relative overflow-hidden group">
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>`);

fs.writeFileSync('src/app/page.tsx', code);
console.log("Added load animations to page.tsx hero");

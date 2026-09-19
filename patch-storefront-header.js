const fs = require('fs');
let code = fs.readFileSync('src/components/StorefrontClient.tsx', 'utf8');

code = code.replace(/<header className="fixed top-0 w-full z-50 flex items-center justify-between px-4 h-14 bg-white\/10 backdrop-blur-md">/, '<header className="fixed top-0 w-full z-50 flex items-center justify-between px-4 h-16 bg-white border-b border-slate-100 shadow-sm">');
code = code.replace(/<button onClick=\{\(\) => \{ if \(window.history.length > 1\) router.back\(\); \}\} className="w-10 h-10 flex items-center justify-center rounded-full bg-white\/20 text-white backdrop-blur-sm transition-colors hover:bg-white\/30">/g, '<button onClick={() => { if (window.history.length > 1) router.back(); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100">');
code = code.replace(/<button onClick=\{\(\) => \{ 
              if \(navigator.share\) \{ 
                navigator.share\(\{ title: business.name, url: window.location.href \}\); 
              \} 
            \}\} className="w-10 h-10 flex items-center justify-center rounded-full bg-white\/20 text-white backdrop-blur-sm transition-colors hover:bg-white\/30">/, '<button onClick={() => { if (navigator.share) { navigator.share({ title: business.name, url: window.location.href }); } }} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100">');

fs.writeFileSync('src/components/StorefrontClient.tsx', code);
console.log("Updated Storefront Top Header to solid white");

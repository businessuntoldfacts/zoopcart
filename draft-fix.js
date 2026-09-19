const fs = require('fs');

let pageContent = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Fix Footer to be pure Light Theme
pageContent = pageContent.replace(/<footer className="bg-black pt-16 pb-8 border-t border-slate-800">/g, '<footer className="bg-slate-50 pt-16 pb-8 border-t border-slate-200 text-slate-600">');
pageContent = pageContent.replace(/<Logo \/>/g, '<Logo darkText={true} />'); 
pageContent = pageContent.replace(/text-white/g, 'text-slate-900');
pageContent = pageContent.replace(/text-slate-400/g, 'text-slate-500');
pageContent = pageContent.replace(/bg-slate-800/g, 'bg-slate-200');
pageContent = pageContent.replace(/border-slate-800/g, 'border-slate-200');
// Some text-white might be inside buttons, let's fix the footer specifically:
// Wait, global replace of text-white in page.tsx will break the primary buttons!

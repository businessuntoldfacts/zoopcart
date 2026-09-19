const fs = require('fs');

let pageContent = fs.readFileSync('src/app/page.tsx', 'utf8');

const footerIndex = pageContent.indexOf('{/* Footer */}');
if (footerIndex > -1) {
    let topPart = pageContent.substring(0, footerIndex);
    let footerPart = pageContent.substring(footerIndex);

    footerPart = footerPart.replace(/bg-black/g, 'bg-slate-50');
    footerPart = footerPart.replace(/text-slate-400/g, 'text-slate-600');
    footerPart = footerPart.replace(/text-white/g, 'text-slate-900');
    footerPart = footerPart.replace(/border-slate-800/g, 'border-slate-200');
    footerPart = footerPart.replace(/bg-slate-800/g, 'bg-slate-200');
    footerPart = footerPart.replace(/<Logo \/>/g, '<Logo darkText={true} />');
    
    // Fix Links in Footer
    footerPart = footerPart.replace(/href="#"/g, 'href="/"');
    
    pageContent = topPart + footerPart;
}

// 2. Emojis to Professional Icons
pageContent = pageContent.replace(/🚀/g, '<Zap className="w-5 h-5 inline text-blue-500 mr-2" />');
pageContent = pageContent.replace(/📱/g, '<Smartphone className="w-5 h-5 inline text-blue-500 mr-2" />');
pageContent = pageContent.replace(/💰/g, '<TrendingUp className="w-5 h-5 inline text-blue-500 mr-2" />');
pageContent = pageContent.replace(/⚡️/g, '<Zap className="w-5 h-5 inline text-blue-500 mr-2" />');
pageContent = pageContent.replace(/🎯/g, '<Target className="w-5 h-5 inline text-blue-500 mr-2" />');
pageContent = pageContent.replace(/✨/g, '<Sparkles className="w-5 h-5 inline text-blue-500 mr-2" />');

// Need to make sure we import these icons
if (!pageContent.includes('Target')) {
    pageContent = pageContent.replace('import { Play, ', 'import { Play, Target, Zap, Smartphone, TrendingUp, Sparkles, ');
}

fs.writeFileSync('src/app/page.tsx', pageContent);
console.log("Patched page.tsx footer and emojis");

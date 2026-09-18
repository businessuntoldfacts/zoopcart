const fs = require('fs');
let code = fs.readFileSync('src/components/PlatformReviewSystem.tsx', 'utf8');

const regex = /<div className="grid md:grid-cols-3 gap-6">\s*\{\/\* Default Fallbacks \*\/\}[\s\S]*?<\/div>\s*<\/div>/;

const replacement = `<div className="text-center py-12 text-slate-500 font-bold bg-slate-50 rounded-2xl border border-slate-100">
            No reviews yet. Be the first to share your experience!
          </div>
        </div>`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/PlatformReviewSystem.tsx', code);

const fs = require('fs');
let code = fs.readFileSync('src/components/StorefrontClient.tsx', 'utf8');

// Replace the action buttons div
code = code.replace(/<div className="flex gap-3 mt-6">[\s\S]*?<button onClick=\{\(\) => window.open/m, '<div className="flex gap-3 mt-6">\n              <button onClick={() => window.open');

// Clean up any remaining Follow button just in case
code = code.replace(/<button className="flex-1 py-3 rounded-2xl border-2 border-pink-500 text-pink-500 font-extrabold flex items-center justify-center gap-2 transition-colors hover:bg-pink-50">\s*<Heart className="w-4 h-4" \/> Follow\s*<\/button>/g, '');

fs.writeFileSync('src/components/StorefrontClient.tsx', code);

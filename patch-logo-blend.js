const fs = require('fs');

// 1. Update HeaderMenu.tsx
let header = fs.readFileSync('src/components/HeaderMenu.tsx', 'utf8');
header = header.replace('bg-white/90 backdrop-blur-md z-50 border-b border-slate-200', 'bg-[#0F172A]/95 backdrop-blur-md z-50 border-b border-slate-800');
header = header.replace('text-slate-600 hover:text-slate-900', 'text-slate-300 hover:text-white'); // Seller Login text
header = header.replace('text-slate-900', 'text-white'); // Mobile menu icon
header = header.replace('bg-white shadow-xl', 'bg-[#0F172A] shadow-xl border-b border-slate-800'); // Mobile menu dropdown
header = header.replace('text-slate-600 hover:bg-slate-50', 'text-slate-300 hover:bg-slate-800'); // Mobile menu links
fs.writeFileSync('src/components/HeaderMenu.tsx', header);

// 2. Add mix-blend-mode: screen to all logos to drop the black background
function addBlendMode(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/<img src="\/logo\.png\?v=2"([^>]*?)className="([^"]*?)"/g, '<img src="/logo.png?v=2"$1className="$2" style={{ mixBlendMode: "screen" }}');
  // Also handle cases where style might already exist (unlikely but just in case)
  fs.writeFileSync(filePath, content);
}

const files = [
  'src/components/HeaderMenu.tsx',
  'src/components/StorefrontClient.tsx',
  'src/app/page.tsx',
  'src/app/admin/layout.tsx',
  'src/app/admin/login/page.tsx',
  'src/app/dashboard/layout.tsx',
  'src/app/login/page.tsx',
  'src/app/signup/page.tsx'
];

files.forEach(f => {
  if(fs.existsSync(f)) addBlendMode(f);
});

console.log("Dark header and blend modes applied!");

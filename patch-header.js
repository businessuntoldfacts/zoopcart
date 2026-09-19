const fs = require('fs');

let code = fs.readFileSync('src/components/HeaderMenu.tsx', 'utf8');

// Add import if not exists
if (!code.includes('import Logo')) {
  code = code.replace('import Link from "next/link";', 'import Link from "next/link";\nimport Logo from "@/components/Logo";');
}

// Revert header to light theme
code = code.replace('bg-[#0F172A]/95 backdrop-blur-md z-50 border-b border-slate-800', 'bg-white/90 backdrop-blur-md z-50 border-b border-slate-200');
code = code.replace('text-slate-300 hover:text-white', 'text-slate-600 hover:text-slate-900');
code = code.replace('text-white', 'text-slate-900'); // Menu icon
code = code.replace('bg-[#0F172A] shadow-xl border-b border-slate-800', 'bg-white shadow-xl'); 
code = code.replace('text-slate-300 hover:bg-slate-800', 'text-slate-600 hover:bg-slate-50');

// Replace image with Logo component
const imgRegex = /<img src="\/logo\.png\?v=3"([^>]*?)>/g;
code = code.replace(imgRegex, '<Logo darkText={true} />');

fs.writeFileSync('src/components/HeaderMenu.tsx', code);
console.log("Patched HeaderMenu");

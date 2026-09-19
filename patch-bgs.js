const fs = require('fs');

function replaceFile(path, search, replaceStr) {
    if (!fs.existsSync(path)) return;
    let content = fs.readFileSync(path, 'utf8');
    content = content.replace(search, replaceStr);
    fs.writeFileSync(path, content);
}

// 1. Landing Page Footer
replaceFile('src/app/page.tsx', /bg-\[\#0F172A\]/g, 'bg-black');

// 2. Header Menu (make pure white)
replaceFile('src/components/HeaderMenu.tsx', /bg-white\/90 backdrop-blur-md z-50 border-b border-slate-200/g, 'bg-white z-50 border-b border-slate-100');

// 3. Admin Layout Sidebar
replaceFile('src/app/admin/layout.tsx', /bg-\[\#0F172A\]/g, 'bg-black');
replaceFile('src/app/admin/layout.tsx', /border-slate-800/g, 'border-zinc-900');

// 4. Dashboard Layout Sidebar
replaceFile('src/app/dashboard/layout.tsx', /bg-slate-900/g, 'bg-black');
replaceFile('src/app/dashboard/layout.tsx', /border-slate-800/g, 'border-zinc-900');
replaceFile('src/app/dashboard/layout.tsx', /bg-white\/90 backdrop-blur-md/g, 'bg-white'); // Mobile header

// 5. StorefrontClient Header
replaceFile('src/components/StorefrontClient.tsx', /bg-white\/80 backdrop-blur-md border-b/g, 'bg-white border-b');

// 6. Admin Login
replaceFile('src/app/admin/login/page.tsx', /bg-\[\#1E293B\]/g, 'bg-black');

console.log("Backgrounds perfectly matched!");

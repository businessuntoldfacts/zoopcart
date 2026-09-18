const fs = require('fs');
let code = fs.readFileSync('src/app/dashboard/settings/page.tsx', 'utf8');

// The block to remove is the button with 'Auto'
code = code.replace(/<button onClick=\{\(\) => changeTheme\("auto"\)\}[\s\S]*?<span className="text-\[10px\] font-bold text-slate-700">Auto<\/span>\s*<\/button>/, '');

fs.writeFileSync('src/app/dashboard/settings/page.tsx', code);

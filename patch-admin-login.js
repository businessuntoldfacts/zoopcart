const fs = require('fs');
let code = fs.readFileSync('src/app/admin/login/page.tsx', 'utf8');

code = code.replace(/setTimeout\(\(\) => \{[\s\S]*?\}, 1000\);/, 'setTimeout(() => {\n      localStorage.setItem("zypcart_admin", "authenticated");\n      window.location.href = "/admin";\n    }, 1000);');

fs.writeFileSync('src/app/admin/login/page.tsx', code);

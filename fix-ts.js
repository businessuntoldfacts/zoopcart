const fs = require('fs');
let code = fs.readFileSync('src/lib/useDashboardData.ts', 'utf8');

code = code.replace(/orders: \[\],/g, 'orders: [] as any[],');
code = code.replace(/products: \[\],/g, 'products: [] as any[],');

fs.writeFileSync('src/lib/useDashboardData.ts', code);

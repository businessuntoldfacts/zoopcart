const fs = require('fs');
let code = fs.readFileSync('src/app/dashboard/layout.tsx', 'utf8');

// The line is: { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag, badge: 3 },
// Change it to not have a hardcoded badge, or set badge to 0 for now.
code = code.replace(/badge: 3/g, 'badge: 0'); // The UI component will likely hide the badge if it's 0. Let's check.

fs.writeFileSync('src/app/dashboard/layout.tsx', code);
console.log("Removed fake badge from dashboard layout");

const fs = require('fs');
let code = fs.readFileSync('src/app/dashboard/settings/page.tsx', 'utf8');

// Find and remove the Payment Details object from the settingsList array
code = code.replace(/\{\s*id: "payment",\s*title: "Payment Details",\s*desc: "UPI or Razorpay checkout",\s*icon: Wallet,\s*href: "\/dashboard\/settings\/payment"\s*\},/g, '');

fs.writeFileSync('src/app/dashboard/settings/page.tsx', code);

const fs = require('fs');
let code = fs.readFileSync('src/app/dashboard/analytics/page.tsx', 'utf8');

code = code.replace(/ShoppingBag, from "lucide-react";/g, 'from "lucide-react";');
code = code.replace(/import \{ Users, Eye, TrendingUp, Percent, Share2 \} from "lucide-react";/g, 'import { Users, Eye, TrendingUp, Percent, Share2, ShoppingBag } from "lucide-react";');

fs.writeFileSync('src/app/dashboard/analytics/page.tsx', code);
console.log("Fixed import syntax");

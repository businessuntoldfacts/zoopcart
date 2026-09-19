const fs = require('fs');
let code = fs.readFileSync('src/app/dashboard/analytics/page.tsx', 'utf8');

// Ensure ShoppingBag is imported
if (!code.includes('ShoppingBag')) {
    code = code.replace('from "lucide-react";', 'ShoppingBag, from "lucide-react";'); // Wait, replace is exact.
    code = code.replace('import { Users, Eye, TrendingUp, Percent, Share2 } from "lucide-react";', 'import { Users, Eye, TrendingUp, Percent, Share2, ShoppingBag } from "lucide-react";');
}

// 1. Fix data logic
code = code.replace(
  'const [stats, setStats] = useState({ total: 0 });', 
  'const [stats, setStats] = useState({ totalOrders: 0, storeViews: 0, productViews: 0, conversionRate: 0 });'
);

code = code.replace(
  /if \(cachedOrders\) setStats\(\{ total: cachedOrders\.length \}\);/,
  `if (cachedOrders) {
      const realOrders = cachedOrders.filter(o => !['store_view', 'product_view', 'review', 'platform_review'].includes(o.status));
      const storeViews = cachedOrders.filter(o => o.status === 'store_view').length;
      const productViews = cachedOrders.filter(o => o.status === 'product_view').length;
      const totalOrdersCount = realOrders.length;
      const conversionRate = storeViews > 0 ? ((totalOrdersCount / storeViews) * 100).toFixed(1) : "0.0";
      setStats({ totalOrders: totalOrdersCount, storeViews, productViews, conversionRate });
    }`
);

// 2. Fix the render blocks and fake math
code = code.replace(/\{stats\.total === 0 \? 0 : \(stats\.total \* 24 \+ 112\)\.toLocaleString\(\)\}/g, '{stats.storeViews}');
code = code.replace(/<Users className="w-5 h-5 text-slate-300" \/>/, '<div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><Users className="w-5 h-5 text-blue-500" /></div>');

code = code.replace(/\{stats\.total === 0 \? 0 : \(stats\.total \* 45 \+ 342\)\.toLocaleString\(\)\}/g, '{stats.productViews}');
code = code.replace(/<Eye className="w-5 h-5 text-slate-300" \/>/, '<div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center"><Eye className="w-5 h-5 text-indigo-500" /></div>');

code = code.replace(/\{stats\.total\}/g, '{stats.totalOrders}');
code = code.replace(/<TrendingUp className="w-5 h-5 text-green-500" \/>/, '<div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center"><ShoppingBag className="w-5 h-5 text-purple-500" /></div>');
code = code.replace(/text-green-600/g, 'text-[#0F172A]');

code = code.replace(/\{stats\.totalOrders === 0 \? '0%' : \`\$\{.*?\}\`\}/g, '{stats.conversionRate}%');
code = code.replace(/<TrendingUp className="w-5 h-5 text-slate-700" \/>/, '<div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center"><Percent className="w-5 h-5 text-emerald-500" /></div>');

code = code.replace(/stats\.totalOrders === 0 &&/g, 'stats.storeViews === 0 && stats.totalOrders === 0 &&');

fs.writeFileSync('src/app/dashboard/analytics/page.tsx', code);
console.log("Patched analytics page for real data and icons");

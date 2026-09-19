const fs = require('fs');

let code = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

// 1. Fix the import to include Lucide icons we need
if (!code.includes('Users')) {
    code = code.replace('import { TrendingUp, Sparkles } from "lucide-react";', 'import { TrendingUp, Sparkles, Users, Eye, ShoppingBag, Activity } from "lucide-react";');
}

// 2. Fix the greeting
// Original: Good morning, {userName}! <span className="text-2xl">👋</span>
code = code.replace(/Good morning, \{userName\}! <span className="text-2xl">.*?<\/span>/, 'Welcome back, {userName}');
// Fallback if the above regex fails because of line breaks
code = code.replace(/Good morning, \{userName\}!/, 'Welcome back, {userName}');
code = code.replace(/<span className="text-2xl">.*?<\/span>/, ''); // Be careful with this, let's do targeted replace

// 3. Fix the stats array
code = code.replace(/icon: ".*?",/g, 'icon: "",'); // wipe the old string emojis temporarily

// Now properly replace the entire stats array block with the new React icons
const newStats = `
  const stats = [
    { label: "STORE VISITORS", value: storeViews.toString(), trend: "", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "PRODUCT VIEWS", value: productViews.toString(), trend: "", icon: Eye, color: "text-indigo-500", bg: "bg-indigo-50" },
    { label: "ORDERS RECEIVED", value: totalOrdersCount.toString(), trend: "", icon: ShoppingBag, color: "text-pink-500", bg: "bg-pink-50" },
    { label: "CONVERSION RATE", value: \`\${conversionRate}%\`, trend: "--", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-50" }
  ];
`;
code = code.replace(/const stats = \[[\s\S]*?\];/, newStats.trim());

// 4. Update the render block
// Original: <span className="text-xl">{stat.icon}</span>
code = code.replace(/<span className="text-xl">\{stat.icon\}<\/span>/, '<stat.icon className={`w-5 h-5 ${stat.color}`} />');

// Clean up any remaining emoji spans in the header
code = code.replace(/<h2 className="text-2xl font-extrabold text-\[\#0F172A\] flex items-center gap-2">\s*Welcome back, \{userName\}\s*<\/h2>/, '<h2 className="text-2xl font-extrabold text-[#0F172A]">Welcome back, {userName}</h2>');

fs.writeFileSync('src/app/dashboard/page.tsx', code);
console.log("Updated dashboard page.tsx");

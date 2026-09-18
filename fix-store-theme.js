const fs = require('fs');
let code = fs.readFileSync('src/components/StorefrontClient.tsx', 'utf8');

const themeLogic = `
  const theme = business?.theme || 'light';
  
  const getHeroGradient = () => {
    if (theme === 'dark') return 'bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-900';
    if (theme === 'playful') return 'bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-400';
    return 'bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500';
  };

  const primaryColor = theme === 'playful' ? 'bg-orange-500 shadow-orange-500/20' : 'bg-pink-500 shadow-pink-500/20';
  const primaryText = theme === 'playful' ? 'text-orange-500' : 'text-pink-500';
  const activeTabColor = theme === 'playful' ? 'bg-orange-500' : 'bg-pink-500';
`;

code = code.replace(/const \[selectedCategory, setSelectedCategory\] = useState\("All"\);/, 'const [selectedCategory, setSelectedCategory] = useState("All");\n' + themeLogic);

// Replace hero gradient
code = code.replace(/bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500/, '${getHeroGradient()}');
code = code.replace(/className="absolute top-0 w-full h-\[220px\] \$\{getHeroGradient\(\)\}/, 'className={`absolute top-0 w-full h-[220px] ${getHeroGradient()}`);
code = code.replace(/className="absolute top-0 w-full h-\[220px\] bg-gradient-to-br[\s\S]*?shadow-inner"/, 'className={`absolute top-0 w-full h-[220px] ${getHeroGradient()} rounded-b-[40px] shadow-inner`}');

// We also need to add a global style for dark mode inversion if dark
const styleInjection = `
      {theme === 'dark' && (
        <style dangerouslySetInnerHTML={{__html: \`
          body { background-color: #0f172a; }
          .bg-slate-50 { background-color: #0f172a !important; }
          .bg-white { background-color: #1e293b !important; border-color: #334155 !important; }
          .text-slate-900 { color: #f8fafc !important; }
          .text-slate-600, .text-slate-500 { color: #cbd5e1 !important; }
          .border-slate-100, .border-slate-200 { border-color: #334155 !important; }
        \`}} />
      )}
`;

code = code.replace(/<div className="min-h-screen bg-slate-50 font-sans pb-24 relative">/, '<div className="min-h-screen bg-slate-50 font-sans pb-24 relative">\n' + styleInjection);

fs.writeFileSync('src/components/StorefrontClient.tsx', code);

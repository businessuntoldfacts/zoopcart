const fs = require('fs');
const path = require('path');

// 1. Create the Logo component
const logoCode = `import React from 'react';

export default function Logo({ className = "", darkText = false }: { className?: string, darkText?: boolean }) {
  return (
    <div className={\`flex items-center gap-2 hover:opacity-90 transition-opacity \${className}\`}>
      <img src="/icon.jpg" alt="Zoopcart" className="w-8 h-8 rounded-lg shadow-md object-cover" />
      <span className={\`text-2xl font-black tracking-tight \${darkText ? 'text-slate-900' : 'text-white'}\`}>
        Zoopcart
      </span>
    </div>
  );
}
`;
fs.writeFileSync('src/components/Logo.tsx', logoCode);
console.log("Created Logo.tsx");

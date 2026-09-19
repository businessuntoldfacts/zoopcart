const fs = require('fs');

const logoCode = `import React from 'react';

export default function Logo({ className = "", darkText = false }: { className?: string, darkText?: boolean }) {
  // We now have two native images provided by the user: one with a pure white background, one with a pure black background.
  // No CSS hacks required! Just render the correct image.
  
  const imgSrc = darkText ? "/logo-light.jpg?v=1" : "/logo-dark.jpg?v=1";

  return (
    <div className={\`flex items-center hover:opacity-90 transition-opacity \${className}\`}>
      <img 
        src={imgSrc} 
        alt="Zoopcart" 
        className="h-10 md:h-12 w-auto object-contain mix-blend-normal" 
      />
    </div>
  );
}
`;

fs.writeFileSync('src/components/Logo.tsx', logoCode);
console.log("Updated Logo.tsx");

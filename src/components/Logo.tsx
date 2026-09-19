import React from 'react';

export default function Logo({ className = "", darkText = false }: { className?: string, darkText?: boolean }) {
  // Universally use multiply blend mode. Since we are moving to a 100% Light Theme UI, 
  // the white background of the JPEG will perfectly vanish into any white/slate-50 background,
  // leaving the logo crisp and untouched!
  
  return (
    <div className={`flex items-center hover:opacity-90 transition-opacity ${className}`}>
      <img 
        src="/logo-final.jpg?v=3" 
        alt="Zoopcart" 
        className="h-8 md:h-10 w-auto object-contain" 
        style={{ mixBlendMode: 'multiply' }}
      />
    </div>
  );
}

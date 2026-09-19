import React from 'react';

export default function Logo({ className = "", darkText = false }: { className?: string, darkText?: boolean }) {
  // Universally use multiply blend mode. Since we are moving to a 100% Light Theme UI, 
  // the white background of the JPEG will perfectly vanish into any white/slate-50 background,
  // leaving the logo crisp and untouched!
  
  return (
    <div className={`flex items-center hover:opacity-90 transition-opacity ${className}`}>
      <img 
        src="/logo-black.jpg?v=1" 
        alt="Zoopcart" 
        className="h-10 md:h-12 w-auto object-contain" 
        style={{ mixBlendMode: 'multiply' }}
      />
    </div>
  );
}

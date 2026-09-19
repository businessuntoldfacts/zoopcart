import React from 'react';

export default function Logo({ className = "", darkText = false }: { className?: string, darkText?: boolean }) {
  // This is a White-Background JPEG with Dark Navy text and a Blue Cart.
  
  // For Light Theme (White Headers):
  // We use multiply to drop the white background seamlessly into any off-white or white header.
  const lightBgStyle = {
    mixBlendMode: "multiply" as const
  };
  
  // For Dark Theme (Black/Navy Headers & Footers):
  // 1. invert(1) turns White BG to Black, and Navy text to Light Grey/White.
  // 2. hue-rotate(180deg) keeps the inverted orange cart back to its original bright Blue!
  // 3. screen blend mode drops the new Black background seamlessly.
  const darkBgStyle = {
    filter: "invert(1) hue-rotate(180deg) brightness(1.2)",
    mixBlendMode: "screen" as const
  };

  return (
    <div className={`flex items-center hover:opacity-90 transition-opacity ${className}`}>
      <img 
        src="/logo-final.jpg?v=1" 
        alt="Zoopcart" 
        className="h-10 md:h-12 w-auto object-contain" 
        style={darkText ? lightBgStyle : darkBgStyle}
      />
    </div>
  );
}

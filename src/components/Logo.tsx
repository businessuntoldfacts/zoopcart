import React from 'react';

export default function Logo({ className = "", darkText = false }: { className?: string, darkText?: boolean }) {
  // Clever CSS trick to make a JPEG with a black background work on both Light and Dark themes!
  
  // For White Backgrounds (darkText = true):
  // 1. Invert colors (Black bg -> White bg, Blue text -> Yellow text)
  // 2. Hue-rotate 180deg (Yellow text -> Blue text)
  // 3. Multiply blend mode (White bg disappears against the white header!)
  const lightBgStyle = {
    filter: "invert(1) hue-rotate(180deg) brightness(1.2)",
    mixBlendMode: "multiply" as const
  };
  
  // For Dark Backgrounds (darkText = false):
  // 1. Screen blend mode (Black bg disappears against the dark header!)
  const darkBgStyle = {
    mixBlendMode: "screen" as const
  };

  return (
    <div className={`flex items-center hover:opacity-90 transition-opacity ${className}`}>
      <img 
        src="/logo.png?v=4" 
        alt="Zoopcart" 
        className="h-9 md:h-11 w-auto object-contain" 
        style={darkText ? lightBgStyle : darkBgStyle}
      />
    </div>
  );
}

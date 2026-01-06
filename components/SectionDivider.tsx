import React from 'react';

export const SectionDivider: React.FC = () => {
  return (
    <div className="relative w-full h-32 flex items-center justify-center overflow-hidden pointer-events-none">
      {/* Fond dégradé subtil pour lier les sections */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-white"></div>
      
      {/* Ligne verticale très fine et élégante au centre */}
      <div className="absolute h-full w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>
    </div>
  );
};

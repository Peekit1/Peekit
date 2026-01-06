import React from 'react';

export const SectionDivider: React.FC = () => {
  return (
    <div className="relative w-full h-24 flex items-center justify-center overflow-hidden bg-white">
      {/* Ligne verticale subtile qui connecte les sections */}
      <div className="absolute h-full w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>
      
      {/* Optionnel : Un petit point ou icône au centre pour marquer la suite */}
      {/* <div className="w-1.5 h-1.5 rounded-full bg-gray-200 z-10"></div> */}
    </div>
  );
};

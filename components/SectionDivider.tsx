import React from 'react';

export const SectionDivider: React.FC = () => {
  return (
    // On réduit la hauteur à h-8 (32px) sur mobile et h-12 (48px) sur ordi
    // Cela garde une petite respiration sans créer un grand vide.
    <div className="w-full h-8 md:h-12 bg-white"></div>
  );
};

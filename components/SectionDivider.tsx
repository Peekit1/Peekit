import React from 'react';

export const SectionDivider: React.FC = () => {
  return (
    // MODIFICATION: h-4 (16px) sur mobile, h-8 (32px) sur tablette, h-12 (48px) sur desktop
    // Réduit les espacements sur mobile pour une meilleure densité de contenu
    <div className="w-full h-4 sm:h-8 md:h-12 bg-white"></div>
  );
};

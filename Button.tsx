import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'black' | 'outline' | 'ghost' | 'danger';
  fullWidth?: boolean;
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  isLoading = false,
  size = 'md',
  className = '', 
  disabled,
  ...props 
}) => {
  const sizeStyles = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base'
  };

  const baseStyles = `
    inline-flex items-center justify-center gap-2 
    font-medium transition-all duration-200 
    rounded-md border active:scale-[0.98] 
    disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2
  `;
  
  const variants = {
    // Primary: Noir Mat. Pas d'ombre, juste de la rigueur.
    primary: "bg-gray-900 text-white border-transparent hover:bg-black", 
    
    // Black: Alias
    black: "bg-gray-900 text-white border-transparent hover:bg-black",
    
    // Secondary: Blanc avec bordure grise fine.
    secondary: "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50",
    
    // Outline: Transparent avec bordure.
    outline: "bg-transparent text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50",
    
    // Ghost: Pas de bordure, juste hover.
    ghost: "bg-transparent border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100",

    // Danger
    danger: "bg-white text-red-600 border-gray-200 hover:bg-red-50 hover:border-red-200"
  };

  return (
    <button 
      className={`${baseStyles} ${sizeStyles[size]} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  );
};
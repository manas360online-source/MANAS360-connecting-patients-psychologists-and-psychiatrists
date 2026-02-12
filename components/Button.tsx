import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-8 py-3 rounded-full font-semibold transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-brand-blue text-white hover:bg-blue-600 border border-transparent",
    secondary: "bg-white text-brand-text hover:bg-gray-50 border border-gray-200",
    outline: "bg-transparent text-brand-blue border-2 border-brand-blue hover:bg-blue-50"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
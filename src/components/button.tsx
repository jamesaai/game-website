import React from "react";

interface ButtonProps {
  containerClass?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ containerClass, onClick, children }) => {
  return (
    <button
      className={containerClass}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
};
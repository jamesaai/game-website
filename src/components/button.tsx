import React from "react";
import { IconType } from "react-icons";

interface ButtonProps {
  id?: string;
  containerClass?: string;
  onClick?: () => void;
  leftIcon?: IconType;
  rightIcon?: IconType;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  id,
  containerClass,
  onClick,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  children,
}) => {
  return (
    <button
      id={id}
      className={`flex items-center justify-center gap-2 ${containerClass}`}
      onClick={onClick}
      type="button"
    >
      {LeftIcon && <LeftIcon />}
      {children}
      {RightIcon && <RightIcon />}
    </button>
  );
};
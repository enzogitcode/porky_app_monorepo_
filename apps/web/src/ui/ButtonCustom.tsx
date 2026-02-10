import React from "react";
import { Link } from "react-router-dom";

interface ButtonProps {
  buttonCustomStyle?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
  type?: "submit" | "reset" | "button";
  className?: string;
  to?: string; // 👉 si existe, renderiza un Link
  disabled?:boolean
}

const ButtonCustom: React.FC<ButtonProps> = ({
  onClick,
  children,
  type = "button",
  buttonCustomStyle,
  className,
  to,
  disabled
}) => {
  if (to) {
    // 👉 si se pasa la prop "to", renderiza un Link
    return (
      <Link
        to={to}
        className={`m-1 p-1 ${className ?? ""}`}
        style={buttonCustomStyle}
      >
        {children}
      </Link>
    );
  }

  // 👉 si no hay "to", renderiza un botón normal
  return (
    <button
      className={`m-1 p-1 ${className ?? ""}`}
      type={type}
      onClick={onClick}
      style={buttonCustomStyle}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default ButtonCustom;
 
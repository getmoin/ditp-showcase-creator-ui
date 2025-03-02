import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const ButtonOutline: React.FC<ButtonProps> = ({
  children,
  className = "",
  ...props
}) => {
  const hasBgClass = className.includes("bg-");

  return (
    <button
      className={`px-8 border-2 border-dark-border dark:border-light-border py-2 rounded-md font-bold 
      text-light-text dark:text-dark-text 
      hover:bg-light-btn dark:hover:bg-dark-btn-hover 
      ${hasBgClass ? "" : "bg-white dark:bg-dark-btn"} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default ButtonOutline;

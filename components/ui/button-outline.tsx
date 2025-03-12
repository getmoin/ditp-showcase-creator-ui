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
			className={`border-2 border-dark-border dark:border-none hover:bg-gray-100 dark:border-dark-border cursor-pointer uppercase dark:bg-dark-tertiary text-light-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-btn-hover
      hover:bg-light-btn dark:hover:bg-dark-btn-hover font-bold py-2 px-2 rounded-md transition
      ${hasBgClass ? "" : "bg-white dark:bg-dark-bg-tertiary"} ${className}`}
			{...props}
		>
			{children}
		</button>
	);
};

export default ButtonOutline;

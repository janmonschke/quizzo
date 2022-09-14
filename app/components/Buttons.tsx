import React from "react";
import cx from "classnames";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "sm" | "md";
};

export const Button: React.FC<ButtonProps> = ({ size = "md", ...props }) => (
  <button
    {...props}
    className={cx(
      "rounded-md",
      size === "sm" ? "px-2" : "px-4",
      size === "sm" ? "py-1" : "py-2",
      "font-semibold",
      "text-sm",
      "bg-cyan-500",
      "text-white",
      "shadow-sm",
      "hover:bg-cyan-400",
      "disabled:bg-slate-300"
    )}
  >
    {props.children}
  </button>
);

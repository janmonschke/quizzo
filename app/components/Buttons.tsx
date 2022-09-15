import React from "react";
import cx from "classnames";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "sm" | "md";
  kind?: "primary" | "alert";
};

export const Button: React.FC<ButtonProps> = ({
  size = "md",
  kind = "primary",
  ...props
}) => (
  <button
    {...props}
    className={cx(
      "rounded-md",
      size === "sm" ? "px-2" : "px-4",
      size === "sm" ? "py-1" : "py-2",
      "font-semibold",
      "text-sm",
      kind === "primary" && "bg-cyan-500",
      kind === "primary" && "hover:bg-cyan-400",
      "text-white",
      kind === "alert" && "bg-red-400",
      kind === "alert" && "hover:bg-red-500",
      "shadow-sm",
      "disabled:bg-slate-300"
    )}
  >
    {props.children}
  </button>
);

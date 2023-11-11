import React from "react";
import cx from "classnames";
import type { LinkProps } from "@remix-run/react";
import { Link } from "@remix-run/react";

type BaseProps = {
  as?: "button" | "link";
  size?: "sm" | "md";
  kind?: "primary" | "alert" | "ghost";
};

type ButtonProps = BaseProps &
  (
    | ({ as?: "button" } & React.ButtonHTMLAttributes<HTMLButtonElement>)
    | ({ as?: "link" } & LinkProps)
  );

export const Button: React.FC<ButtonProps> = ({
  size = "md",
  kind = "primary",
  ...props
}) => {
  // default to button
  props.as = props.as || "button";

  const classnames = cx(
    "rounded-md",
    size === "sm" ? "px-2" : "px-4",
    size === "sm" ? "py-1" : "py-2",
    "font-semibold",
    "text-sm",
    kind === "primary" && "bg-cyan-500",
    kind === "primary" && "hover:bg-cyan-400",
    kind !== "ghost" && "text-white",
    kind === "alert" && "bg-red-400",
    kind === "alert" && "hover:bg-red-500",
    kind === "ghost" && "border-2",
    kind === "ghost" && "bg-transparent",
    kind === "ghost" && "text-black",
    kind === "ghost" && "hover:bg-slate-50",
    "shadow-sm",
    "disabled:bg-slate-300",
    props.className
  );

  switch (props.as) {
    case "link":
      return (
        <Link {...props} className={classnames}>
          {props.children}
        </Link>
      );
    case "button":
      return (
        <button {...props} className={classnames}>
          {props.children}
        </button>
      );
    default:
      return null;
  }
};

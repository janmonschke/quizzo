import React from "react";
import cx from "classnames";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input: React.FC<InputProps> = (props) => {
  return (
    <input
      {...props}
      className={cx(
        "p-2",
        "border-2",
        "rounded-md",
        "disabled:bg-slate-50",
        "disabled:cursor-not-allowed",
        props.className
      )}
    />
  );
};

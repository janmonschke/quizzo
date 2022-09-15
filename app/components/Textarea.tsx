import React from "react";
import cx from "classnames";

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextArea: React.FC<TextAreaProps> = (props) => {
  return (
    <textarea
      {...props}
      className={cx(
        "p-2",
        "border-2",
        "rounded-md",
        "invalid:border-red-400",
        "disabled:bg-slate-50",
        "disabled:cursor-not-allowed",
        props.className
      )}
    />
  );
};

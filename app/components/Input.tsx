import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input: React.FC<InputProps> = (props) => {
  return (
    <input
      {...props}
      className="p-2 border-2 rounded-md invalid:border-red-400 disabled:bg-slate-50 disabled:cursor-not-allowed"
    />
  );
};

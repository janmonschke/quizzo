import React from "react";

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (
  props
) => (
  <button
    {...props}
    className="rounded-md px-4 py-2 font-semibold text-sm bg-cyan-500 text-white shadow-sm hover:bg-cyan-400 disabled:bg-slate-300"
  >
    {props.children}
  </button>
);

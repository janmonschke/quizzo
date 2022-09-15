import React from "react";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select: React.FC<SelectProps> = (props) => {
  return (
    <select {...props} className="p-2 border-2 rounded-md bg-white">
      {[props.children]}
    </select>
  );
};

import type { PropsWithChildren } from "react";
import React from "react";

export const Card: React.FC<PropsWithChildren> = ({ children }) => (
  <div className="p-4 border-slate-200 rounded-md border-2">{children}</div>
);

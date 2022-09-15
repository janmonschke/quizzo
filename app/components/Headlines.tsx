import type { PropsWithChildren } from "react";
import React from "react";

export const H1: React.FC<PropsWithChildren> = ({ children }) => (
  <h1 className="text-3xl my-4 font-semibold">{children}</h1>
);

export const H2: React.FC<PropsWithChildren> = ({ children }) => (
  <h1 className="text-xl my-2 font-semibold">{children}</h1>
);

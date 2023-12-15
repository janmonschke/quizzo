import type { PropsWithChildren } from "react";
import React from "react";

type HeadlineProps = PropsWithChildren & { className?: string };

export const H1: React.FC<HeadlineProps> = ({ className, children }) => (
  <h1 className={`text-3xl my-4 font-semibold ${className || ""}`}>
    {children}
  </h1>
);

export const H2: React.FC<HeadlineProps> = ({ className, children }) => (
  <h1 className={`text-xl my-2 font-semibold ${className || ""}`}>
    {children}
  </h1>
);

export const H3: React.FC<HeadlineProps> = ({ className, children }) => (
  <h1 className={`text-l my-2 font-semibold ${className || ""}`}>{children}</h1>
);

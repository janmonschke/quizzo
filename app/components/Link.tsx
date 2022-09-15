import React from "react";
import type { LinkProps as RemixLinkProps } from "@remix-run/react";
import { Link as RemixLink } from "@remix-run/react";

export const Link: React.FC<RemixLinkProps> = (props) => (
  <RemixLink
    {...props}
    className="underline-offset-1 underline text-blue-500 hover:text-blue-800 outline-1 outline-blue-300 focus:outline"
  />
);

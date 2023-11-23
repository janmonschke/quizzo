import { Link } from "@remix-run/react";

export function Navigation() {
  return (
    <nav className="flex justify-between">
      <Link
        to="/"
        className="text-lg p-2 rounded-lg border-slate-200 border-2 hover:border-slate-400 hover:underline"
      >
        Home
      </Link>
    </nav>
  );
}

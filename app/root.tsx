import { cssBundleHref } from "@remix-run/css-bundle";
import {
  json,
  type LinksFunction,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import {
  Form,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import styles from "./tailwind.css";
import { popToast } from "./services/toast.server";
import type { Toast as ToastType } from "./services/toast.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  {
    rel: "icon",
    href: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📺</text></svg>",
  },
];

export const meta: MetaFunction = () => [
  { title: "Quizzo - Your favorite quiz management tool" },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const { toast, headers } = await popToast(request);
  return json({ toast }, { headers });
}

function Toast({ toast }: { toast?: ToastType }) {
  const location = useLocation();
  if (!toast) {
    return null;
  }
  return (
    <div className="fixed right-10 bottom-10 max-w-xs">
      <div
        className={`flex justify-center items-center gap-4 p-4 rounded-lg shadow-lg border-2 ${
          toast.type === "success"
            ? "bg-green-100 border-green-300"
            : "bg-red-100 border-red-300"
        }`}
      >
        {toast.message}
        <Form method="get" action={location.pathname}>
          <button
            type="submit"
            className="font-bold hover:scale-125 focus:scale-125"
            aria-label="Dismiss"
          >
            X
          </button>
        </Form>
      </div>
    </div>
  );
}

export default function App() {
  const { toast } = useLoaderData<typeof loader>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Toast toast={toast} />
        <div className="container mx-auto max-w-4xl px-8 py-4 mb-8">
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

import { createCookieSessionStorage } from "@remix-run/node";

const { getSession, commitSession } = createCookieSessionStorage({
  cookie: {
    name: "toast",
  },
});

export type Toast = {
  type: "success" | "error";
  message: string;
};

export async function putToast(toast: Toast, headers = new Headers()) {
  const session = await getSession();
  session.flash("toast", toast);
  headers.set("Set-Cookie", await commitSession(session));
  return headers;
}

export async function popToast(request: Request, headers = new Headers()) {
  const session = await getSession(request.headers.get("Cookie"));
  const toast = session.get("toast") as Toast | undefined;
  headers.set("Set-Cookie", await commitSession(session));
  return { toast, headers };
}

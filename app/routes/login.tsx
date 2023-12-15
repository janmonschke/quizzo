import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { AuthForm } from "~/components/AuthForm";
import { authenticator } from "~/services/auth.server";

export default function Login() {
  return <AuthForm headline="Login" actionLabel="Login" />;
}

export async function action({ request }: ActionFunctionArgs) {
  return await authenticator.authenticate("user-pass", request, {
    successRedirect: "/",
    failureRedirect: "/login",
  });
}

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
}

import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { AuthForm } from "~/components/AuthForm";
import { H1 } from "~/components/Headlines";
import { authenticator } from "~/services/auth.server";

export default function Login() {
  return (
    <>
      <H1 className="text-center">Welcome to Quizzo</H1>
      <AuthForm headline="Login" actionLabel="Login" />
    </>
  );
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

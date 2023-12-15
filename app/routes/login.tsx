import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { AuthForm } from "~/components/AuthForm";
import { H1 } from "~/components/Headlines";
import { authenticator } from "~/services/auth.server";
import { putToast } from "~/services/toast.server";

export default function Login() {
  return (
    <>
      <H1 className="text-center">Welcome to Quizzo</H1>
      <AuthForm headline="Login" actionLabel="Login" />
    </>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    return await authenticator.authenticate("user-pass", request, {
      successRedirect: "/",
      throwOnError: true,
    });
  } catch (error) {
    // Remix throws responses, so we can just return it here
    if (error instanceof Response) return error;

    const headers = await putToast({
      type: "error",
      message: "Wrong credentials, try again!",
    });
    return redirect("/login", { headers });
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
}

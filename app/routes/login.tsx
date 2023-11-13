import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { Button } from "~/components/Buttons";
import { Input } from "~/components/Input";
import { authenticator } from "~/services/auth.server";

export default function Login() {
  return (
    <>
      <h1>Login</h1>
      <Form method="post">
        <Input type="text" name="name" required />
        <Input
          type="password"
          name="password"
          autoComplete="current-password"
          required
        />
        <Button>Login</Button>
      </Form>
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

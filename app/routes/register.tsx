import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { Form } from "@remix-run/react";
import { Button } from "~/components/Buttons";
import { Input } from "~/components/Input";
import { db } from "~/db.server";
import { generatePasswordHash } from "~/helpers/password.server";
import { authenticator } from "~/services/auth.server";

export default function Login() {
  return (
    <>
      <h1>Register</h1>
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
  const formData = await request.formData();
  const name = formData.get("name")?.toString();
  const password = formData.get("password")?.toString();

  if (!name || !password) {
    throw redirect("/register");
  }

  const passwordHash = await generatePasswordHash(password);
  await db.host.create({
    data: {
      name,
      passwordHash,
    },
  });
  return redirect("/login");
}

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/success",
  });
}

import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { AuthForm } from "~/components/AuthForm";
import { db } from "~/db.server";
import { generatePasswordHash } from "~/helpers/password.server";
import { authenticator } from "~/services/auth.server";

export default function Register() {
  return <AuthForm actionLabel="Register" headline="Register" />;
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
    successRedirect: "/",
  });
}

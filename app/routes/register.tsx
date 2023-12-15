import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { AuthForm } from "~/components/AuthForm";
import { H1 } from "~/components/Headlines";
import { db } from "~/db.server";
import { generatePasswordHash } from "~/helpers/password.server";
import { authenticator } from "~/services/auth.server";
import { putToast } from "~/services/toast.server";

export default function Register() {
  return (
    <>
      <H1 className="text-center">Welcome to Quizzo</H1>
      <AuthForm actionLabel="Register" headline="Register" />
    </>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = formData.get("name")?.toString();
  const password = formData.get("password")?.toString();

  if (!name || !password) {
    const headers = await putToast({
      type: "error",
      message: "You need to provide a user name and a password",
    });
    throw redirect("/register", { headers });
  }

  const passwordHash = await generatePasswordHash(password);
  await db.host.create({
    data: {
      name,
      passwordHash,
    },
  });
  const headers = await putToast({
    type: "success",
    message: "Your account was registered. You can sign in now.",
  });
  return redirect("/login", { headers });
}

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
}

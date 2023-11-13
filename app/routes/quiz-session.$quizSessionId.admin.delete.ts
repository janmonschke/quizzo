import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { db } from "~/db.server";
import { authenticator } from "~/services/auth.server";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const { quizSessionId } = params;
  const host = await authenticator.isAuthenticated(request);

  if (!host) {
    throw new Response("Forbidden", {
      status: 403,
    });
  }

  await db.quizSession.delete({
    where: {
      id: quizSessionId,
      hostId: host.id,
    },
  });

  return redirect("/");
};

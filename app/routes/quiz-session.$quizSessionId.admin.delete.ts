import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { db } from "~/db.server";
import { ensureHasAccessToQuizSession } from "~/helpers/authorization";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const { quizSession, host } = await ensureHasAccessToQuizSession(
    params.quizSessionId,
    request
  );

  await db.quizSession.delete({
    where: {
      id: quizSession.id,
      hostId: host.id,
    },
  });

  return redirect("/");
};

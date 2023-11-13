import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { db } from "~/db.server";

export const action = async ({ params }: ActionFunctionArgs) => {
  const { quizSessionId } = params;

  await db.quizSession.delete({
    where: {
      id: quizSessionId,
    },
  });

  return redirect("/");
};

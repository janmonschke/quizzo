import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { db } from "~/db.server";

export const action: ActionFunction = async ({ request, params }) => {
  const { quizSessionId } = params;
  if (!quizSessionId) {
    throw new Error("quizSessionId missing");
  }
  const body = await request.formData();

  const newPosition = body.get("newPosition")?.toString();

  if (!newPosition) {
    throw new Error("Needs a new position");
  }

  await db.quizSession.update({
    where: {
      id: quizSessionId,
    },
    data: {
      currentPosition: parseInt(newPosition),
    },
  });

  return redirect(`/quiz-session/${quizSessionId}`);
};

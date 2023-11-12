import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { db } from "~/db.server";

export const action: ActionFunction = async ({ request, params }) => {
  const { quizSessionId } = params;
  if (!quizSessionId) {
    throw new Error("quizSessionId missing");
  }
  const body = await request.formData();
  const answer = body.get("answer")?.toString();
  const answerId = body.get("answerId")?.toString();
  const questionId = body.get("questionId")?.toString();
  const teamId = body.get("teamId")?.toString();

  if (!answer || !questionId || !teamId) {
    throw new Error("Not all required attributes were passed");
  }

  if (answerId) {
    await db.answer.update({
      where: {
        id: answerId,
      },
      data: {
        answer,
        questionId,
        quizSessionId,
        teamId,
      },
    });
  } else {
    await db.answer.create({
      data: {
        answer,
        questionId,
        quizSessionId,
        teamId,
      },
    });
  }

  return redirect(`/quiz-session/${quizSessionId}/admin`);
};

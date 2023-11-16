import type { ActionFunction } from "@remix-run/node";
import { db } from "~/db.server";
import { ensureHasAccessToQuiz } from "~/helpers/authorization";

export const action: ActionFunction = async ({ params, request }) => {
  await ensureHasAccessToQuiz(params.quizId, request);

  const data = await request.formData();
  const questionId = data.get("questionId");
  const newPosition = data.get("newPosition");

  if (typeof questionId !== "string" || typeof newPosition !== "string") {
    return new Error("Not a valid request");
  }

  const question = await db.question.findFirst({
    where: { id: questionId, quizId: params.quizId },
  });

  if (!question) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  await db.question.update({
    where: {
      id: questionId,
    },
    data: {
      position: parseFloat(newPosition),
    },
  });

  return null;
};

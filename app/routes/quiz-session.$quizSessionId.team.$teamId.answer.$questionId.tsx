import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { db } from "~/db.server";
import { emitter } from "~/services/emitter.server";
import * as events from "~/helpers/events";
import type { Answer } from "@prisma/client";

export const action: ActionFunction = async ({ request, params }) => {
  const { quizSessionId, teamId, questionId } = params;

  if (!quizSessionId || !teamId || !questionId) {
    throw new Response("Not Found", { status: 404 });
  }
  const body = await request.formData();
  const answer = body.get("answer")?.toString();
  const answerId = body.get("answerId")?.toString();

  if (!answer) {
    throw new Response("Missing answer", { status: 400 });
  }

  let answerResult: Answer | null;

  if (answerId) {
    answerResult = await db.answer.update({
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
    answerResult = await db.answer.create({
      data: {
        answer,
        questionId,
        quizSessionId,
        teamId,
      },
    });
  }

  emitter.emit(
    events.updateAnswer(quizSessionId),
    JSON.stringify({ id: answerResult.id, answer: answerResult.answer })
  );

  emitter.emit(
    events.updateTeamAnswer(quizSessionId, teamId),
    JSON.stringify({ id: answerResult.id, answer: answerResult.answer })
  );

  return json({ success: true });
};

import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { db } from "~/db.server";
import { emitter } from "~/services/emitter.server";
import * as events from "~/helpers/events";
import { ensureHasAccessToQuizSession } from "~/helpers/authorization";

export const action: ActionFunction = async ({ request, params }) => {
  const { quizSessionId } = params;
  const { host, quizSession } = await ensureHasAccessToQuizSession(
    quizSessionId,
    request
  );

  const body = await request.formData();
  const newPosition = body.get("newPosition")?.toString();

  if (!newPosition) {
    throw new Error("Needs a new position");
  }

  await db.quizSession.update({
    where: {
      id: quizSession.id,
      hostId: host.id,
    },
    data: {
      currentPosition: parseInt(newPosition),
    },
  });

  emitter.emit(events.updatePosition(quizSession.id), newPosition);

  return redirect(`/quiz-session/${quizSession.id}/admin`);
};

import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { db } from "~/db.server";
import { authenticator } from "~/services/auth.server";
import { emitter } from "~/services/emitter.server";
import * as events from "~/helpers/events";

export const action: ActionFunction = async ({ request, params }) => {
  const host = await authenticator.isAuthenticated(request);

  if (!host) {
    throw new Response("Forbidden", {
      status: 403,
    });
  }

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
      hostId: host.id,
    },
    data: {
      currentPosition: parseInt(newPosition),
    },
  });

  emitter.emit(events.updatePosition(quizSessionId), newPosition);

  return redirect(`/quiz-session/${quizSessionId}/admin`);
};

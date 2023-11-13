import type { ActionFunction } from "@remix-run/node";
import { db } from "~/db.server";
import { authenticator } from "~/services/auth.server";

export const action: ActionFunction = async ({ request }) => {
  const host = await authenticator.isAuthenticated(request);

  if (!host) {
    throw new Response("Forbidden", {
      status: 403,
    });
  }

  const data = await request.formData();
  const questionId = data.get("questionId");
  const newPosition = data.get("newPosition");

  if (typeof questionId !== "string" || typeof newPosition !== "string") {
    return new Error("Not a valid request");
  }

  const question = await db.question.findFirst({
    where: { id: questionId },
    include: {
      quiz: true,
    },
  });

  if (!question || question.quiz.hostId !== host.id) {
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

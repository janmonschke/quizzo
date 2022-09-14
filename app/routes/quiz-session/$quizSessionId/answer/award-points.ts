import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { db } from "~/db.server";

export const action: ActionFunction = async ({ request, params }) => {
  const { quizSessionId } = params;
  if (!quizSessionId) {
    throw new Error("quizSessionId missing");
  }
  const body = await request.formData();
  const answerId = body.get("answerId")?.toString();
  const teamId = body.get("teamId")?.toString();
  const points = body.get("points")?.toString();

  if (!answerId || points === undefined || !teamId) {
    throw new Error("Not all required attributes were passed");
  }

  await db.awardedPoints.create({
    data: {
      points: parseFloat(points),
      answerId,
      teamId,
    },
  });

  return redirect(`/quiz-session/${quizSessionId}`);
};

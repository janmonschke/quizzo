import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { db } from "~/db.server";
import { ensureHasAccessToQuizSession } from "~/helpers/authorization";

export const action: ActionFunction = async ({ request, params }) => {
  const { quizSessionId } = params;
  await ensureHasAccessToQuizSession(quizSessionId, request);

  const body = await request.formData();
  const answerId = body.get("answerId")?.toString();
  const teamId = body.get("teamId")?.toString();
  const awardedPointsId = body.get("awardedPointsId")?.toString();
  const points = body.get("points")?.toString();

  if (!answerId || points === undefined || !teamId) {
    throw new Error("Not all required attributes were passed");
  }

  // Update the points
  if (awardedPointsId) {
    await db.awardedPoints.update({
      where: {
        id: awardedPointsId,
      },
      data: {
        points: parseFloat(points),
        answerId,
        teamId,
      },
    });
  } else {
    // Award new points
    await db.awardedPoints.create({
      data: {
        points: parseFloat(points),
        answerId,
        teamId,
      },
    });
  }

  return redirect(`/quiz-session/${quizSessionId}/admin`);
};

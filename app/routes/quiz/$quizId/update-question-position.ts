import type { ActionFunction } from "@remix-run/node";
import { db } from "~/db.server";

export const action: ActionFunction = async ({ request, params }) => {
  const data = await request.formData();
  const questionId = data.get("questionId");
  const newPosition = data.get("newPosition");

  if (typeof questionId !== "string" || typeof newPosition !== "string") {
    return new Error("Not a valid request");
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

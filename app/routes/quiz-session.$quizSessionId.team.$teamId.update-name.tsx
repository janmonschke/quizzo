import type { ActionFunction } from "@remix-run/node";
import { db } from "../db.server";
import { emitter } from "~/services/emitter.server";
import * as events from "~/helpers/events";

export const action: ActionFunction = async ({ request, params }) => {
  const { teamId, quizSessionId } = params;
  if (!teamId || !quizSessionId) {
    throw new Error("Paraemters missind");
  }
  const body = await request.formData();

  const newName = body.get("name")?.toString();

  if (!newName) {
    throw new Error("Need to supply a name");
  }

  await db.team.update({
    where: {
      id: teamId,
    },
    data: {
      name: newName,
    },
  });

  emitter.emit(events.updateName(quizSessionId), newName);

  return null;
};

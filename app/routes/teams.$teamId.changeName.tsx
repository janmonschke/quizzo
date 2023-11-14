import type { ActionFunction } from "@remix-run/node";
import { db } from "../db.server";

export const action: ActionFunction = async ({ request, params }) => {
  const { teamId } = params;
  if (!teamId) {
    throw new Error("teamId missing");
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

  return null;
};

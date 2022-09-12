import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { db } from "~/db.server";
import { distributeTeams } from "~/helpers/distribute_teams";
import { serializeArrayString } from "~/helpers/string_arrays";

type LoaderData = { quizId: string };

export const loader: LoaderFunction = async ({ params }) => {
  const { quizId } = params;
  if (!quizId) {
    throw new Error("quizId missing");
  }
  const data: LoaderData = { quizId };

  return json(data);
};

export const action: ActionFunction = async ({ request, params }) => {
  const { quizId } = params;
  if (!quizId) {
    throw new Error("quizId missing");
  }
  const body = await request.formData();
  const players = body.get("players")?.toString().split(/\n/);
  const teamCountR = body.get("teamCount")?.toString();
  const teamCount = parseInt(teamCountR || "0");

  console.log(quizId);

  const session = await db.quizSession.create({
    data: {
      quizId,
      hostId: "1",
    },
  });

  if (players && teamCount > 0) {
    const teams = distributeTeams({ players, teamCount });
    await Promise.all(
      teams.map((team) =>
        db.team.create({
          data: {
            name: team.name,
            members: serializeArrayString(team.players),
            quizSessionId: session.id,
          },
        })
      )
    );
  }

  return redirect(`/quiz-session/${session.id}`);
};

export default function Index() {
  const { quizId } = useLoaderData<LoaderData>();

  return (
    <Form method="post">
      <input type="hidden" name="quizId" value={quizId} />
      <div>
        <label>
          Players: <textarea name="players" defaultValue="" />
        </label>
      </div>
      <div>
        <label>
          Amount of teams:{" "}
          <input
            type="number"
            min="1"
            max="10"
            step="1"
            pattern="\d+"
            name="teamCount"
            defaultValue={1}
          />
        </label>
      </div>
      <button type="submit">Create Session</button>
    </Form>
  );
}

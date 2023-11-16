import type { ActionFunction, LoaderFunctionArgs } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Button } from "~/components/Buttons";
import { H1 } from "~/components/Headlines";
import { Input } from "~/components/Input";
import { TextArea } from "~/components/Textarea";
import { db } from "~/db.server";
import { ensureHasAccessToQuiz } from "~/helpers/authorization";
import { distributeTeams } from "~/helpers/distribute_teams";
import { serializeArrayString } from "~/helpers/string_arrays";
import { authenticator } from "~/services/auth.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { quizId } = params;
  await ensureHasAccessToQuiz(quizId, request);

  return json({ quizId });
};

export const action: ActionFunction = async ({ request, params }) => {
  const { quizId } = params;
  if (!quizId) {
    throw new Error("quizId missing");
  }

  const host = await authenticator.isAuthenticated(request);

  if (!host) {
    throw new Response("Forbidden", {
      status: 403,
    });
  }

  const body = await request.formData();
  const players = splitTextIntoRows(body.get("players")?.toString() ?? "");
  const teamCountR = body.get("teamCount")?.toString();
  const teamCount = parseInt(teamCountR || "0");

  const session = await db.quizSession.create({
    data: {
      quizId,
      hostId: host.id,
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

  return redirect(`/quiz-session/${session.id}/admin`);
};

export default function Index() {
  const { quizId } = useLoaderData<typeof loader>();
  const [teamValue, setTeamValue] = useState("");

  const players = splitTextIntoRows(teamValue);
  const playerCount = players.length;

  return (
    <div>
      <H1>Start a new session</H1>
      <Form method="post" className="flex flex-col gap-2">
        <input type="hidden" name="quizId" value={quizId} />
        <label>
          <div>Players: {playerCount > 0 && playerCount} </div>
          <TextArea
            className="block"
            name="players"
            value={teamValue}
            onChange={(e) => setTeamValue(e.target.value)}
            placeholder="Add one player per row"
          />
        </label>
        <label>
          <div>Amount of teams:</div>
          <Input
            type="number"
            min="2"
            max="10"
            step="1"
            pattern="\d+"
            name="teamCount"
            defaultValue={2}
            required
          />
        </label>
        <div>
          <Button type="submit">Create Session</Button>
        </div>
      </Form>
    </div>
  );
}

function splitTextIntoRows(text: string) {
  return text.split(/\r*\n/).filter(Boolean);
}

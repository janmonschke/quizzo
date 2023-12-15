import type { ActionFunction, LoaderFunctionArgs } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useMemo, useState } from "react";
import { Button } from "~/components/Buttons";
import { H1, H3 } from "~/components/Headlines";
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
  const teams = body.getAll("team");

  if (!teams || teams.length < 2) {
    throw new Response("Invalid request", { status: 400 });
  }

  const session = await db.quizSession.create({
    data: {
      quizId,
      hostId: host.id,
    },
  });

  const teamsWithPlayers = teams.map((teamName) => {
    const players = body.getAll(`${teamName}-player`).map(String);
    return { name: teamName.toString(), players };
  });

  await Promise.all(
    teamsWithPlayers.map((team) =>
      db.team.create({
        data: {
          name: team.name,
          members: serializeArrayString(team.players),
          quizSessionId: session.id,
        },
      })
    )
  );

  return redirect(`/quiz-session/${session.id}/admin`);
};

const minTeamCount = 2;

export default function Index() {
  const { quizId } = useLoaderData<typeof loader>();
  const [teamCount, setTeamCount] = useState(minTeamCount);
  const [playerNames, setPlayerNames] = useState("John\nEmma\nTim\nSusan");

  const players = useMemo(() => {
    return splitTextIntoRows(playerNames);
  }, [playerNames]);
  const playerCount = players.length;

  const teams = useMemo(() => {
    return distributeTeams({ players, teamCount });
  }, [players, teamCount]);

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
            value={playerNames}
            onChange={(e) => setPlayerNames(e.target.value)}
            placeholder="Add one player per row"
          />
        </label>
        <label>
          <div>Amount of teams:</div>
          <Input
            type="number"
            min={minTeamCount}
            max="10"
            step="1"
            pattern="\d+"
            name="teamCount"
            value={teamCount}
            onChange={(event) => setTeamCount(parseInt(event.target.value))}
            required
          />
        </label>
        <div>
          <h2>Teams:</h2>
          <div className="flex gap-4">
            {teams.map((team) => (
              <div key={team.name}>
                <H3>{team.name}</H3>
                <input type="hidden" name="team" value={team.name} />
                <ul>
                  {team.players.map((player) => (
                    <li key={player}>
                      {player}{" "}
                      <input
                        type="hidden"
                        name={`${team.name}-player`}
                        value={player}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
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

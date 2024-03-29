import type { AwardedPoints, Team } from "@prisma/client";
import { useMemo } from "react";
import { Card } from "../Card";
import { parseArrayString } from "../../helpers/string_arrays";

type LoadedTeam = Pick<Team, "id" | "name" | "members"> & {
  AwardedPoints: Pick<AwardedPoints, "points">[];
};

export default function Teams({
  teams,
  sessionId,
}: {
  teams: LoadedTeam[];
  sessionId: string;
}) {
  const teamsWithPoints = useMemo(
    () =>
      teams.map((team) => {
        const points = team.AwardedPoints.reduce(
          (acc, point) => acc + point.points,
          0
        );
        return { ...team, points };
      }),
    [teams]
  );
  const sortedTeams = useMemo(
    () => [...teamsWithPoints].sort((a, b) => b.points - a.points),
    [teamsWithPoints]
  );

  return (
    <div className="flex flex-row gap-4">
      {sortedTeams.map((team) => (
        <TeamComponent key={team.name} team={team} sessionId={sessionId} />
      ))}
    </div>
  );
}

function TeamComponent({
  team,
  sessionId,
}: {
  team: LoadedTeam;
  sessionId: string;
}) {
  const members = parseArrayString(team.members);
  const points = team.AwardedPoints.reduce(
    (acc, point) => acc + point.points,
    0
  );
  const pointsText =
    points === 0 || points > 1 ? `${points} points` : `${points} point`;
  return (
    <Card>
      <details open>
        <summary>
          {team.name} - {pointsText}
        </summary>
        <ul>
          {members.map((member) => (
            <li key={member}>{member}</li>
          ))}
        </ul>
      </details>
      <a
        href={`/quiz-session/${sessionId}/team/${team.id}`}
        className="mt-2 inline-block underline-offset-4 underline hover:text-blue-400"
        target="_blank"
        rel="noreferrer"
      >
        Team link
      </a>
    </Card>
  );
}

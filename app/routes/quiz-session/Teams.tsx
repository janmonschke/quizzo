import type { AwardedPoints, Team } from "@prisma/client";
import { useMemo } from "react";
import { Card } from "~/components/Card";
import { parseArrayString } from "~/helpers/string_arrays";

type LoadedTeam = Team & { AwardedPoints: AwardedPoints[] };

export default function Teams({ teams }: { teams: LoadedTeam[] }) {
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
        <TeamComponent key={team.name} team={team} />
      ))}
    </div>
  );
}

function TeamComponent({ team }: { team: LoadedTeam }) {
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
    </Card>
  );
}

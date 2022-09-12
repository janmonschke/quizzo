import type { AwardedPoints, Team } from "@prisma/client";
import { parseArrayString } from "~/helpers/string_arrays";

type LoadedTeam = Team & { AwardedPoints: AwardedPoints[] };

export default function Teams({ teams }: { teams: LoadedTeam[] }) {
  return (
    <div>
      {teams.map((team) => (
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
  return (
    <ul>
      <li key={team.name}>
        <strong>{team.name}</strong>
      </li>
      {members.map((member) => (
        <li key={member}>{member}</li>
      ))}
      <li key="points">{points} points</li>
    </ul>
  );
}

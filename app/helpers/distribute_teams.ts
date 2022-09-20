type GeneratedTeam = {
  name: string;
  players: string[];
};

export function distributeTeams({
  players,
  teamCount,
}: {
  players: string[];
  teamCount: number;
}): GeneratedTeam[] {
  // Generate empty teams
  const teams: GeneratedTeam[] = Array(teamCount)
    .fill(undefined)
    .map((_, index) => ({
      name: `Team ${index + 1}`,
      players: [],
    }));

  // Assign players to teams
  const playerCopy = [...players];
  while (playerCopy.length) {
    for (let team of teams) {
      // assign a random player to the team
      const randomPlayerIndex = Math.floor(Math.random() * playerCopy.length);
      team.players.push(playerCopy[randomPlayerIndex]);

      // remove the player from the list of available players
      playerCopy.splice(randomPlayerIndex, 1);

      // If there are no more players, stop the assignments
      if (playerCopy.length === 0) {
        break;
      }
    }
  }

  return teams;
}

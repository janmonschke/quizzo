import { describe, expect, it } from "vitest";
import { distributeTeams } from "./distribute_teams";

describe("Distribute teams", () => {
  it("correctly distributes players into teams", () => {
    // Even teams
    expect(distributeTeams({ players: ["a", "b"], teamCount: 2 })).toEqual([
      { name: "Team 1", players: expect.objectContaining({ length: 1 }) },
      { name: "Team 2", players: expect.objectContaining({ length: 1 }) },
    ]);
    expect(
      distributeTeams({ players: ["a", "b", "c", "d"], teamCount: 2 })
    ).toEqual([
      { name: "Team 1", players: expect.objectContaining({ length: 2 }) },
      { name: "Team 2", players: expect.objectContaining({ length: 2 }) },
    ]);

    // Uneven teams
    expect(
      distributeTeams({ players: ["a", "b", "c", "d"], teamCount: 3 })
    ).toEqual([
      { name: "Team 1", players: expect.objectContaining({ length: 2 }) },
      { name: "Team 2", players: expect.objectContaining({ length: 1 }) },
      { name: "Team 3", players: expect.objectContaining({ length: 1 }) },
    ]);

    // Empty teams
    expect(
      distributeTeams({ players: ["a", "b", "c", "d"], teamCount: 5 })
    ).toEqual([
      { name: "Team 1", players: expect.objectContaining({ length: 1 }) },
      { name: "Team 2", players: expect.objectContaining({ length: 1 }) },
      { name: "Team 3", players: expect.objectContaining({ length: 1 }) },
      { name: "Team 4", players: expect.objectContaining({ length: 1 }) },
      { name: "Team 5", players: expect.objectContaining({ length: 0 }) },
    ]);
  });
});

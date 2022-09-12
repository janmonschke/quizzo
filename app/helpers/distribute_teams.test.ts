import { distributeTeams } from "./distribute_teams";

describe("Distribute teams", () => {
  it("correctly distributes players into teams", () => {
    // Even teams
    expect(distributeTeams({ players: ["a", "b"], teamCount: 2 })).toEqual([
      { name: "1", players: expect.objectContaining({ length: 1 }) },
      { name: "2", players: expect.objectContaining({ length: 1 }) },
    ]);
    expect(
      distributeTeams({ players: ["a", "b", "c", "d"], teamCount: 2 })
    ).toEqual([
      { name: "1", players: expect.objectContaining({ length: 2 }) },
      { name: "2", players: expect.objectContaining({ length: 2 }) },
    ]);

    // Uneven teams
    expect(
      distributeTeams({ players: ["a", "b", "c", "d"], teamCount: 3 })
    ).toEqual([
      { name: "1", players: expect.objectContaining({ length: 2 }) },
      { name: "2", players: expect.objectContaining({ length: 1 }) },
      { name: "3", players: expect.objectContaining({ length: 1 }) },
    ]);

    // Empty teams
    expect(
      distributeTeams({ players: ["a", "b", "c", "d"], teamCount: 5 })
    ).toEqual([
      { name: "1", players: expect.objectContaining({ length: 1 }) },
      { name: "2", players: expect.objectContaining({ length: 1 }) },
      { name: "3", players: expect.objectContaining({ length: 1 }) },
      { name: "4", players: expect.objectContaining({ length: 1 }) },
      { name: "5", players: expect.objectContaining({ length: 0 }) },
    ]);
  });
});

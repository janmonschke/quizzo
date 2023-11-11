import { describe, expect, it } from "vitest";
import { getNewPosition } from "./get_new_position";

const positivePositions = [
  {
    position: 1,
  },
  {
    position: 1.5,
  },
  { position: 2 },
];

const negativePositions = [
  {
    position: -2,
  },
  {
    position: -1.5,
  },
  { position: -1 },
];

const mixedPositions = [
  {
    position: -2,
  },
  {
    position: -1,
  },
  { position: 1 },
];

describe("getNewPosition", () => {
  it("gets the correct position when the new position is the first one in the list", () => {
    expect(
      getNewPosition({ newIndex: 0, oldIndex: 0, items: positivePositions })
    ).toBe(0);
    expect(
      getNewPosition({ newIndex: 0, oldIndex: 0, items: negativePositions })
    ).toBe(-3);
    expect(
      getNewPosition({ newIndex: 0, oldIndex: 0, items: mixedPositions })
    ).toBe(-3);
  });

  it("gets the correct position when the new position is the last one in the list", () => {
    expect(
      getNewPosition({ newIndex: 2, oldIndex: 0, items: positivePositions })
    ).toBe(3);
    expect(
      getNewPosition({ newIndex: 2, oldIndex: 0, items: negativePositions })
    ).toBe(0);
    expect(
      getNewPosition({ newIndex: 2, oldIndex: 0, items: mixedPositions })
    ).toBe(2);
  });

  it("gets the correct position when the new position is in the middle of the list (and moving up)", () => {
    expect(
      getNewPosition({ newIndex: 1, oldIndex: 2, items: positivePositions })
    ).toBe(1.25);
    expect(
      getNewPosition({
        newIndex: 1,
        oldIndex: 2,
        items: negativePositions,
      })
    ).toBe(-1.75);
    expect(
      getNewPosition({ newIndex: 1, oldIndex: 2, items: mixedPositions })
    ).toBe(-1.5);
  });

  it("gets the correct position when the new position is in the middle of the list (and moving down)", () => {
    expect(
      getNewPosition({ newIndex: 1, oldIndex: 0, items: positivePositions })
    ).toBe(1.75);
    expect(
      getNewPosition({
        newIndex: 1,
        oldIndex: 0,
        items: negativePositions,
      })
    ).toBe(-1.25);
    expect(
      getNewPosition({ newIndex: 1, oldIndex: 0, items: mixedPositions })
    ).toBe(0);
  });
});

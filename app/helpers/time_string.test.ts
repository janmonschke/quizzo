import { timeString } from "./time_string";

describe("timestring", () => {
  it("outputs the correctly formatted string", () => {
    expect(timeString(0)).toBe("00:00");
    expect(timeString(1)).toBe("00:01");
    expect(timeString(10)).toBe("00:10");
    expect(timeString(60)).toBe("01:00");
    expect(timeString(77)).toBe("01:17");
    expect(timeString(121)).toBe("02:01");
  });
});

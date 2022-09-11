import { parserAnswerOptions, serializeAnswerOptions } from "./answer_options";

describe("Answer options", () => {
  describe("parse", () => {
    it("parses incorrect strings to empty arrays", () => {
      expect(parserAnswerOptions()).toEqual([]);
    });

    it("parses correct string correctly", () => {
      expect(parserAnswerOptions("one option")).toEqual(["one option"]);
      expect(
        parserAnswerOptions(
          serializeAnswerOptions(["option one", "option two"])
        )
      ).toEqual(["option one", "option two"]);
    });
  });

  describe("serialize", () => {
    it("serializes arrays correctly", () => {
      expect(serializeAnswerOptions(["one"])).toEqual("one");
      expect(serializeAnswerOptions(["one", "two"])).toEqual("one||two");
    });
  });
});

import { describe, expect, it } from "vitest";
import { parseArrayString, serializeArrayString } from "./string_arrays";

describe("Array strings", () => {
  describe("parse", () => {
    it("parses incorrect strings to empty arrays", () => {
      expect(parseArrayString()).toEqual([]);
    });

    it("parses correct strings correctly", () => {
      expect(parseArrayString("one option")).toEqual(["one option"]);
      expect(
        parseArrayString(serializeArrayString(["option one", "option two"]))
      ).toEqual(["option one", "option two"]);
    });
  });

  describe("serialize", () => {
    it("serializes arrays correctly", () => {
      expect(serializeArrayString(["one"])).toEqual("one");
      expect(serializeArrayString(["one", "two"])).toEqual("one||two");
    });
  });
});

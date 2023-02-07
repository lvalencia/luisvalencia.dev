import { describe, it, expect } from "vitest";
import { hasOwnProperty } from "../object";

describe("object utils", () => {
  describe("#hasOwnProperty", () => {
    it("returns true", () => {
      const a = {
        a: "a",
      };
      expect(hasOwnProperty(a, "a")).toBe(true);
    });
    it("returns false", () => {
      const b = {
        b: "b",
      };
      expect(hasOwnProperty(b, "a")).toBe(false);
    });
  });
});

import { describe, it, expect } from "vitest";
import { fromMaybe, isSomething } from "../maybe";

describe("maybe utils", () => {
  describe("#isSomething", () => {
    it("indicates false", () => {
      expect(isSomething(undefined)).toBeFalsy();
      expect(isSomething(null)).toBeFalsy();
    });
    it("indicates true", () => {
      expect(isSomething(0)).toBeTruthy();
      expect(isSomething("hello")).toBeTruthy();
      expect(isSomething([])).toBeTruthy();
      expect(isSomething({})).toBeTruthy();
    });
  });
  describe("#fromMaybe", () => {
    it("returns unrwapped maybe value", () => {
      const something = 0;
      const fallback = 10;
      const result = fromMaybe({
        maybe: something,
        fallback,
      });
      expect(result).equals(something);
    });
    it("returns fallback value", () => {
      const fallback = 10;
      let result = fromMaybe({
        maybe: undefined,
        fallback,
      });
      expect(result).equals(fallback);

      result = fromMaybe({
        maybe: null,
        fallback,
      });

      expect(result).equals(fallback);
    });
  });
});

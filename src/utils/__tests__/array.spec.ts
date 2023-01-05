import { describe, it, expect } from "vitest";
import { range } from "../array";

describe("array utils", () => {
  describe("range", () => {
    const size = 10;
    it("creates an array of the specified size", () => {
      let array = range({ size });
      expect(array.length).equals(size);

      const differentSize = 15;
      array = range({ size: differentSize });
      expect(array.length).equals(differentSize);
    });
    it("defaults to 0 for negative size", () => {
      const array = range({ size: -10 });
      expect(array.length).equals(0);
    });
    it("starts at 0", () => {
      const array = range({ size });
      expect(array[0]).equals(0);
    });
    it("starts at the number specified", () => {
      const startAt = 5;
      const array = range({ size, startAt });
      expect(array[0]).equals(startAt);
    });
  });
});

import { fromNullableOrThrow, isNonNull } from "@/null";
import { expect } from "chai";

describe("null", () => {
  describe("#isNonNull", () => {
    it("indicates false", () => {
      expect(isNonNull(undefined)).to.be.false;
      expect(isNonNull(null)).to.be.false;
    });
    it("indicates true", () => {
      expect(isNonNull(0)).to.be.true;
      expect(isNonNull("hello")).to.be.true;
      expect(isNonNull([])).to.be.true;
      expect(isNonNull({})).to.be.true;
    });
  });
  describe("#fromNullableOrThrow", () => {
    it("returns unwrapped null value", () => {
      const something = 0;
      const result = fromNullableOrThrow({
        nullable: something,
        error: "it threw but shouldn't have"
      });
      expect(result).equals(something);
    });
    it("throws", () => {
      const error = "error";
      const throwableCases = [
        undefined,
        null
      ];
      for(const throwableCase of throwableCases) {
        expect(() => {
          fromNullableOrThrow({
            nullable: throwableCase,
            error
          });
        }).to.throw(error);
      }
    });
  });
});

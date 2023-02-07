import {expect} from 'chai';
import {isSomething,fromMaybe} from '@/maybe';

describe("maybe", () => {
  describe("#isSomething", () => {
    it("indicates false", () => {
      expect(isSomething(undefined)).to.be.false;
    });
    it("indicates true", () => {
      expect(isSomething(0)).to.be.true;
      expect(isSomething("hello")).to.be.true;
      expect(isSomething([])).to.be.true;
      expect(isSomething({})).to.be.true;
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
      const result = fromMaybe({
        maybe: undefined,
        fallback,
      });
      expect(result).equals(fallback);
    });
  });
});

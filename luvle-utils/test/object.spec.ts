import {expect} from 'chai';
import {hasOwnProperty} from '@/object';

describe("object", () => {
  describe("#hasOwnProperty", () => {
    it("returns true", () => {
      const a = {
        a: "a",
      };
      expect(hasOwnProperty(a, "a")).to.be.true;
    });
    it("returns false", () => {
      const b = {
        b: "b",
      };
      expect(hasOwnProperty(b, "a")).to.be.false;
    });
  });
});

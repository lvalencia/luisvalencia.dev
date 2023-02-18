import {expect} from 'chai';
import {stringIsSomething} from '@/string';

describe("string", () => {
  describe("#stringIsSomething", () => {
    it("indicates false", () => {
      expect(stringIsSomething(undefined)).to.be.false;
      expect(stringIsSomething("")).to.be.false;
    });
    it("indicates true", () => {
      expect(stringIsSomething("hello")).to.be.true;
    });
  });
})
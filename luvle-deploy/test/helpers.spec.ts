import { prettyJSON } from '@/src/helpers';
import { expect } from 'chai';

describe("Helpers", () => {
  describe("#prettyJSON", () => {
    it("converts an object to a well formatted JSON string", () => {
      const obj = {
        a: 1,
        b: null,
        c: {
          d: 'd',
          e: 1.6,
        },
      };
      const expected = '{\n  "a": 1,\n  "b": null,\n  "c": {\n    "d": "d",\n    "e": 1.6\n  }\n}';
      expect(prettyJSON(obj)).to.equal(expected);
    });
  });
});

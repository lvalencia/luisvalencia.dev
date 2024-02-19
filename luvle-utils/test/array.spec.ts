import {expect} from 'chai';
import {difference, range, removeIfFound} from '@/array';

describe("array", () => {
  describe("#range", () => {
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
  describe("#difference", () => {
    it("subtracts one array from another", () => {
      interface TestCase<T> {
        a:T[];
        b:T[];
        result: T[]
      }
      const cases: TestCase<number | string>[] = [
        // Intersections
        {
          a: [1,2,3],
          b: [2,3,4],
          result: [1]
        },
        {
          a: [2,3,4],
          b: [1,2,3],
          result: [4]
        },
        // Type String
        {
          a: ['a', 'b', 'c'],
          b: ['c', 'd', 'e'],
          result: ['a', 'b']
        },
        {
          a: ['c', 'd', 'e'],
          b: ['a', 'b', 'c'],
          result: ['d', 'e']
        },
        {
          a: ["banana", "apple", "grape"],
          b: ["apple", "grape", "cherry"],
          result: ["banana"]
        },
        // Empty 
        {
          a: [1,2,3],
          b: [],
          result: [1,2,3]
        },
        {
          a: [],
          b: [1,2,3],
          result: []
        },
        {
          a: [],
          b: [],
          result: []
        },
        // Superset 
        {
          a: [1,2,3],
          b: [0,1,2,3,4],
          result: []
        },
        // Subset
        {
          a: [0,1,2,3,4],
          b: [1,2,3],
          result: [0,4]
        },
      ];

      for(const {a,b,result} of cases) {
        const diff = difference(a, b);
        expect(diff).eql(result);
      }
    });
  });
  describe("#range", () => {
    it("generates a range starting at 0 to the specified size", () => {
      const expected = [0,1,2,3,4];
      const result = range({size: 5});
      expect(result).eql(expected);
    });
    it("generates a range starting at specified start to the specified size", () => {
      const expected = [5,6,7,8,9];
      const result = range({size: 5, startAt: 5});
      expect(result).eql(expected);
    });
    it("generates empty range", () => {
      const expected: number[] = [];

      const sizes = [
        -1,
        0
      ];

      for(const size of sizes) {
        const result = range({size});
        expect(result).eql(expected);
      }
    });
  });
  describe("removeIfFound", () => {
    it("removes the element from the array", () => {
      const expected = [1,3,4];

      const original = [1,2,3,4];
      const result = removeIfFound(2, original);

      expect(result).eql(expected);

      // Verify non-destructive
      expect(original).eql([1,2,3,4]);
    });
    it("doesn't do remove anything", () => {
      const expected = [1,2,3,4];

      const original = [1,2,3,4];
      const result = removeIfFound(5, original);

      expect(result).eql(expected);
      
      // Verify non-destructive
      expect(original).eql([1,2,3,4]);
    });
  });
});

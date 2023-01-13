import { describe, it, expect } from "vitest";
import { hasOwnProperty, pick, groupBy } from "../object";

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
  describe("#pick", () => {
    it("returns an object with the selected properties", () => {
      const object = {
        a: "a",
        b: "b",
        c: "c",
      };

      const selected = pick(object, "b", "c");

      expect(selected).toEqual({
        b: "b",
        c: "c",
      });
    });
    it("returns an empty object", () => {
      const empty = {};
      let selected = pick(empty, "b", "c");

      expect(selected).toEqual({});

      const object = {
        a: "a",
        b: "b",
        c: "c",
      };

      selected = pick(object, "r", "t");

      expect(selected).toEqual({});
    });
    it("returns an object with the selected properties if it has them", () => {
      const object = {
        a: "a",
        b: "b",
        c: "c",
      };

      const selected = pick(object, "q", "z", "x", "b", "c");

      expect(selected).toEqual({
        b: "b",
        c: "c",
      });
    });
  });
  describe("#groupBy", () => {
    const objects = [
      {
        status: "success",
        data: "success data 1,",
      },
      {
        status: "error",
        data: "error data 1",
      },
      {
        status: "success",
        data: "success data 2",
      },
      {
        status: "success",
        data: "success data 3",
      },
      {
        status: "error",
        data: "error data 2",
      },
      {
        status: "success",
        data: "success data 4",
      },
      {
        status: "success",
        data: "success data 5",
      },
      {
        status: "error",
        data: "error data 3",
      },
    ];
    it("groups an object array by the the unique values of the specified key in the objects", () => {
      const expected = {
        success: [
          {
            status: "success",
            data: "success data 1,",
          },
          {
            status: "success",
            data: "success data 2",
          },
          {
            status: "success",
            data: "success data 3",
          },
          {
            status: "success",
            data: "success data 4",
          },
          {
            status: "success",
            data: "success data 5",
          },
        ],
        error: [
          {
            status: "error",
            data: "error data 1",
          },
          {
            status: "error",
            data: "error data 2",
          },
          {
            status: "error",
            data: "error data 3",
          },
        ],
      };

      expect(groupBy(objects, "status")).toEqual(expected);
    });
    it("returns an empty object", () => {
      const expected = {};

      expect(groupBy(objects, "nonExistentKey")).toEqual(expected);
    });
    it("groups an object array with the by the unique values of th specified key in the object, but omits objects without that key", () => {
      const unsanitizedObjects = [
        {
          status: "success",
          data: "success data 1,",
        },
        {
          status: "error",
          data: "error data 1",
        },
        {
          data: "unsanitized data 1",
        },
        {
          status: "success",
          data: "success data 2",
        },
        {
          status: "success",
          data: "success data 3",
        },
        {
          data: "unsanitized data 2",
        },
        {
          status: "error",
          data: "error data 2",
        },
        {
          status: "success",
          data: "success data 4",
        },
        {
          data: "unsanitized data 3",
        },
        {
          status: "success",
          data: "success data 5",
        },
        {
          status: "error",
          data: "error data 3",
        },
      ];
      const expected = {
        success: [
          {
            status: "success",
            data: "success data 1,",
          },
          {
            status: "success",
            data: "success data 2",
          },
          {
            status: "success",
            data: "success data 3",
          },
          {
            status: "success",
            data: "success data 4",
          },
          {
            status: "success",
            data: "success data 5",
          },
        ],
        error: [
          {
            status: "error",
            data: "error data 1",
          },
          {
            status: "error",
            data: "error data 2",
          },
          {
            status: "error",
            data: "error data 3",
          },
        ],
      };

      expect(groupBy(unsanitizedObjects, "status")).toEqual(expected);
    });
  });
});

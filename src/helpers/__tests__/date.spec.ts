import { describe, it, expect } from "vitest";
import { isISO8601String, toISO8601 } from "../date";

describe("data utils", () => {
  const iso8601Strings = [
    new Date(Date.parse("01 Jan 1970 00:00:00 GMT")).toISOString(),
    new Date(Date.parse("04 Dec 1995 00:12:00 GMT")).toISOString(),
  ];

  const notISO8601Strings = [
    "",
    "Regular String",
    "1834",
    "January 1st, 1970",
    "04 Dec 1995 00:12:00 GMT",
  ];

  describe("#isISO8601String", () => {
    it("indicates it's an ISO8601 string", () => {
      iso8601Strings.forEach((iso8601String) => {
        expect(isISO8601String(iso8601String)).toBe(true);
      });
    });
    it("indicates it's not an ISO8601 string", () => {
      notISO8601Strings.forEach((notISO8601String) => {
        expect(isISO8601String(notISO8601String)).toBe(false);
      });
    });
  });
  describe("#toISO8601", () => {
    it("returns a string", () => {
      iso8601Strings.forEach((iso8601String) => {
        expect(toISO8601(iso8601String)).toBeTruthy();
      });
    });
    it("returns nothing", () => {
      notISO8601Strings.forEach((notISO8601String) => {
        expect(toISO8601(notISO8601String)).toBeFalsy();
      });
    });
  });
});
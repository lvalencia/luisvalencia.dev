import { describe, it, expect } from "vitest";
import { Time } from "../time";

describe("Time", () => {
  describe("#inMilliseconds", () => {
    it("returns the time in milliseconds", () => {
      const seconds = 5;
      let time = new Time({ seconds });
      expect(time.inMilliseconds()).equals(5000);

      const milliSeconds = 1000;
      time = new Time({ milliSeconds });
      expect(time.inMilliseconds()).equals(milliSeconds);
    });
  });
  describe("#inSeconds", () => {
    it("returns the time in seconds", () => {
      const seconds = 5;
      let time = new Time({ seconds });
      expect(time.inSeconds()).equals(seconds);

      const milliSeconds = 1234;
      time = new Time({ milliSeconds });
      expect(time.inSeconds()).equals(1.234);
    });
  });
});

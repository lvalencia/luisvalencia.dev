import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useEnlarger, EnlargerState } from "../useEnlarger";
import type { EnlargerStore } from "../useEnlarger";

describe("EnlargerStore", () => {
  let enlarger: EnlargerStore;
  beforeEach(() => {
    setActivePinia(createPinia());
    enlarger = useEnlarger();
  });
  describe("#isEnlarged", () => {
    it("it indicates the enlarger is enlarged", () => {
      enlarger.enlargerState = EnlargerState.Enlarged;
      expect(enlarger.isEnlarged).toBe(true);
    });
    it("it indicates the enlarger is not enlarged", () => {
      enlarger.enlargerState = EnlargerState.NotEnlarged;
      expect(enlarger.isEnlarged).toBe(false);
    });
  });
  describe("#classObject", () => {
    it("sets large as truthy", () => {
      enlarger.enlargerState = EnlargerState.Enlarged;
      expect(enlarger.classObject.large).toBeTruthy();
    });
    it("sets large as falsy", () => {
      enlarger.enlargerState = EnlargerState.NotEnlarged;
      expect(enlarger.classObject.large).toBeFalsy();
    });
  });
  describe("#enlarge", () => {
    it("it changes the state to Enlarged from Enlarged", () => {
      enlarger.enlargerState = EnlargerState.Enlarged;
      enlarger.enlarge();
      expect(enlarger.enlargerState).toBe(EnlargerState.Enlarged);
    });
    it("it changes the state to NotEnlarged from Enlarged", () => {
      enlarger.enlargerState = EnlargerState.NotEnlarged;
      enlarger.enlarge();
      expect(enlarger.enlargerState).toBe(EnlargerState.Enlarged);
    });
  });
  describe("#reset", () => {
    it("it changes the state to Enlarged from NotEnlarged", () => {
      enlarger.enlargerState = EnlargerState.Enlarged;
      enlarger.reset();
      expect(enlarger.enlargerState).toBe(EnlargerState.NotEnlarged);
    });
    it("it changes the state to Enlarged from NotEnlarged", () => {
      enlarger.enlargerState = EnlargerState.NotEnlarged;
      enlarger.reset();
      expect(enlarger.enlargerState).toBe(EnlargerState.NotEnlarged);
    });
  });
});

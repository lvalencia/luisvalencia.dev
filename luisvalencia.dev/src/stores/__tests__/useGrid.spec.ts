import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useGrid, GridState, type GridStore } from "../useGrid";

describe("GridStore", () => {
  let grid: GridStore;
  beforeEach(() => {
    setActivePinia(createPinia());
    grid = useGrid();
  });
  describe("#isVisible", () => {
    it("it indicates the grid is visible", () => {
      grid.gridState = GridState.Visible;
      expect(grid.isVisible).toBe(true);
    });
    it("it indicates the grid is not visible", () => {
      grid.gridState = GridState.NotVisible;
      expect(grid.isVisible).toBe(false);
    });
  });
  describe("#classObject", () => {
    it("sets show as truthy", () => {
      grid.gridState = GridState.Visible;
      expect(grid.classObject.show).toBeTruthy();
    });
    it("sets show as falsy", () => {
      grid.gridState = GridState.NotVisible;
      expect(grid.classObject.show).toBeFalsy();
    });
  });
  describe("#toggleVisbility", () => {
    it("toggles the visibilty from visible to not visible", () => {
      grid.gridState = GridState.Visible;
      grid.toggleVisbility();
      expect(grid.gridState).toBe(GridState.NotVisible);
    });
    it("toggles the visibility from not visible to visible", () => {
      grid.gridState = GridState.NotVisible;
      grid.toggleVisbility();
      expect(grid.gridState).toBe(GridState.Visible);
    });
  });
});

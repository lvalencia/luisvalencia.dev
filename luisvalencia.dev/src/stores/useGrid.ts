import { defineStore } from "pinia";
import type { Store, StoreDefinition } from "pinia";

export enum GridState {
  Visible,
  NotVisible,
}

const GridStateTransition: Record<GridState, GridState> = {
  [GridState.Visible]: GridState.NotVisible,
  [GridState.NotVisible]: GridState.Visible,
};

interface GridStoreState {
  gridState: GridState;
}

export interface GridStoreClassObject {
  show: boolean;
}

type GridSymbol = "grid";
interface GridStoreGetters {
  isVisible(): boolean;
  classObject(): GridStoreClassObject;
}
interface GridStoreActions {
  toggleVisbility(): void;
}

export type GridStore = Store<
  GridSymbol,
  GridStoreState,
  GridStoreGetters,
  GridStoreActions
>;
type GridStoreDefinition = StoreDefinition<
  GridSymbol,
  GridStoreState,
  GridStoreGetters,
  GridStoreActions
>;

export const useGrid: GridStoreDefinition = defineStore("grid", {
  state(): GridStoreState {
    return {
      gridState: GridState.NotVisible,
    };
  },
  getters: {
    isVisible(): boolean {
      return this.gridState == GridState.Visible;
    },
    classObject(): GridStoreClassObject {
      return {
        show: this.isVisible,
      };
    },
  },
  actions: {
    toggleVisbility(): void {
      this.gridState = GridStateTransition[this.gridState];
    },
  },
});

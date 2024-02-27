import { defineStore } from "pinia";
import type { Store, StoreDefinition } from "pinia";

export enum EnlargerState { 
  Enlarged,
  NotEnlarged,
}

interface EnlargerStoreState {
  enlargerState: EnlargerState;
}

export interface EnlargerStoreClassObject {
  large: boolean;
}

type EnlargerSymbol = "enlarger";
interface EnlargerStoreGetters { 
  isEnlarged(): boolean;
  classObject(): EnlargerStoreClassObject;
}
interface EnlargerStoreActions {
  enlarge(): void;
  reset(): void;
}

export type EnlargerStore = Store<
  EnlargerSymbol,
  EnlargerStoreState,
  EnlargerStoreGetters,
  EnlargerStoreActions
>;
type EnlargerStoreDefinition = StoreDefinition<
  EnlargerSymbol,
  EnlargerStoreState,
  EnlargerStoreGetters,
  EnlargerStoreActions
>;

export const useEnlarger: EnlargerStoreDefinition = defineStore("enlarger", {
  state() : EnlargerStoreState {
    return {
      enlargerState: EnlargerState.NotEnlarged
    }
  },
  getters: {
    isEnlarged(): boolean {
      return this.enlargerState === EnlargerState.Enlarged
    },
    classObject(): EnlargerStoreClassObject {
      return {
        large: this.isEnlarged,
      }
    }
  },
  actions: {
    enlarge(): void {
      this.enlargerState = EnlargerState.Enlarged;
    },
    reset(): void {
      this.enlargerState = EnlargerState.NotEnlarged;
    }
  }
});
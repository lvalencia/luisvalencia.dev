import { PromiseCallback } from "@luvle/utils";

export interface Poller {
  poll<T>(callback: PromiseCallback<T>): Promise<T>;
}

export enum PollingStrategy {
  NoPolling = "NO_POLLING",
  PollingWithTimeout = "POLLING_WITH_TIMEOUT",
}

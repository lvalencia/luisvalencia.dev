import { Poller } from "./shared";

export class NoOpPoller implements Poller {
  public poll<T>(): Promise<T> {
    return Promise.resolve() as Promise<T>;
  }
}

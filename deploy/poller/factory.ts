import { IntervalPoller } from "./interval";
import { NoOpPoller } from "./noOp";
import { Poller, PollingStrategy } from "./shared";

interface PollerConstructor {
  new (...args: any[]): Poller;
}

const StrategyImplementationMapping: Record<
  PollingStrategy,
  PollerConstructor
> = {
  [PollingStrategy.NoPolling]: NoOpPoller,
  [PollingStrategy.PollingWithTimeout]: IntervalPoller,
};

export class PollerFactory {
  public static create(
    pollingStrategy: PollingStrategy,
    ...args: any[]
  ): Poller {
    return new StrategyImplementationMapping[pollingStrategy](...args);
  }
}

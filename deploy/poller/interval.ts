import { DefaultLogger, Logger } from "../logger";
import { fromMaybe, Time, PromiseCallback } from "../utils";
import { Poller } from "./shared";

type Timer = NodeJS.Timer;

interface IntervalPollerArgs {
  interval?: Time;
  timeout?: Time;
  logger?: Logger;
}

const SECOND_IN_MILLIS = 1_000;
const DEFAULT_INTERVAL_IN_MILLIS = SECOND_IN_MILLIS;
const DEFAULT_TIMEOUT_IN_MILLIS = 5 * SECOND_IN_MILLIS;

export class IntervalPoller implements Poller {
  private readonly logger: Logger;
  private readonly interval: Time;
  private readonly timeout: Time;
  private intervalId: Timer;
  private timeoutId: Timer;

  constructor(args?: IntervalPollerArgs) {
    const { interval, timeout, logger } = { ...args };

    this.interval = fromMaybe({
      maybe: interval,
      fallback: new Time({
        milliSeconds: DEFAULT_INTERVAL_IN_MILLIS,
      }),
    });

    this.timeout = fromMaybe({
      maybe: timeout,
      fallback: new Time({
        milliSeconds: DEFAULT_TIMEOUT_IN_MILLIS,
      }),
    });

    this.logger = fromMaybe({
      maybe: logger,
      fallback: DefaultLogger,
    });
  }

  public poll<T>(callback: PromiseCallback<T>): Promise<T> {
    this.logger.info(
      `Polling with interval ${this.interval.inMilliseconds()}ms and timeout ${this.timeout.inMilliseconds()}ms`
    );
    return new Promise<T>((resolve, reject) => {
      this.intervalId = setInterval(() => {
        callback(resolve);
      }, this.interval.inMilliseconds());
      this.timeoutId = setTimeout(() => {
        reject("Polling Timed-Out");
      }, this.timeout.inMilliseconds());
    })
      .catch((error) => {
        this.logger.error(error);
        return error;
      })
      .finally(() => {
        this.logger.info("Clearing Interval");
        clearInterval(this.intervalId);
        this.logger.info("Clearing Timeout");
        clearTimeout(this.timeoutId);
      });
  }
}

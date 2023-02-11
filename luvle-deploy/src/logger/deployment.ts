import {
  Formatter,
  PrefixFormatter,
  ReducerFormatter,
  TimestampFormatter,
} from "../formatter";
import { fromMaybe } from "@luvle/utils";
import { DefaultLogger, Logger } from "./shared";

export type LoggerOperations = keyof Logger;

interface DeploymentLoggerArgs {
  logger?: Logger;
  formatter?: Formatter;
}

export class DeploymentLogger implements Logger {
  private logger: Logger;
  private formatter: Formatter;

  constructor(args?: DeploymentLoggerArgs) {
    const { logger, formatter } = { ...args };

    this.logger = fromMaybe({
      maybe: logger,
      fallback: DefaultLogger,
    });

    this.formatter = fromMaybe({
      maybe: formatter,
      fallback: new ReducerFormatter({
        formatters: [
          new PrefixFormatter(),
          new PrefixFormatter({
            prefix: " - ",
          }),
          new TimestampFormatter(),
        ],
        ordering: (arr: any[]) => {
          return arr.reverse();
        },
      }),
    });
  }

  public debug(...data: any[]): void {
    this.write("debug", ...data);
  }
  public info(...data: any[]): void {
    this.write("info", ...data);
  }
  public log(...data: any[]): void {
    this.write("log", ...data);
  }
  public warn(...data: any[]): void {
    this.write("warn", ...data);
  }
  public error(...data: any[]): void {
    this.write("error", ...data);
  }

  private write(action: LoggerOperations, ...data: any[]): void {
    const output = this.formatter.format(` ${data}`);
    this.logger[action](output);
  }
}

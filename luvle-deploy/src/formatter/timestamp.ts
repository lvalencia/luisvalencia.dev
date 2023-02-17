import { fromMaybe } from "@luvle/utils";
import { Formatter } from "./shared";

enum TimestampFormat {
  ISOString,
}

type TimestampFormattingFunction = () => string;

interface TimestampFormatterArgs {
  timestampFormat: TimestampFormat;
}

export class TimestampFormatter implements Formatter {
  private timestampFormat: TimestampFormat;
  private formattingFunctions: Record<
    TimestampFormat,
    TimestampFormattingFunction
  > = {
    [TimestampFormat.ISOString]: this.ISOFormat,
  };

  constructor(args?: TimestampFormatterArgs) {
    const { timestampFormat } = { ...args };

    this.timestampFormat = fromMaybe({
      maybe: timestampFormat,
      fallback: TimestampFormat.ISOString,
    });
  }

  public format(...data: any[]): string {
    return `${this.timestamp} ${data}`;
  }

  private get timestamp(): string {
    return this.formattingFunctions[this.timestampFormat]();
  }

  private ISOFormat(): string {
    return new Date().toISOString();
  }
}

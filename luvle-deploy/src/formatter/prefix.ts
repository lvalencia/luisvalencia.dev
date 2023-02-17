import { fromMaybe } from "@luvle/utils";
import { Formatter } from "./shared";

interface PrefixFormatterArgs {
  prefix?: string;
}

const DEFAULT_FORMAT_PREFIX = "";

export class PrefixFormatter implements Formatter {
  private prefix: string;

  constructor(args?: PrefixFormatterArgs) {
    const { prefix } = { ...args };

    this.prefix = fromMaybe({
      maybe: prefix,
      fallback: DEFAULT_FORMAT_PREFIX,
    });
  }

  public format(...data: any[]): string {
    return `${this.prefix}${data}`;
  }
}

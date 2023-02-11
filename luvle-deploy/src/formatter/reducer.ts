import { fromMaybe } from "@luvle/utils";
import { Formatter } from "./shared";
import { identity } from "../helpers";

type OrderingFunction = (arr: any[]) => any[];

interface FormatterApplierArgs {
  formatters?: Formatter[];
  ordering?: OrderingFunction;
}

export class ReducerFormatter implements Formatter {
  private formatters: Formatter[];
  private ordering: OrderingFunction;

  constructor(args?: FormatterApplierArgs) {
    const { formatters, ordering } = { ...args };

    this.ordering = fromMaybe({
      maybe: ordering,
      fallback: identity,
    });

    this.formatters = this.ordering(
      fromMaybe({
        maybe: formatters,
        fallback: [],
      })
    );
  }

  public format(...data: any[]): string {
    return this.formatters.reduce((data, formatter) => {
      return formatter.format(data);
    }, `${data}`);
  }
}

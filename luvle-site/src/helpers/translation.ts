import type { Maybe } from "@luvle/utils";

type Vue18NTFunction = (str: string, o: any) => Maybe<string>;

export function translationOrNothing(
  t: Vue18NTFunction,
  str: Maybe<string>,
  args?: Maybe<any>
): Maybe<string> {
  return str ? t(str, args) : undefined;
}
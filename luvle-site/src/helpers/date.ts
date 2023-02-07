import type { Maybe } from "./maybe";

declare const ISO8601Symbol: unique symbol;
export type ISO8601 = string & { [ISO8601Symbol]: never };

export function isISO8601String(str: string): str is ISO8601 {
  const milliSecondsSinceLinuxEpoch = Date.parse(str) || 0;
  return new Date(milliSecondsSinceLinuxEpoch).toISOString() === str;
}

export function toISO8601(str: string): Maybe<ISO8601> {
  if (isISO8601String(str)) {
    return str as ISO8601;
  }
  return undefined;
}

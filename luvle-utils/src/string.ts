import { Maybe, isSomething as maybeIsSomething } from "./maybe";

export function stringIsSomething<T extends string>(maybe: Maybe<T>): maybe is T {
  return maybeIsSomething(maybe) && maybe !== "";
}
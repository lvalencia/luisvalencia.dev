import { isSomething, Maybe } from "./maybe";

export function isEmpty(arr: Maybe<any[]>): boolean {
  return isSomething(arr) && arr.length > 0;
}

export function difference<T>(source: T[], arr: T[]): T[] {
  return source.filter((element) => {
    return arr.indexOf(element) < 0;
  });
}

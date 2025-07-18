import { isSomething, Maybe } from "./maybe";

export function hasContents(arr: Maybe<any[]>): boolean {
  return isSomething(arr) && arr.length > 0;
}

export function difference<T>(source: T[], arr: T[]): T[] {
  return source.filter((element) => {
    return arr.indexOf(element) < 0;
  });
}

const { max } = Math;

interface RangeArgs {
  size: number;
  startAt?: number;
}

export function range({ size, startAt = 0 }: RangeArgs): ReadonlyArray<number> {
  size = max(size, 0);
  return [...Array(size).keys()].map((i) => i + startAt);
}

export function removeIfFound<T>(elem:T, source: T[]): T[] {
  const sourceCopy = source.slice();

  const index = sourceCopy.indexOf(elem);
  const inArray = index > -1;

  if (!inArray) return sourceCopy;
  
  sourceCopy.splice(index, 1);
  return sourceCopy;
}
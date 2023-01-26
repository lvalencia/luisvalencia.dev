const { max } = Math;

interface RangeArgs {
  size: number;
  startAt?: number;
}

export function range({ size, startAt = 0 }: RangeArgs): ReadonlyArray<number> {
  size = max(size, 0);
  return [...Array(size).keys()].map((i) => i + startAt);
}

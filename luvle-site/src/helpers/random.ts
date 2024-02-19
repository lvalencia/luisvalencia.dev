export function getRandomIntInclusive(lower: number, upper: number): number {
  const min = Math.ceil(lower);
  const max = Math.floor(upper);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function selectRandomFrom<T>(array: T[]): T {
  return array[getRandomIntInclusive(0, array.length - 1)];
}

export function popRandomFrom<T>(array: T[]): T {
  const index = getRandomIntInclusive(0, array.length - 1);
  return array.splice(index, 1)[0];
}
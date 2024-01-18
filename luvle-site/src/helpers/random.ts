
export function getRandomIntInclusive(lower: number, upper: number): number {
  const min = Math.ceil(lower);
  const max = Math.floor(upper);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
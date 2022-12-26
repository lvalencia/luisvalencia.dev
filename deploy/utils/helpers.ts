export function prettyJSON(object: any): string {
  return JSON.stringify(object, null, 2);
}

export function identity<T>(it: T): T {
  return it;
}

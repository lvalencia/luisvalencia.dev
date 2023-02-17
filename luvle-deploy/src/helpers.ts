export function prettyJSON(object: any): string {
  return JSON.stringify(object, null, 2);
}

import { fromMaybe } from "./maybe";

export function hasOwnProperty(object: object, property: PropertyKey): boolean {
  return Object.prototype.hasOwnProperty.call(object, property);
}

export function pick(object: object, ...properties: string[]): any {
  return properties.reduce((picked, property) => {
    if (hasOwnProperty(object, property)) {
      picked[property] = object[property];
    }
    return picked;
  }, {});
}

export function groupBy(objects: object[], key: string): any {
  return objects.reduce((grouped, object) => {
    grouped[object[key]] = fromMaybe({
      maybe: grouped[object[key]],
      fallback: [],
    });

    grouped[object[key]].push(object);
    return grouped;
  }, {});
}

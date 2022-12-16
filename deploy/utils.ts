import { existsSync } from 'fs';

export type Maybe<T> = T | undefined | null;

export function isSomething<T>(maybe: Maybe<T>): maybe is T {
    return maybe !== undefined && maybe !== null;
}

interface FromMaybeArgs<T> {
    fallback: T,
    maybe: Maybe<T>
}

export function fromMaybe<T>({fallback, maybe}: FromMaybeArgs<T>): T {
    if (isSomething(maybe)) {
        return maybe as T;
    }
    return fallback;
}

declare const ValidPathSymbol: unique symbol;
export type ValidFilePath = string & { [ValidPathSymbol]: never };

export function isValidFilePath(path: Maybe<string>): path is ValidFilePath {
    return isSomething(path) && existsSync(path);
}

export function prettyJSON(object: any): string {
    return JSON.stringify(object, null, 2);
}

export function pick(object: object, ...properties: string[]): any {
    return properties.reduce((picked, property) => {
        if (object.hasOwnProperty(property)){
            picked[property] = object[property];
        }
        return picked;
    }, {});
}

export function groupBy(objects: object[], key: string): any {
    return objects.reduce((grouped, object) => {
        grouped[object[key]] =  fromMaybe({
            maybe: grouped[object[key]],
            fallback: []
        });
        
        grouped[object[key]].push(object);
        return grouped;
    }, {});
}

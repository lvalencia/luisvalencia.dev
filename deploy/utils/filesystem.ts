import { existsSync } from 'fs';
import { isSomething, Maybe } from './maybe';

declare const ValidPathSymbol: unique symbol;
export type ValidFilePath = string & { [ValidPathSymbol]: never };

export function isValidFilePath(path: Maybe<string>): path is ValidFilePath {
    return isSomething(path) && existsSync(path);
}

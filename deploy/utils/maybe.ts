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

import { fromMaybeOrThrow, isSomething, Maybe } from "./maybe";

export type Nullable<T> = Maybe<T> | null;

export function isNonNull<T>(nullable: Nullable<T>): nullable is T {
  return isSomething(nullable) && nullable !== null;
}

interface FromNullableOrThrowArgs<T> {
  nullable: Nullable<T>;
  error: string;
}
export function fromNullableOrThrow<T>({nullable, error}: FromNullableOrThrowArgs<T>): T {
  const possiblyNull = fromMaybeOrThrow({
    maybe: nullable,
    error
  });
  if (!isNonNull(possiblyNull)) {
    throw new Error(error);
  }
  return nullable as T;
}
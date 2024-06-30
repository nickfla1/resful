import { kOptionKind } from "./symbols.js";

const KIND_SOME = "some" as const;
const KIND_NONE = "none" as const;

export type Some<T> = {
  readonly data: T;
  readonly [kOptionKind]: typeof KIND_SOME;
};

export type None = {
  readonly [kOptionKind]: typeof KIND_NONE;
};

export type Option<T> = Some<T> | None;

const NONE: None = Object.freeze({ [kOptionKind]: KIND_NONE });

export function some<T>(data: T): Some<T> {
  return Object.freeze({ data, [kOptionKind]: KIND_SOME });
}

export function none(): None {
  return NONE;
}

export function isSome<T>(maybeSome: Option<T>): maybeSome is Some<T> {
  return maybeSome[kOptionKind] === KIND_SOME;
}

export function isNone<T>(maybeNone: Option<T>): maybeNone is None {
  return maybeNone[kOptionKind] === KIND_NONE;
}

export function isOption<T = unknown>(
  maybeOption: unknown
): maybeOption is Option<T> {
  return (
    !!maybeOption &&
    typeof maybeOption === "object" &&
    kOptionKind in maybeOption
  );
}

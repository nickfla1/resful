import { UnwrapError } from "./error.js";
import { type Option, some } from "./option.js";
import { type Result, err, isErr, isOk, isResult, ok } from "./result.js";

export function unwrap<T, E>(res: Result<T, E>): T {
  if (isErr(res)) {
    throw new UnwrapError(res.err);
  }

  return res.data;
}

export function unwrapOr<T, O extends T>(opt: Option<T>, fallback: O): T | O;
export function unwrapOr<T, E, O extends T>(
  res: Result<T, E>,
  fallback: O
): T | O;
export function unwrapOr<T, E, O extends T>(
  resOrOpt: Result<T, E> | Option<T>,
  fallback: O
): T | O {
  if ("data" in resOrOpt) {
    return resOrOpt.data;
  }

  return fallback;
}

export function map<T, R>(opt: Option<T>, fn: (t: T) => R): Option<R>;
export function map<T, E, R>(res: Result<T, E>, fn: (t: T) => R): Result<R, E>;
export function map<T, E, R>(
  resOrOpt: Result<T, E> | Option<T>,
  fn: (t: T) => R
): Result<R, E> | Option<R> {
  if ("data" in resOrOpt) {
    const mapped = fn(resOrOpt.data);

    return isResult(resOrOpt) ? ok(mapped) : some(mapped);
  }

  return resOrOpt;
}

export const mapErr = <T, E, R>(
  res: Result<T, E>,
  fn: (e: E) => R
): Result<T, R> => {
  if (isErr(res)) {
    return err(fn(res.err));
  }

  return res;
};

function handleRunError(e: unknown) {
  if (e instanceof UnwrapError) {
    return err(e.originalError);
  }

  throw e;
}

export function run<T, E>(fn: () => Result<T, E>): Result<T, E>;
export function run<T, E>(
  fn: () => Promise<Result<T, E>>
): Promise<Result<T, E>>;
export function run<T, E>(
  fn: () => Promise<Result<T, E>> | Result<T, E>
): Promise<Result<T, E>> | Result<T, E> {
  try {
    const value = fn();

    if (value instanceof Promise) {
      return value.catch((e) => handleRunError(e));
    }

    return value;
  } catch (e) {
    return handleRunError(e);
  }
}

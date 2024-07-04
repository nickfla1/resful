import { RunError, UnwrapError } from "./error.js";
import { type Option, type Some, some } from "./option.js";
import { type OkResult, type Result, err, isErr, isResult, ok } from "./result.js";

export function unwrap<T, E>(res: Result<T, E>): T {
  if (isErr(res)) {
    throw new UnwrapError(res.err);
  }

  return res.data;
}

export function unwrapOr<T, O extends T>(opt: Option<T>, fallback: O): T | O;
export function unwrapOr<T, E, O extends T>(res: Result<T, E>, fallback: O): T | O;
export function unwrapOr<T, E, O extends T>(resOrOpt: Result<T, E> | Option<T>, fallback: O): T | O {
  if ("data" in resOrOpt) {
    return resOrOpt.data;
  }

  return fallback;
}

export function map<T, R>(opt: Option<T>, fn: (t: T) => R): Option<R>;
export function map<T, E, R>(res: Result<T, E>, fn: (t: T) => R): Result<R, E>;
export function map<T, E, R>(resOrOpt: Result<T, E> | Option<T>, fn: (t: T) => R): Result<R, E> | Option<R> {
  if ("data" in resOrOpt) {
    const mapped = fn(resOrOpt.data);

    return isResult(resOrOpt) ? ok(mapped) : some(mapped);
  }

  return resOrOpt;
}

export const mapErr = <T, E, R>(res: Result<T, E>, fn: (e: E) => R): Result<T, R> => {
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

function handleSafeError(e: unknown) {
  if (e instanceof UnwrapError) {
    return err(e.originalError);
  }

  return err(new RunError(e));
}

export function run<T, E>(fn: () => Result<T, E>): Result<T, E>;
export function run<T, E>(fn: () => Promise<Result<T, E>>): Promise<Result<T, E>>;
export function run<T, E>(fn: () => Promise<Result<T, E>> | Result<T, E>): Promise<Result<T, E>> | Result<T, E> {
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

export function safe<T, E>(fn: () => Result<T, E>): Result<T, E | RunError>;
export function safe<T, E>(fn: () => Promise<Result<T, E>>): Promise<Result<T, E | RunError>>;
export function safe<T, E>(
  fn: () => Promise<Result<T, E>> | Result<T, E>
): Promise<Result<T, E | RunError>> | Result<T, E | RunError> {
  try {
    const value = fn();

    if (value instanceof Promise) {
      return value.catch((e) => handleSafeError(e));
    }

    return value;
  } catch (e) {
    return handleSafeError(e);
  }
}

export function box<T, E, A extends unknown[]>(fn: (...args: A) => Result<T, E>): (...args: A) => Result<T, E>;
export function box<T, E, A extends unknown[]>(
  fn: (...args: A) => Promise<Result<T, E>>
): (...args: A) => Promise<Result<T, E>>;
export function box<T, E, A extends unknown[]>(
  fn: (...args: A) => Promise<Result<T, E>> | Result<T, E>
): (...args: A) => Promise<Result<T, E>> | Result<T, E> {
  // TODO: type-casting seems to be required though the type overloading should be enough
  return (...args) => run(() => (fn as (...args: A) => Result<T, E>)(...args));
}

export function safeBox<T, E, A extends unknown[]>(
  fn: (...args: A) => Result<T, E>
): (...args: A) => Result<T, E | RunError>;
export function safeBox<T, E, A extends unknown[]>(
  fn: (...args: A) => Promise<Result<T, E>>
): (...args: A) => Promise<Result<T, E | RunError>>;
export function safeBox<T, E, A extends unknown[]>(
  fn: (...args: A) => Promise<Result<T, E>> | Result<T, E>
): (...args: A) => Promise<Result<T, E | RunError>> | Result<T, E | RunError> {
  // TODO: type-casting seems to be required though the type overloading should be enough
  return (...args) => safe(() => (fn as (...args: A) => Result<T, E>)(...args));
}

export type OkOf<R> = R extends OkResult<infer T> ? T : never;
export type SomeOf<O> = O extends Some<infer T> ? T : never;

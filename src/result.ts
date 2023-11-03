export type OkResult<T> = { readonly ok: T };
export type ErrResult<E> = { readonly err: E };
export type Result<T, E> = OkResult<T> | ErrResult<E>;

export const ok = <T>(data: T): OkResult<T> => Object.freeze({ ok: data });
export const err = <E>(error: E): ErrResult<E> => Object.freeze({ err: error });

export const isOk = <T, E>(maybeOk: Result<T, E>): maybeOk is OkResult<T> =>
  "ok" in maybeOk;
export const isErr = <T, E>(maybeErr: Result<T, E>): maybeErr is ErrResult<E> =>
  "err" in maybeErr;

export const unwrap = <T, E>(res: Result<T, E>): T | never => {
  if (isErr(res)) {
    throw new TypeError("failed to unwrap result");
  }

  return res.ok;
};

export const unwrapOr = <T, E, O extends T>(
  res: Result<T, E>,
  fallback: O
): T | O => {
  if (isErr(res)) {
    return fallback;
  }

  return res.ok;
};

export type MapFn<T, R> = (item: T) => R;

export const map = <T, E, R>(res: Result<T, E>, fn: MapFn<T, R>): R | never =>
  fn(unwrap(res));

export const mapErr = <T, E, R>(
  res: Result<T, E>,
  fn: MapFn<E, R>
): R | never => {
  if (isOk(res)) {
    throw new TypeError("cannot error map an ok result");
  }

  return fn(res.err);
};

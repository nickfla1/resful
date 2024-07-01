import { kResultKind } from "./symbols.js";

const KIND_OK = "ok";
const KIND_ERR = "err";

export type OkResult<T> = { readonly data: T; [kResultKind]: typeof KIND_OK };
export type ErrResult<E> = { readonly err: E; [kResultKind]: typeof KIND_ERR };

export type Result<T, E> = OkResult<T> | ErrResult<E>;

export function ok<T>(data: T): OkResult<T> {
  return Object.freeze({ data, [kResultKind]: KIND_OK });
}

export function err<E>(err: E): ErrResult<E> {
  return Object.freeze({ err, [kResultKind]: KIND_ERR });
}

export function isOk<T, E>(maybeOk: Result<T, E>): maybeOk is OkResult<T> {
  return maybeOk[kResultKind] === KIND_OK;
}

export function isErr<T, E>(maybeErr: Result<T, E>): maybeErr is ErrResult<E> {
  return maybeErr[kResultKind] === KIND_ERR;
}

export function isResult<T = unknown, E = unknown>(maybeResult: unknown): maybeResult is Result<T, E> {
  return !!maybeResult && typeof maybeResult === "object" && kResultKind in maybeResult;
}

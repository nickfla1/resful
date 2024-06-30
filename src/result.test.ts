import { expect, test } from "vitest";
import { err, isErr, isOk, isResult, ok } from "./result.js";
import { kResultKind } from "./symbols.js";

test("creates an immutable ok result", () => {
  const res = ok("hello");

  expect(res).toEqual({ data: "hello", [kResultKind]: "ok" });

  expect(() => {
    /* @ts-expect-error  */
    res.data = "goodbye";
  }).toThrowError(/^Cannot assign to read only property 'data'*/i);
});

test("creates an immutable error result", () => {
  const res = err("badcode");

  expect(res).toEqual({ err: "badcode", [kResultKind]: "err" });

  expect(() => {
    /* @ts-expect-error  */
    res.err = "goodbye";
  }).toThrowError(/^Cannot assign to read only property 'err'*/i);
});

test("isOk returns true if result is ok", () => {
  expect(isOk(ok("hello"))).toBeTruthy();
  expect(isOk(err("badcode"))).toBeFalsy();
});

test("isErr returns true if result is an error", () => {
  expect(isErr(err("badcode"))).toBeTruthy();
  expect(isErr(ok("hello"))).toBeFalsy();
});

test("isResult returns true if the input is a result", () => {
  expect(isResult(ok("hello"))).toBeTruthy();
  expect(isResult(err("nope"))).toBeTruthy();
  expect(isResult(123)).toBeFalsy();
  expect(isResult({})).toBeFalsy();
});

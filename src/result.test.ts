import { expect, test } from "vitest";
import { ok, err, isOk, isErr, unwrap, unwrapOr, map, mapErr } from "./result";

test("creates an immutable ok result", () => {
  const res = ok("hello");

  expect(res).toEqual({ ok: "hello" });

  expect(() => {
    /* @ts-expect-error  */
    res.ok = "goodbye";
  }).toThrowError(/^Cannot assign to read only property 'ok'*/i);
});

test("creates an immutable error result", () => {
  const res = err("badcode");

  expect(res).toEqual({ err: "badcode" });

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

test("should unwrap a success result", () => {
  expect(unwrap(ok("hello"))).toStrictEqual("hello");
});

test("should throw if we try to unwrap an error", () => {
  expect(() => {
    unwrap(err("hello"));
  }).toThrowError(/failed to unwrap/);
});

test("should return a fallback if an error is unwrapped", () => {
  expect(unwrapOr(err("badcode"), "hello")).toStrictEqual("hello");
});

test("it should map a result", () => {
  expect(map(ok("hello"), (str) => str.toUpperCase())).toStrictEqual("HELLO");
});

test("it should map an error result", () => {
  expect(
    mapErr(err("badcode"), (str) => str.replace("bad", "good"))
  ).toStrictEqual("goodcode");
});

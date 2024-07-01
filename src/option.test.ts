import { expect, test } from "vitest";
import { isNone, isOption, isSome, none, some } from "./option.js";
import { kOptionKind } from "./symbols.js";

test("creates an immutable option", () => {
  const res = some("hello");

  expect(res).toEqual({ data: "hello", [kOptionKind]: "some" });

  expect(() => {
    /* @ts-expect-error  */
    res.data = "goodbye";
  }).toThrowError(/^Cannot assign to read only property 'data'*/i);
});

test("creates an immutable none option", () => {
  const res = none();

  expect(res).toEqual({ [kOptionKind]: "none" });
});

test("isSome returns true if the option contains data", () => {
  expect(isSome(some("hello"))).toBeTruthy();
  expect(isSome(none())).toBeFalsy();
});

test("isNone returns true if the option does not contain data", () => {
  expect(isNone(none())).toBeTruthy();
  expect(isNone(some("hello"))).toBeFalsy();
});

test("isOption returns true if the input is an option", () => {
  expect(isOption(some("hello"))).toBeTruthy();
  expect(isOption(none())).toBeTruthy();
  expect(isOption(123)).toBeFalsy();
  expect(isOption({})).toBeFalsy();
});

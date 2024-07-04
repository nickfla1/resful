import { expect, test } from "vitest";
import { UnwrapError } from "./error.js";
import { type Option, none, some } from "./option.js";
import { type Result, err, isErr, isOk, ok } from "./result.js";
import { box, map, mapErr, run, safe, safeBox, unwrap, unwrapOr } from "./utils.js";

test("should unwrap a success result", () => {
  expect(unwrap(ok("hello"))).toStrictEqual("hello");
});

test("should throw if we try to unwrap an error", () => {
  expect(() => {
    unwrap(err("hello"));
  }).toThrowError(UnwrapError);
});

test("should return a fallback if an error is unwrapped", () => {
  expect(unwrapOr(err("badcode"), "hello")).toStrictEqual("hello");
});

test("should return a fallback if none is unwrapped", () => {
  expect(unwrapOr(none(), "hello")).toStrictEqual("hello");
});

test("unwrapOr should return a original data", () => {
  expect(unwrapOr(some("hi"), "hello")).toStrictEqual("hi");
});

test("it should map a result", () => {
  expect(map(ok("hello"), (str) => str.toUpperCase())).toEqual(ok("HELLO"));
});

test("mapError should map an error result", () => {
  expect(mapErr(err("badcode"), (str) => str.replace("bad", "good"))).toEqual(err("goodcode"));
});

test("mapError should return the data of an ok result", () => {
  expect(mapErr(ok("badcode") as Result<string, string>, (str) => str.replace("bad", "good"))).toEqual(ok("badcode"));
});

test("it should map an option", () => {
  expect(map(some("hello"), (str) => str.toUpperCase())).toEqual(some("HELLO"));
});

test("it should map an none option", () => {
  expect(map(none() as Option<string>, (str) => str.toUpperCase())).toEqual(none());
});

test("run should sandbox an execution", () => {
  const res = run(() => {
    return ok("hello");
  });

  expect(isOk(res)).toBeTruthy();
  expect(unwrap(res)).toStrictEqual("hello");
});

test("run should sandbox an async execution", async () => {
  const res = await run(async () => {
    return ok("hello");
  });

  expect(isOk(res)).toBeTruthy();
  expect(unwrap(res)).toStrictEqual("hello");
});

test("run should return an error result if an unwrap error happens inside", () => {
  const res = run(() => {
    unwrap(err("fail"));

    return ok("hello");
  });

  expect(isErr(res)).toBeTruthy();
});

test("run throws with non-unwrap errors", () => {
  expect(() => {
    run(() => {
      throw new Error("test");

      // biome-ignore lint: test purposes
      return ok("hello");
    });
  }).toThrow();
});

test("safe should return an error result if an unwrap error happens inside", () => {
  const res = safe(() => {
    unwrap(err("fail"));

    return ok("hello");
  });

  expect(isErr(res)).toBeTruthy();
});

test("safe should return an error result if a non-unwrap error happens inside", () => {
  const res = safe(() => {
    throw new Error("nope");
  });

  expect(isErr(res)).toBeTruthy();
});

test("safe should return an error result if an unwrap error happens inside", () => {
  const res = safe(() => {
    unwrap(err("fail"));

    return ok("hello");
  });

  expect(isErr(res)).toBeTruthy();
});

test("safe should sandbox an execution", () => {
  const res = safe(() => {
    return ok("hello");
  });

  expect(isOk(res)).toBeTruthy();
  expect(unwrap(res)).toStrictEqual("hello");
});

test("safe should sandbox an async execution", async () => {
  const res = await safe(async () => {
    return ok("hello");
  });

  expect(isOk(res)).toBeTruthy();
  expect(unwrap(res)).toStrictEqual("hello");
});

test("box should sandbox a function reference", () => {
  const fn = (a: string) => ok(a);
  const boxed = box(fn);

  const res = unwrap(boxed("hello"));

  expect(res).toStrictEqual("hello");
});

test("safe should sandbox a function reference", () => {
  const fn = (a: string) => ok(a);
  const boxed = safeBox(fn);

  const res = unwrap(boxed("hello"));

  expect(res).toStrictEqual("hello");
});

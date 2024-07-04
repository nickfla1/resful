# resful

![tests-workflow](https://github.com/nickfla1/resful/actions/workflows/ci-main-tests.yaml/badge.svg)

Type safe result utilities for TypeScript.

## Who should use this library?

This library is intended for developers that want to void explicitly uses of `Error` and `throw` in their TypeScript applications.

If used in libraries iti is not advised to expose `Result` to the library public API. This library is thought for internal use only.

## How to use

### Install

```sh
yarn add resful

npm install resful

pnpm install resful
```

> NOTE: Not tested on Bun

### Basic usage

```ts
import { ok, err, isOk, type Result } from 'resful'

const myFunc = (): Result<string, string> => {
    if (Math.random() > 0.5) {
        return err("bad odds")
    }

    return ok("good odds")
}

const res = myFunc()

if (isOk(res)) {
    // nice stuff
}
```

## API

### `ok`

Creates an immutable (`Object.freeze`) `OkResult` object of the provided type.

```ts
import { ok } from 'resful'

interface User {
    id: string
    email: string
}

const res = ok<User>({
    id: '123-456',
    email: 'cool@email.com'
})
```

### `err`

Creates an immutable (`Object.freeze`) `ErrResult` object of the provided type.

```ts
import { err } from 'resful'

const BAD_ERROR = 'error.bad' as const

const res = err(BAD_ERROR) // The type of the error is inferred
```

### `isOk` and `isErr`

Utilities asserting if a result is either an `OkResult` or an `ErrResult`.

```ts
import { isOk, isErr } from 'resful'

const res = /* ok(...) or err(...) */

if (isOk(res)) {
    // `res.ok` is accessible, res is OkResult
}

if (isErr(res)) {
    // `res.err` is accessible, res is ErrResult
}
```

### `unwrap`

Utility to unwrap the content of a result.

> NOTE: This utility will throw a `TypeError` if its input is an `ErrResult`

```ts
import { unwrap, ok } from 'resful'

const res = ok('foobar')

unwrap(res) === 'foobar' // true
```

### `unwrapOr`

Utility to unwrap the content of a result. Returning a compatible fallback value if it's an `ErrResult`.

```ts
import { unwrapOr, ok } from 'resful'

const res = ok('foobar')

unwrapOr(res, 'barbar') === 'foobar' // true
```

```ts
import { unwrapOr, err } from 'resful'

const res = err('foobar')

unwrapOr(res, 'barbar') === 'barbar' // true
```

### `map`

Utility to map the content of an `OkResult` into another type.

```ts
import { map, ok } from 'resful'

const res = ok('foobar')

map(res, (value) => value.toUpperCase()) // { data: 'FOOBAR' }
```

### `mapErr`

Utility to map the content of an `ErrResult` into another type.

```ts
import { mapErr, err } from 'resful'

const res = err('barbar')

mapErr(res, (value) => value.toUpperCase()) // { err: 'BARBAR' }
```

### `run`

Utility to wrap a function inside a safe-ish context. `UnwrapError`s thrown inside are catched and returned as `ErrResult`s.

> NOTE: This utility will _not_ handle unhandled non-`UnwrapError` thrown while executed.

```ts
import { run, ok, unwrap } from 'resful'

const res = run(() => {
    unwrap(err('oh no'))

    ok('yes')
})
```

Or async

```ts
const res = await run(async () => {
    unwrap(await doStuff())

    ok('yes')
})
```

### `safe`

Utility to wrap a function inside a safe context. All errors thrown inside are catched and returned as `ErrResult`s.

See [`run`](#run) examples.

### `box`

Utility to wrap a function reference inside a safe-ish context. Same rules as [`run`](#run) apply.

```ts
import { box, ok, unwrap } from 'resful'

function fn() {
    unwrap(err('oh no'))

    ok('yes')
})

const boxedFn = box(fn)

const res = boxedFn()
```

Or with arguments

```ts
async function fn(what: string) {
    ok(`yes, ${what}`)
})

const boxedFn = box(fn)

const res = await boxedFn('sir')
```

### `safeBox`

Utility to wrap a function reference inside a safe context. Same rules as [`safe`](#safe) apply.

See [`box`](#box) examples.

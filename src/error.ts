export class UnwrapError<E> extends Error {
  readonly originalError: E;

  constructor(error: E) {
    super("unwrap error");

    this.originalError = error;
  }
}

export class RunError extends Error {
  readonly originalError: unknown;

  constructor(error: unknown) {
    super("run error");

    this.originalError = error;
  }
}

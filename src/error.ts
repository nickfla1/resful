export class UnwrapError<E> extends Error {
  readonly originalError: E;

  constructor(error: E) {
    super("unwrap error");

    this.originalError = error;
  }
}

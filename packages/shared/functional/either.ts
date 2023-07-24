type Predicate<T> = (value: T) => boolean;
type EitherFunction<T, R> = (value: T) => R;

// TODO: add tests
export const either =
  <T, R>(
    predicate: Predicate<T>,
    left: EitherFunction<T, R>,
    right: EitherFunction<T, R>,
  ) =>
  (value: T): R => {
    if (predicate(value)) {
      return left(value);
    }

    return right(value);
  };

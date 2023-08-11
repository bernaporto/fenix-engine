import { compose } from '../../functional';
import { makeObservable } from '../observable';
import type { LastFnReturnType, Operator, ReadonlyObservable } from '../types';

export const pipe = <
  T,
  Fns extends Operator[],
  R extends LastFnReturnType<Fns>
>(
  input: ReadonlyObservable<T>,
  ...operators: Fns
): ReadonlyObservable<R> => {
  const process = compose(...operators);

  // @ts-ignore-next-line
  const initialValue = process(input.get());
  const output = makeObservable(initialValue as R);

  input.subscribe((value) => {
    // @ts-ignore-next-line
    output.set(process(value));
  });

  return output.toReadable();
};

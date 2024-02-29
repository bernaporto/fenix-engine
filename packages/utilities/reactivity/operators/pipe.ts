import { compose } from '../../functional';
import { AnyFunction } from '../../functional/types';
import { makeObservable } from '../observable';
import type { ReadonlyObservable } from '../types';

export const pipe = <
  T,
  Fns extends AnyFunction[],
  R extends ReturnType<Fns[0]>
>(
  input: ReadonlyObservable<T>,
  ...operators: Fns
): ReadonlyObservable<R> => {
  const process = compose(...operators);
  const initialValue = input.get();
  // @ts-ignore-next-line
  const output = makeObservable(process(initialValue));

  input.subscribe((value) => {
    // @ts-ignore-next-line
    output.set(process(value));
  });

  return output.toReadable();
};

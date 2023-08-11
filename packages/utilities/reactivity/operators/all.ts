import { makeObservable } from '../observable';
import type { GetObservableValues, ReadonlyObservable } from '../types';

export const all = <
  T extends ReadonlyObservable<unknown>[],
  R extends GetObservableValues<T>
>(
  ...inputs: T
): ReadonlyObservable<R> => {
  const valueMap = new Map(inputs.map((input) => [input, input.get()]));
  const output = makeObservable([...valueMap.values()]);

  for (const observable of inputs) {
    observable.subscribe((value) => {
      valueMap.set(observable, value);
      output.set([...valueMap.values()]);
    });
  }

  return output.toReadable() as ReadonlyObservable<R>;
};

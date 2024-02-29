import { pipe } from './pipe';
import { makeObservable } from '../observable';

describe('pipe', () => {
  it('should pipe functions', () => {
    const observable = makeObservable(0);
    const readable = pipe(
      observable.toReadable(),
      (value: number) => `value: ${value}`
    );
    const observer = jest.fn();
    readable.subscribe(observer);

    expect(readable.get()).toBe('value: 0');
    expect(observer).toHaveBeenCalledTimes(0);

    observable.set(10);
    expect(readable.get()).toBe('value: 10');
    expect(observer).toHaveBeenCalledTimes(1);
    expect(observer).toHaveBeenLastCalledWith('value: 10', 'value: 0');
  });
});

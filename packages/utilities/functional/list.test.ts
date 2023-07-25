import { filter, forEach, map } from './list';

describe('filter', () => {
  it('should filter a list.', () => {
    const list = [1, 2, 3, 4, 5];
    const isEven = (n: number) => n % 2 === 0;

    const result = filter(isEven)(list);

    expect(result).toEqual([2, 4]);
  });
});

describe('forEach', () => {
  it('should iterate over a list.', () => {
    const list = [1, 2, 3, 4, 5];
    const mock = jest.fn();

    forEach(mock)(list);

    expect(mock).toHaveBeenCalledTimes(5);
    expect(mock).toHaveBeenNthCalledWith(1, 1, 0, [1, 2, 3, 4, 5]);
    expect(mock).toHaveBeenLastCalledWith(5, 4, [1, 2, 3, 4, 5]);
  });
});

describe('map', () => {
  it('should map a list.', () => {
    const list = [1, 2, 3, 4, 5];
    const double = jest.fn((n: number) => n * 2);

    const result = map(double)(list);

    expect(double).toHaveBeenCalledTimes(5);
    expect(result).toEqual([2, 4, 6, 8, 10]);
  });
});

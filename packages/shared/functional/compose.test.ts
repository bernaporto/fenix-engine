import { compose } from './compose';

const sum10 = (x: number) => x + 10;
const multiplyBy2 = (x: number) => x * 2;
const toString = (x: number) => x.toString();

describe('compose', () => {
  it('should compose functions', () => {
    const calculate = compose(toString, sum10, multiplyBy2);
    const result = calculate(10);

    expect(typeof result).toBe('string');
    expect(result).toBe('30');
  });

  it('should compose functions (different order)', () => {
    const calculate = compose(toString, multiplyBy2, sum10);
    const result = calculate(10);

    expect(typeof result).toBe('string');
    expect(result).toBe('40');
  });

  it('should compose functions (different output type)', () => {
    const calculate = compose(multiplyBy2, sum10, toString);
    const result = calculate(10);

    expect(typeof result).toBe('number');
    expect(result).toBe(2020);
  });
});

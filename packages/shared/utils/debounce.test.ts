import { debounce } from './debounce';

describe('debounce', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should gracefully debounce a function.', () => {
    const mock = jest.fn();
    const debounced = debounce(mock, 100);

    debounced();
    debounced();
    debounced();

    expect(mock).toHaveBeenCalledTimes(0);

    jest.advanceTimersByTime(100);

    expect(mock).toHaveBeenCalledTimes(1);
  });
});

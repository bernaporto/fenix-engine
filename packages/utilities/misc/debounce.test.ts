import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { debounce } from './debounce';

describe('debounce', () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('should gracefully debounce a function.', () => {
    const mock = vi.fn();
    const debounced = debounce(mock, 100);

    debounced();
    debounced();
    debounced();

    expect(mock).toHaveBeenCalledTimes(0);

    vi.advanceTimersByTime(100);

    expect(mock).toHaveBeenCalledTimes(1);
  });
});

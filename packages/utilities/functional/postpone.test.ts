import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { postpone } from './postpone';

describe('postpone', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('should call the provided functions in the next event loop.', () => {
    const mock1 = vi.fn();
    const mock2 = vi.fn();
    const mock3 = vi.fn();

    postpone(mock1, mock2, mock3);

    expect(mock1).not.toHaveBeenCalled();
    expect(mock2).not.toHaveBeenCalled();
    expect(mock3).not.toHaveBeenCalled();

    vi.advanceTimersByTime(0);

    expect(mock1).toHaveBeenCalledTimes(1);
    expect(mock2).toHaveBeenCalledTimes(1);
    expect(mock3).toHaveBeenCalledTimes(1);
  });
});

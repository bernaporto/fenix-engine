import { describe, expect, it, vi } from 'vitest';
import { parallel } from './parallel';

describe('parallel', () => {
  it('should run all functions in parallel.', () => {
    const mock1 = vi.fn();
    const mock2 = vi.fn();
    const mock3 = vi.fn();

    const parallelMock = parallel(mock1, mock2, mock3);

    parallelMock();

    expect(mock1).toHaveBeenCalledTimes(1);
    expect(mock2).toHaveBeenCalledTimes(1);
    expect(mock3).toHaveBeenCalledTimes(1);
  });

  it('should pass the same arguments to all functions.', () => {
    const mock1 = vi.fn();
    const mock2 = vi.fn();
    const mock3 = vi.fn();

    const parallelMock = parallel(mock1, mock2, mock3);

    parallelMock(1, 2, 3);

    expect(mock1).toHaveBeenCalledWith(1, 2, 3);
    expect(mock2).toHaveBeenCalledWith(1, 2, 3);
    expect(mock3).toHaveBeenCalledWith(1, 2, 3);
  });
});

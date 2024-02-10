/**
 * Calls the provided functions in the next event loop.
 */
export const postpone = (...fns: VoidFunction[]): void => {
  fns.forEach((fn) => setTimeout(fn, 0));
};

export const parallel = <A extends any[], R>(...fns: ((...args: A) => R)[]) => {
  const reversed = [...fns].reverse();
  return (...args: A): R[] => reversed.map((fn) => fn(...args));
};

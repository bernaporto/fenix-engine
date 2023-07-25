export const filter =
  <T>(fn: (value: T) => boolean) =>
  (list: T[]): T[] =>
    list.filter(fn);

export const forEach =
  <T>(fn: (value: T) => void) =>
  (list: T[]): void =>
    list.forEach(fn);

export const map =
  <T, R>(fn: (value: T) => R) =>
  (list: T[]): R[] =>
    list.map(fn);

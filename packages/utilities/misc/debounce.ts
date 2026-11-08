type Debounced<T extends (...args: any[]) => any> = (
  ...args: Parameters<T>
) => void;

export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  wait: number,
): Debounced<T> => {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
};

/**
 * Returns a function that debounces all calls and the last call will be executed with all calls' arguments
 */
export const debounceList = <T extends (...args: any[]) => any>(
  fn: (argList: Parameters<T>[]) => any,
  wait: number,
): Debounced<T> => {
  let timeout: ReturnType<typeof setTimeout>;
  const argsList: Parameters<T>[] = [];

  return (...args) => {
    argsList.push(args);

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(argsList);
      argsList.length = 0;
    }, wait);
  };
};

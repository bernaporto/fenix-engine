type Debounced<T extends (...args: any[]) => any> = (
  ...args: Parameters<T>
) => () => void;

export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  wait: number
): Debounced<T> => {
  let timeout: ReturnType<typeof setTimeout>;

  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  }) as T;
};

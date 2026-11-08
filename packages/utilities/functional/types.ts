export type AnyFunction = (...args: any[]) => any;

export type ComposedFn<Fns extends AnyFunction[]> = Fns extends [infer First]
  ? First
  : Fns extends [infer First, ...infer _, infer Last]
    ? First extends AnyFunction
      ? Last extends AnyFunction
        ? (...args: Parameters<Last>) => ReturnType<First>
        : (...args: Parameters<First>) => ReturnType<First>
      : never
    : never;

export type GetSubtuples<T extends any[]> = T extends [...infer Rest, infer _]
  ? Rest extends any[]
    ? [T, ...GetSubtuples<Rest>]
    : never
  : [];

export type PossibleParameters<F extends AnyFunction> = GetSubtuples<
  Parameters<F>
>[number];

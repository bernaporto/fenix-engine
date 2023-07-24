export type AnyFunction = (...args: any[]) => any;

export type LastFnParams<Fns extends AnyFunction[]> = Fns extends [
  ...infer _,
  infer L,
]
  ? L extends (...args: infer Args) => any
    ? Args
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

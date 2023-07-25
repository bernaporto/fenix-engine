// ref: https://mostly-adequate.gitbook.io/mostly-adequate-guide/appendix_a

import type { LastFnParams, AnyFunction } from './types';

type ComposeFn = <Fns extends AnyFunction[]>(
  ...fns: Fns
) => (...args: LastFnParams<Fns>) => ReturnType<Fns[0]>;

export const compose: ComposeFn =
  (...fns) =>
  (...args) =>
    // @ts-ignore-next-line
    fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0];

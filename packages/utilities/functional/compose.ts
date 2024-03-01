// ref: https://mostly-adequate.gitbook.io/mostly-adequate-guide/appendix_a

import type { AnyFunction, ComposedFn } from './types';

export const compose =
  <Fns extends AnyFunction[]>(...fns: Fns): ComposedFn<Fns> =>
  // @ts-ignore-next-line
  (...args: any[]) =>
    fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0];

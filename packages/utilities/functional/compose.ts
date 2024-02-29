// ref: https://mostly-adequate.gitbook.io/mostly-adequate-guide/appendix_a

import { AnyFunction, ComposedFn } from './types';

export const compose =
  <Fns extends AnyFunction[]>(...fns: Fns): ComposedFn<Fns> =>
  // @ts-ignore-next-line
  (...args: any[]) =>
    fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0];

// test with 1 function
// const add = (a: number, b: number) => a + b;
// const add2 = (a: number) => a + 2;

// const composed = compose(add2, add);

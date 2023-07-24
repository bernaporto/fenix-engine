// ref: https://mostly-adequate.gitbook.io/mostly-adequate-guide/appendix_a

import type { AnyFunction, PossibleParameters } from './types';

type Curried<F extends AnyFunction> = <U extends PossibleParameters<F>>(
  ...x: U
) => F extends (...y: [...U, ...infer A]) => infer R
  ? A extends []
    ? R
    : Curried<(...z: A) => R>
  : never;

// TODO: review types (it can't infer generics from arguments of the curried)
export const curry = <F extends AnyFunction>(fn: F): Curried<F> => {
  const arity = fn.length;

  const $curry: Curried<F> = (...args) => {
    const argList = args as any[];

    if (argList.length < arity) {
      return ($curry as any).bind(null, ...argList);
    }

    return fn.call(null, ...argList);
  };

  return $curry;
};

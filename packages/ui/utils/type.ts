import { isValidObject } from '@fenix-engine/utilities/misc';
import { ReadonlyObservable } from '@fenix-engine/utilities/reactivity';

export const isReadonlyObservable = (
  value: unknown
): value is ReadonlyObservable<unknown> =>
  isValidObject(value) &&
  'subscribe' in value &&
  typeof value.subscribe === 'function' &&
  'get' in value &&
  typeof value.get === 'function';

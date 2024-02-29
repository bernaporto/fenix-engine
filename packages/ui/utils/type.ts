import { isValidObject } from '@fenix-engine/utilities/misc';
import type { Readable } from '@fenix-engine/utilities/reactivity';

export const isReadable = (value: unknown): value is Readable<unknown> =>
  isValidObject(value) &&
  'subscribe' in value &&
  typeof value.subscribe === 'function' &&
  'get' in value &&
  typeof value.get === 'function';

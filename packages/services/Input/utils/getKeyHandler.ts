import {
  type EventEmitter,
  makeEventEmitter,
} from '@fenix-engine/utilities/events';
import { KeyboardUtils } from './KeyboardUtils';

export type TKeyEvent = 'keydown' | 'keyup';
type TKeyEventEmitter = EventEmitter<TKeyEvent>;

export type TKeyHandler = {
  emitter: TKeyEventEmitter;
  key: string;
} & {
  validate: (event: KeyboardEvent) => boolean;
};

export const getKeyHandler = (keyBlob: string): TKeyHandler => {
  const { key, metaKeys } = KeyboardUtils.parseKeyBlob(keyBlob);

  if (metaKeys.length === 0) {
    return getDefaultKeyHandler(key);
  }

  return getMetaPlusKeyHandler(key, metaKeys);
};

const getDefaultKeyHandler = (key: string): TKeyHandler => ({
  key,
  emitter: makeEventEmitter<TKeyEvent>(),
  validate: (event: KeyboardEvent) => KeyboardUtils.getKey(event) === key,
});

const getMetaPlusKeyHandler = (
  key: string,
  metaKeys: string[],
): TKeyHandler => {
  const metaKeyMap = KeyboardUtils.getMetaKeyMap(metaKeys);

  const validate = (event: KeyboardEvent): boolean => {
    if (KeyboardUtils.getKey(event) !== key) return false;
    if (metaKeyMap.meta && !event.metaKey) return false;
    if (metaKeyMap.shift && !event.shiftKey) return false;
    if (metaKeyMap.alt && !event.altKey) return false;

    return true;
  };

  return {
    key,
    validate,
    emitter: makeEventEmitter<TKeyEvent>(),
  };
};

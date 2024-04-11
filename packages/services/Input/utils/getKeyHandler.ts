import { EventEmitter, makeEventEmitter } from '@fenix-engine/utilities/events';

export type TKeyEvent = 'keydown' | 'keyup';
type TKeyEventEmitter = EventEmitter<TKeyEvent>;

type TMetaKeyMap = {
  meta: boolean;
  shift: boolean;
  alt: boolean;
};

export type TKeyHandler = {
  emitter: TKeyEventEmitter;
  key: string;
} & {
  validate: (event: KeyboardEvent) => boolean;
};

export const getKeyHandler = (keyBlob: string): TKeyHandler => {
  const { key, metaKeys } = parseKeyBlob(keyBlob);

  if (metaKeys.length === 0) {
    return getDefaultKeyHandler(key);
  }

  return getMetaPlusKeyHandler(key, metaKeys);
};

const getDefaultKeyHandler = (key: string): TKeyHandler => ({
  key,
  emitter: makeEventEmitter<TKeyEvent>(),
  validate: (event: KeyboardEvent) => getKey(event) === key,
});

const getMetaPlusKeyHandler = (
  key: string,
  metaKeys: string[]
): TKeyHandler => {
  const metaKeyMap = getMetaKeyMap(metaKeys);

  const validate = (event: KeyboardEvent): boolean => {
    if (getKey(event) !== key) return false;
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

const getKey = (event: KeyboardEvent): string => {
  if (event.key === ' ') return 'space';

  return event.key.toLowerCase();
};

const getMetaKeyMap = (keys: string[]): TMetaKeyMap => {
  return keys.reduce<TMetaKeyMap>(
    (acc, key) => {
      switch (key) {
        case 'meta':
          return { ...acc, meta: true };
        case 'shift':
          return { ...acc, shift: true };
        case 'alt':
          return { ...acc, alt: true };
        default:
          return acc;
      }
    },
    { meta: false, shift: false, alt: false }
  );
};

export const parseKeyBlob = (
  keyBlob: string
): {
  key: string;
  metaKeys: string[];
} => {
  const parts = keyBlob.toLowerCase().trim().split('+');
  const key = parts.pop();

  if (!key) {
    throw new Error(`Invalid key configuration: ${keyBlob}`);
  }

  return {
    key,
    metaKeys: parts,
  };
};

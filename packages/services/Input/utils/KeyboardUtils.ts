const getKey = (event: KeyboardEvent): string => {
  if (event.key === ' ') return 'space';

  return event.key.toLowerCase();
};

type TMetaKeyMap = {
  meta: boolean;
  shift: boolean;
  alt: boolean;
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

const parseKeyBlob = (
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

export const KeyboardUtils = {
  getKey,
  getMetaKeyMap,
  parseKeyBlob,
};

import { DATA_BINDING_REGEX } from '../constants';

export const getBindingKeys = (content: string): string[] => {
  const keys = new Set<string>();

  content.replace(DATA_BINDING_REGEX, (_, key) => {
    keys.add(key);

    return '';
  });

  return [...keys];
};

export const applyBindingValue = (
  content: string,
  key: string,
  value: unknown
): string => {
  return content.replace(DATA_BINDING_REGEX, (_, match) => {
    if (match === key) {
      return String(value);
    }

    return match;
  });
};

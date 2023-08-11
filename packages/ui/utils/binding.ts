import { DATA_BINDING_REGEX } from '../constants';

export const getBindingKeys = (content: string): string[] => {
  const keys = new Set<string>();

  content.replace(DATA_BINDING_REGEX, (_, key) => {
    keys.add(key.trim());

    return '';
  });

  return [...keys];
};

export const applyDataBindingValue = (
  content: string,
  key: string,
  value: unknown
): string => {
  return content.replace(DATA_BINDING_REGEX, (substring, match) => {
    if (match.trim() === key) {
      return String(value);
    }

    return substring;
  });
};

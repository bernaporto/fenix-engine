import { isNullable } from '@fenix-engine/utilities/misc';
import type { AnyContext } from '../@types';
import {
  CONTAINER_KEY_ATTR,
  DATA_BINDING_REGEX,
  ATTRIBUTE_PREFIX,
  TAG_NAME_PREFIX,
} from '../constants';

// TODO: find a better way to apply context without traversing the DOM
export const getContextKey = (startEl: HTMLElement): string => {
  const tryGetContextKey = (element: HTMLElement): string | null => {
    const key = element.getAttribute(CONTAINER_KEY_ATTR);

    if (key !== null) {
      return key;
    }

    const parent = element.parentElement;

    if (parent === null) {
      return null;
    }

    return tryGetContextKey(parent);
  };

  const key = tryGetContextKey(startEl);

  if (key === null) {
    throw new Error('Context key not found');
  }

  return key;
};

export const getTagName = (baseName: string): string =>
  `${TAG_NAME_PREFIX}${baseName}`;

export const getClasses = (baseClass: string, modifiers?: string[]): string => {
  if (!modifiers) {
    return baseClass;
  }

  return modifiers.reduce((acc, modifier) => {
    return `${acc} ${baseClass}--{{${getAttrName(modifier)}}}`;
  }, baseClass);
};

export const getAttrName = (attrName: string): string =>
  `${ATTRIBUTE_PREFIX}${attrName}`;

export const getAttributes = <T extends Record<string, unknown>>(
  element: HTMLElement,
  defaults: Partial<T> = {}
): T => {
  const attributes = element.attributes;

  return Array.from(attributes).reduce(
    (acc, attr) => ({
      ...acc,
      [getAttrName(attr.name)]: attr.value,
    }),
    {
      ...defaults,
    } as T
  );
};

export const applyContext = (template: string, context: AnyContext): string => {
  return template.replace(DATA_BINDING_REGEX, (_, key) => {
    const value = context[key];

    if (isNullable(value)) {
      return '';
    }

    return String(value);
  });
};

import { isNullable, isValidObject } from '@fenix-engine/utilities/misc';
import type { AnyContext } from '../@types';
import {
  CONTAINER_KEY_ATTR,
  DATA_BINDING_REGEX,
  ATTRIBUTE_PREFIX,
  TAG_NAME_PREFIX,
} from '../constants';
import { ReadonlyObservable } from '@fenix-engine/utilities/reactivity';

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

export const getTextContent = (element: HTMLElement): string => {
  return [...element.childNodes]
    .map((child) => {
      if (child.nodeType !== Node.TEXT_NODE) return '';

      return child.textContent ?? '';
    })
    .join('')
    .trim();
};

/* CONTEXT */
export const getContextKeys = (content: string): string[] => {
  const keys = new Set<string>();

  content.replace(DATA_BINDING_REGEX, (_, key) => {
    keys.add(key);

    return '';
  });

  return [...keys];
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

/* VALIDATORS */
export const isReadonlyObservable = (
  value: unknown
): value is ReadonlyObservable<unknown> =>
  isValidObject(value) &&
  'subscribe' in value &&
  typeof value.subscribe === 'function' &&
  'get' in value &&
  typeof value.get === 'function';

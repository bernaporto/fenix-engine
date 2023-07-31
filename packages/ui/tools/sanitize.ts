import sanitizeHtml from 'sanitize-html';
import { isNotNullable } from '@fenix-engine/utilities/misc';
import { ALLOWED_ATTRIBUTES } from '../constants';
import { components } from '../components';

export const sanitize = (uiString: string): string => {
  return sanitizeHtml(uiString, {
    allowedTags: getAllowedTags(),
    allowedAttributes: getAllowedAttributes(),
  });
};

const getAllowedTags = (): string[] =>
  components.map((Component) => getTagName(Component)).filter(isNotNullable);

const getAllowedAttributes = (): Record<string, string[]> =>
  components.reduce(
    (acc, Component) => {
      const tagName = getTagName(Component, false);
      const allowedAttributes = getComponentAttributes(Component);

      if (tagName === null) return acc;

      return {
        ...acc,
        [tagName]: allowedAttributes,
      };
    },
    {
      '*': ALLOWED_ATTRIBUTES,
    } as Record<string, string[]>
  );

/* UTILS */
const getTagName = (
  Component: (typeof components)[number],
  logError = true
): string | null => {
  if ('tagName' in Component) {
    return Component.tagName;
  }

  if (logError) {
    console.error('Component does not have a tagName', Component);
  }

  return null;
};

const getComponentAttributes = (
  Component: (typeof components)[number],
  logError = true
): string[] => {
  if ('allowedAttributes' in Component) {
    return Component.allowedAttributes;
  }

  if (logError) {
    console.error('Component does not have allowedAttributes', Component);
  }

  return [];
};

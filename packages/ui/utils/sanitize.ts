import sanitizeHtml from 'sanitize-html';
import { CUSTOM_ALLOWED_ATTRIBUTES, CUSTOM_ALLOWED_TAGS } from '../constants';
import { components } from '../components';

export const sanitize = (
  uiString: string,
  customComponents: string[] = [],
  customAttributes: Record<string, sanitizeHtml.AllowedAttribute[]> = {}
): string => {
  return sanitizeHtml(uiString, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      ...CUSTOM_ALLOWED_TAGS,
      ...components.map((component) => component.tagName),
      ...customComponents,
    ],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      ...customAttributes,
      '*': CUSTOM_ALLOWED_ATTRIBUTES,
    },
  });
};

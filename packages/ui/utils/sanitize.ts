import sanitizeHtml from 'sanitize-html';
import { CUSTOM_ALLOWED_ATTRIBUTES, CUSTOM_ALLOWED_TAGS } from '../constants';
import { components } from '../components';

export const sanitize = (uiString: string): string => {
  return sanitizeHtml(uiString, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      ...CUSTOM_ALLOWED_TAGS,
      ...components.map((component) => component.tagName),
    ],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      '*': CUSTOM_ALLOWED_ATTRIBUTES,
    },
  });
};

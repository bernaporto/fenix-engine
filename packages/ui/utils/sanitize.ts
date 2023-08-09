import sanitizeHtml from 'sanitize-html';
import { ALLOWED_ATTRIBUTES } from '../constants';

export const sanitize = (uiString: string): string => {
  return sanitizeHtml(uiString, {
    allowedAttributes: {
      '*': ALLOWED_ATTRIBUTES,
    },
  });
};

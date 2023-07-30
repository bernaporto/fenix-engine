import sanitizeHtml from 'sanitize-html';
import { Button } from './Button';

export const sanitize = (uiString: string): string => {
  return sanitizeHtml(uiString, {
    allowedTags: [Button.tagName],
    allowedAttributes: {},
  });
};

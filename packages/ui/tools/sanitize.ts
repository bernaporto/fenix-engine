import sanitizeHtml from 'sanitize-html';
import { components } from '../components';

export const sanitize = (uiString: string): string => {
  return sanitizeHtml(uiString, {
    allowedTags: components.map((Component) => Component.tagName),
    allowedAttributes: {},
  });
};

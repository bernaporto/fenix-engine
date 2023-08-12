export const DATA_ID_ATTR = 'data-id';

export const DATA_BINDING_REGEX = /{{(.*?)}}/g;
export const EVENT_BINDING_REGEX = /@(\w+)/g;

export const EVENT_BINDING_ATTRS = ['@click'];
export const CUSTOM_ALLOWED_TAGS = ['button', 'img', 'style', 'link'];
export const CUSTOM_ALLOWED_ATTRIBUTES = {
  link: ['rel', 'href'],
  '*': [
    'id',
    'class',
    'disabled',
    'style',
    'path',
    'data-*',
    ...EVENT_BINDING_ATTRS,
  ],
};

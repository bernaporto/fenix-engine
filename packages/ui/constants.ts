export const DATA_ID_ATTR = 'data-id';

export const DATA_BINDING_REGEX = /{{(.*?)}}/g;
export const EVENT_BINDING_REGEX = /@(\w+)/g;

export const EVENT_BINDING_ATTRS = ['@click'];
export const CUSTOM_ALLOWED_TAGS = ['button', 'img', 'style'];
export const CUSTOM_ALLOWED_ATTRIBUTES = [
  'id',
  'class',
  'color',
  'style',
  'path',
  ...EVENT_BINDING_ATTRS,
];

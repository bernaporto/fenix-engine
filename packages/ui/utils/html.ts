export const stringToHtml = (value: string): ChildNode | null => {
  const template = document.createElement('template');
  template.innerHTML = value.trim();

  return template.content.firstChild;
};

export const htmlToString = (value: Node): string => {
  const template = document.createElement('template');
  template.content.appendChild(value);

  return template.innerHTML;
};

export const getAttributeMap = (element: HTMLElement): Record<string, string> =>
  [...element.attributes].reduce((acc, { name, value }) => {
    acc[name] = value;

    return acc;
  }, {} as Record<string, string>);

export const ensureHtmlExtension = (path: string): string => {
  if (path.endsWith('.html')) return path;

  return `${path}.html`;
};

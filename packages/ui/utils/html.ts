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

export const stringToHtml = (value: string): ChildNode | null => {
  const template = document.createElement('template');
  template.innerHTML = value.trim();

  return template.content.firstChild;
};

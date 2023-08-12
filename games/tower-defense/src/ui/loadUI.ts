import '@fenix-engine/ui/styles.css';

import { loadGameplayUI } from './contexts/gameplay';

export const loadUI = (path: string) => {
  const container = document.body;
  getLoadFn(path)(path, container);
};

const loaders = {
  gameplay: loadGameplayUI,
};

const getLoadFn = (path: string) => {
  const entry = Object.entries(loaders).find(([key, _]) => path.includes(key));
  const [, loader] = entry ?? [];

  if (!loader) throw new Error(`No load function found for UI: ${path}`);

  return loader;
};

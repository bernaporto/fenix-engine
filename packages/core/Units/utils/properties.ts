import { clone, getFromPath, setOnPath } from '@fenix-engine/utilities/misc';

export type PropertiesHandler = {
  setState: (properties: Record<string, any>) => void;
  get: <T = unknown>(path: string) => T;
  set: (path: string, value: unknown) => void;
};

export const getPropertiesHandler = (
  properties: Record<string, any>,
): PropertiesHandler => {
  const store = clone(properties);

  return {
    setState: (newProperties) => {
      Object.assign(store, clone(newProperties));
    },

    get: (path) => {
      return getFromPath(clone(store), path);
    },

    set: (path, value) => {
      setOnPath(store, path, clone(value));
    },
  };
};

type Registry<T, U> = {
  add: (key: string, value: T) => U;
  get: (key: string) => U | null;
};

type MakeRegistryOptions<T, U> = {
  process?: (value: T) => U;
};

export const makeRegistry = <T, U = T>(
  options?: MakeRegistryOptions<T, U>
): Registry<T, U> => {
  const registry = new Map<string, U>();
  const { process = (value: T) => value as unknown as U } = options ?? {};

  return {
    add: (key, value) => {
      const processed = process(value);
      registry.set(key, processed);

      return processed;
    },

    get: (key) => registry.get(key) ?? null,
  };
};

import {
  type Observable,
  makeObservable,
} from '@fenix-engine/utilities/reactivity';

// type to convert map of T[K] to map of Observable<T[K]>
type ObservableMap<T> = {
  [K in keyof T]: Observable<T[K]>;
};

export type AttributeContext<T extends Record<string, string>> =
  ObservableMap<T>;

export const getAttributeContext = <T extends Record<string, string>>(
  node: HTMLElement,
  defaultAttributes: T
): AttributeContext<T> => {
  const attributes: Record<string, unknown> = {};

  Object.entries(defaultAttributes).forEach(([key, value]) => {
    attributes[key] = makeObservable(node.getAttribute(key) ?? value);
  });

  return attributes as AttributeContext<T>;
};

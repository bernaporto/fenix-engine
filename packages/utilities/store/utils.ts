import type { VoidFunction } from '../@types';
import type { NestedPathOf } from '../@types/helpers';
import type { AnyState } from './types';

export type NestedObservableMap<T, U> = {
  get: <Path extends NestedPathOf<T>>(path: Path) => U[];
  add: <Path extends NestedPathOf<T>>(path: Path, listener: U) => VoidFunction;
  keys: () => NestedPathOf<T>[];
  clear: <Path extends NestedPathOf<T>>(path?: Path) => void;
};

export const createNestedObservableMap = <T, U>(): NestedObservableMap<
  T,
  U
> => {
  const map = new Map<NestedPathOf<T>, Set<U>>();

  return {
    get: (path) => Array.from(map.get(path) || []),

    add: (path, listener) => {
      if (!map.has(path)) {
        map.set(path, new Set());
      }

      map.get(path)?.add(listener);

      return () => {
        const listeners = map.get(path);
        if (!listeners) return;

        listeners.delete(listener);

        if (listeners.size === 0) {
          map.delete(path);
        }
      };
    },

    clear: (path) => {
      if (path) {
        map.delete(path);
        return;
      }

      map.clear();
    },

    keys: () => Array.from(map.keys()),
  };
};

export const getParentPath = <T extends AnyState, Path extends NestedPathOf<T>>(
  path: Path
): NestedPathOf<T> | null => {
  const pathArray = path.split('.');
  pathArray.pop();

  if (pathArray.length === 0) {
    return null;
  }

  return pathArray.join('.') as NestedPathOf<T>;
};

export const isParentKey = <T extends AnyState, Path extends NestedPathOf<T>>(
  key: NestedPathOf<T>,
  path: Path
): boolean => key !== path && path.includes(key);

export const isChildKey = <T extends AnyState, Path extends NestedPathOf<T>>(
  key: NestedPathOf<T>,
  path: Path
): boolean => key !== path && key.startsWith(path);

export const log = ({
  baseMsg,
  path,
  newValue,
  oldValue,
  listeners,
}: {
  baseMsg: string;
  path: string;
  newValue: unknown;
  oldValue: unknown;
  listeners: number;
}) => {
  console.groupCollapsed(
    `${baseMsg}( %c${path}`,
    'font-weight: 400; color: #cccc00;',
    ')'
  );
  console.table({
    previous: {
      value: oldValue,
    },
    next: {
      value: newValue,
    },
    listeners: {
      value: listeners,
    },
  });
  console.log(`%ccalled ${getCaller()}`, `color: #909090;`);
  console.groupEnd();
};

const getCaller = () => {
  const stack = new Error().stack?.split('\n');
  if (!stack) return '';

  const caller = stack.find((line, index) => {
    if (index === 0) return false;
    return !line.includes('utilities/store');
  });

  return (caller ?? '').trim();
};

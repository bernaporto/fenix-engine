import type { VoidFunction } from '../@types';
import type { NestedPathOf, NestedValueOf } from '../@types/helpers';
import { isNullable } from '../misc';
import type { AnyState } from './types';

declare const structuredClone: <T>(value: T) => T;

export type NestedObservableMap<T, U> = {
  get: <Path extends NestedPathOf<T>>(path: Path) => U[];
  add: <Path extends NestedPathOf<T>>(path: Path, listener: U) => VoidFunction;
  keys: () => NestedPathOf<T>[];
  clear: VoidFunction;
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

    clear: () => {
      map.clear();
    },

    keys: () => Array.from(map.keys()),
  };
};

export const getFromPath = <T extends AnyState, Path extends NestedPathOf<T>>(
  value: T,
  path: Path
): NestedValueOf<T, Path> => {
  const pathArray = path.split('.');

  const result = pathArray.reduce((acc, key) => {
    if (isNullable(acc)) {
      return undefined;
    }

    return acc[key] as any;
  }, value) as NestedValueOf<T, Path>;

  return result;
};

export const setOnPath = <T extends AnyState, Path extends NestedPathOf<T>>(
  state: T,
  path: Path,
  newValue: NestedValueOf<T, Path>
): void => {
  const pathArray = path.split('.');
  const lastKey = pathArray.pop() as string;
  const parent = pathArray.reduce((acc, key) => {
    if (!acc[key]) {
      (acc as any)[key] = {};
    }

    return acc[key] as any;
  }, state);

  (parent as any)[lastKey] = newValue;
};

export const deletePath = <T extends AnyState, Path extends NestedPathOf<T>>(
  state: T,
  path: Path
): void => {
  try {
    const pathArray = path.split('.');
    const lastKey = pathArray.pop() as string;
    const parent = pathArray.reduce((acc, key) => (acc as any)[key], state);

    delete (parent as any)[lastKey];
  } catch {
    //  If path doesn't exist, do nothing.
  }
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

export const getAllPaths = <T extends AnyState>(
  state: T
): NestedPathOf<T>[] => {
  const paths: NestedPathOf<T>[] = [];

  const traverse = (value: any, path: string) => {
    if (typeof value !== 'object' || value === null) {
      return;
    }

    Object.keys(value).forEach((key) => {
      const newPath = path ? `${path}.${key}` : key;
      paths.push(newPath as NestedPathOf<T>);

      traverse(value[key], newPath);
    });
  };

  traverse(state, '');

  return paths;
};

export const clone = <T>(value: T): T => {
  const type = typeof value;
  if (type !== 'object' || value === null) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(clone) as T;
  }

  try {
    return structuredClone(value);
  } catch {
    // get paths sorted by depth
    const paths = getAllPaths(value as AnyState).sort(
      (a, b) => a.split('.').length - b.split('.').length
    );

    // clone each path
    const cloned = paths.reduce((acc, path) => {
      const newValue = clone(getFromPath(value as AnyState, path));
      setOnPath(acc, path, newValue);
      return acc;
    }, {} as any);

    return cloned as T;
  }
};

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

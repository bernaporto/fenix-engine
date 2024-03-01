import { NestedPathOf, NestedValueOf } from '../@types/helpers';
import { isNullable, isValidObject } from './type';

export const deepEqual = (a: unknown, b: unknown): boolean => {
  // check simple types first
  if (a === b) {
    return true;
  }

  // check nullables
  if (isNullable(a) !== isNullable(b)) {
    return false;
  }

  // check arrays (order matters)
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }

    return a.every((item, index) => deepEqual(item, b[index]));
  }

  // check objects
  if (isValidObject(a) && isValidObject(b)) {
    const objA = a as Record<string, unknown>;
    const objB = b as Record<string, unknown>;
    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);

    if (keysA.length !== keysB.length) {
      return false;
    }

    return keysA.every((key) => deepEqual(objA[key], objB[key]));
  }

  return false;
};

export const traverse = <T extends Record<string, any>>(
  object: T,
  callback: (node: any) => any
): void => {
  const traverseObject = (object: Record<string, any>) => {
    Object.keys(object).forEach((key) => {
      const node = object[key];
      const result = callback(node);
      if (result) {
        object[key] = result;
      }
      if (isValidObject(node)) {
        traverseObject(node);
      }
    });
  };

  traverseObject(object);
};

export const deepMerge = <T extends Record<string, unknown>>(
  objectA: Record<string, unknown>,
  objectB: Record<string, unknown>
): T => {
  const result = { ...objectA };

  getAllPaths(objectB).forEach((path) => {
    const value = getFromPath(objectB, path);

    // we don't want to set full objects, only pure values
    if (isValidObject(value)) return;

    setOnPath(result, path, value);
  });

  return result as T;
};

export const getFromPath = <
  T extends Record<string, unknown>,
  Path extends NestedPathOf<T>
>(
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

export const setOnPath = <
  T extends Record<string, unknown>,
  Path extends NestedPathOf<T>
>(
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

export const getAllPaths = <T extends Record<string, unknown>>(
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

export const deletePath = <
  T extends Record<string, unknown>,
  Path extends NestedPathOf<T>
>(
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

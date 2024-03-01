import type { AnyState } from '../store/types';
import { getAllPaths, getFromPath, setOnPath } from './object';

export const clone = <T>(value: T): T => {
  if (isWhitelisted(value)) return value;

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

const isWhitelisted = (value: unknown): boolean => {
  return (
    value instanceof Window ||
    value instanceof Document ||
    value instanceof HTMLElement
  );
};

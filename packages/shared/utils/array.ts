import { clamp } from './number';

export const sampleOne = <T>(array: T[]): T | null =>
  array[Math.floor(Math.random() * array.length)] ?? null;

export const sampleMany = <T>(array: T[], count: number) => {
  const targetCount = clamp(0, array.length, count);
  const result: T[] = [];

  while (result.length < targetCount) {
    const item = sampleOne(array) as T;

    if (!result.includes(item)) {
      result.push(item);
    }
  }

  return result;
};

type CompareArraysResult<T> = {
  changed: boolean;
  added: T[];
  removed: T[];
  different: T[];
  intersects: T[];
};

export const compareArrays = <T>(
  newArr: T[],
  oldArr: T[],
): CompareArraysResult<T> => {
  const added = newArr.filter((item) => !oldArr.includes(item));
  const removed = oldArr.filter((item) => !newArr.includes(item));
  const different = [...added, ...removed];
  const intersects = newArr.filter((item) => oldArr.includes(item));

  const changed = different.length > 0;

  return {
    changed,
    added,
    removed,
    different,
    intersects,
  };
};

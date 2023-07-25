import { compareArrays, sampleMany, sampleOne } from './array';

describe('sampleOne', () => {
  it('should return a random item from an array.', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = sampleOne(arr);
    expect(arr).toContain(result);
  });

  it('should gracefully return null if the array is empty.', () => {
    const arr: number[] = [];
    const result = sampleOne(arr);
    expect(result).toBeNull();
  });
});

describe('sampleMany', () => {
  it('should return random items from an array, with the provided length.', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = sampleMany(arr, 3);
    expect(result.length).toBe(3);
    expect(arr).toContain(result[0]);
    expect(arr).toContain(result[1]);
    expect(arr).toContain(result[2]);
  });

  it('should gracefully return an empty array if the array is empty.', () => {
    const arr: number[] = [];
    const result = sampleMany(arr, 3);
    expect(result.length).toBe(0);
  });
});

describe('compareArrays', () => {
  it('returns the correct result', () => {
    const newArr = [1, 3, 5, 7, 9];
    const oldArr = [1, 2, 3, 4, 5];

    expect(compareArrays(newArr, oldArr)).toEqual({
      changed: true,
      added: [7, 9],
      removed: [2, 4],
      different: [7, 9, 2, 4],
      intersects: [1, 3, 5],
    });
  });
});

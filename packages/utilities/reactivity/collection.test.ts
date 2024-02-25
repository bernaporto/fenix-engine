import { makeCollection } from './collection';

describe('Collection', () => {
  it('should be able to create a collection', () => {
    const collection = makeCollection<number>();

    expect(collection).toBeDefined();
  });

  it('should be able to push and pop', () => {
    const collection = makeCollection<number>();

    collection.push(1, 2, 3);

    expect(collection.pop()).toBe(3);
    expect(collection.pop()).toBe(2);
    expect(collection.pop()).toBe(1);
    expect(collection.pop()).toBeUndefined();
  });

  it('should be able to shift and unshift', () => {
    const collection = makeCollection<number>();

    collection.unshift(1);
    collection.unshift(2);
    collection.unshift(3);

    expect(collection.shift()).toBe(3);
    expect(collection.shift()).toBe(2);
    expect(collection.shift()).toBe(1);
  });

  it('should be able to get', () => {
    const collection = makeCollection<number>();

    collection.push(1, 2, 3);

    expect(collection.get()).toEqual([1, 2, 3]);
  });

  it('should be able to get and set at index', () => {
    const collection = makeCollection<number>();

    collection.push(1, 2, 3);

    expect(collection.getOne(0)).toBe(1);
    expect(collection.getOne(1)).toBe(2);
    expect(collection.getOne(2)).toBe(3);

    collection.set(0, 4);
    collection.set(1, 5);
    collection.set(2, 6);

    expect(collection.getOne(0)).toBe(4);
    expect(collection.getOne(1)).toBe(5);
    expect(collection.getOne(2)).toBe(6);
  });

  it('should be able to delete', () => {
    const collection = makeCollection<number>();

    collection.push(1, 2, 3);
    collection.delete(1);

    expect(collection.getOne(0)).toBe(1);
    expect(collection.getOne(1)).toBe(3);
  });

  it('should be able to clear', () => {
    const collection = makeCollection<number>();

    collection.push(1, 2, 3);
    collection.clear();

    expect(collection.getOne(0)).toBeUndefined();
    expect(collection.getOne(1)).toBeUndefined();
    expect(collection.getOne(2)).toBeUndefined();
  });

  it('should be able to map', () => {
    const collection = makeCollection<number>();

    collection.push(1, 2, 3);

    const mapped = collection.map((value) => value * 2);

    expect(mapped).toEqual([2, 4, 6]);
  });

  it('should be able to filter', () => {
    const collection = makeCollection<number>();

    collection.push(1, 2, 3);
    const filtered = collection.filter((value) => value % 2 === 0);

    expect(filtered).toEqual([2]);
  });

  it('should be able to reduce', () => {
    const collection = makeCollection<number>();

    collection.push(1, 2, 3);
    const reduced = collection.reduce((acc, value) => acc + value, 0);

    expect(reduced).toEqual(6);
  });

  it('should be able to some', () => {
    const collection = makeCollection<number>();

    collection.push(1, 2, 3);
    const some = collection.some((value) => value === 2);

    expect(some).toEqual(true);
  });

  it('should be able to every', () => {
    const collection = makeCollection<number>();

    collection.push(1, 2, 3);
    const every = collection.every((value) => value > 0);

    expect(every).toEqual(true);
  });

  it('should be able to find', () => {
    const collection = makeCollection<number>();

    collection.push(1, 2, 3);
    const found = collection.find((value) => value === 2);

    expect(found).toEqual(2);
  });

  it('should be able to findIndex', () => {
    const collection = makeCollection<number>();

    collection.push(1, 2, 3);
    const foundIndex = collection.findIndex((value) => value === 2);

    expect(foundIndex).toEqual(1);
  });

  it('should be able to includes', () => {
    const collection = makeCollection<number>();

    collection.push(1, 2, 3);
    const includes = collection.includes(2);

    expect(includes).toEqual(true);
  });

  it('should be able to indexOf', () => {
    const collection = makeCollection<number>();

    collection.push(1, 2, 3);
    const indexOf = collection.indexOf(2);

    expect(indexOf).toEqual(1);
  });

  it('should be able to lastIndexOf', () => {
    const collection = makeCollection<number>();

    collection.push(1, 2, 3, 2);
    const lastIndexOf = collection.lastIndexOf(2);

    expect(lastIndexOf).toEqual(3);
  });

  it('should be able to subscribe', () => {
    const collection = makeCollection<number>();

    const unsub = collection.subscribe((value) => {
      expect(value).toEqual([1, 2, 3]);
    });

    collection.push(1, 2, 3);

    unsub();
  });

  it('should be able to subscribe to index', () => {
    const collection = makeCollection<number>();

    const unsub = collection.subscribeTo(1, (value) => {
      expect(value).toEqual(2);
    });

    collection.push(1, 2, 3);

    unsub();
  });
});

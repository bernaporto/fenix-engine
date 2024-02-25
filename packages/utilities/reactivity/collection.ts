import { createStore } from '../store';
import { Collection } from './types';

export const makeCollection = <T>(initialValue?: T[]): Collection<T> => {
  const store = createStore<{
    value: T[];
  }>({
    value: initialValue ?? [],
  });
  const obs = store.getWritable('value');

  return {
    subscribe: obs.subscribe,
    subscribeTo: (index, listener) =>
      store.subscribe(`value.${index}`, listener),

    clear: () => store.reset('value'),
    delete: (index) => {
      const arr = [...obs.get()];
      arr.splice(index, 1);
      obs.set(arr);
    },
    every: (predicate) => obs.get().every(predicate),
    filter: (predicate) => obs.get().filter(predicate),
    find: (predicate) => obs.get().find(predicate),
    findIndex: (predicate) => obs.get().findIndex(predicate),
    get: () => [...obs.get()],
    getOne: (index) => obs.get()[index],
    includes: (value) => obs.get().includes(value),
    indexOf: (value) => obs.get().indexOf(value),
    lastIndexOf: (value) => obs.get().lastIndexOf(value),
    map: (predicate) => obs.get().map(predicate),
    pop: () => {
      const arr = [...obs.get()];

      const last = arr.pop();
      obs.set(arr);

      return last;
    },
    push: (...values) => {
      const arr = [...obs.get()];
      arr.push(...values);
      obs.set(arr);
    },
    reduce: (predicate, initialValue) =>
      obs.get().reduce(predicate, initialValue),
    set: (index, value) => {
      const arr = [...obs.get()];
      arr[index] = value;
      obs.set(arr);
    },
    shift: () => {
      const arr = [...obs.get()];

      const first = arr.shift();
      obs.set(arr);

      return first;
    },
    some: (predicate) => obs.get().some(predicate),
    unshift: (value) => {
      const arr = [...obs.get()];
      arr.unshift(value);
      obs.set(arr);
    },
  };
};

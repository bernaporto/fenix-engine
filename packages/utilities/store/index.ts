import { branch, readable, writable } from './operators';
import { compute } from '../reactivity';
import { createStore } from './createStore';

const Store = {
  branch,
  compute,
  readable,
  writable,
  create: createStore,
};

export default Store;
export { branch, compute, readable, writable, createStore };

import { branch, readable, writable } from './operators';
import { compute } from '../reactivity';
import { createStore } from './createStore';

export type {
  Store as TStore,
  BranchStore as TBranchStore,
  AnyState as TStoreState,
} from './types';
export { branch, compute, readable, writable, createStore };
export default {
  branch,
  compute,
  readable,
  writable,
  create: createStore,
};

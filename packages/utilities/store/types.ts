import type { VoidFunction } from '../@types';
import type { NestedPathOf, NestedValueOf } from '../@types/helpers';
import type { Observable, Readable } from '../reactivity';

export type Listener<T> = (value: T, prevValue?: T) => void;
type UpdaterFn<State extends AnyState, Path extends NestedPathOf<State>> = (
  value: NestedValueOf<State, Path>
) => NestedValueOf<State, Path>;

export type Writeable<T> = Pick<Observable<T>, 'get' | 'set' | 'subscribe'>;

export type AnyState = Record<string, unknown>;

export type Store<State extends AnyState> = {
  clearListeners: <Path extends NestedPathOf<State>>(path: Path) => void;
  clearAllListeners: VoidFunction;
  get: <Path extends NestedPathOf<State>>(
    path: Path
  ) => NestedValueOf<State, Path>;
  getState: () => State;
  getReadable: <Path extends NestedPathOf<State>>(
    path: Path
  ) => Readable<NestedValueOf<State, Path>>;
  getWritable: <Path extends NestedPathOf<State>>(
    path: Path
  ) => Writeable<NestedValueOf<State, Path>>;
  reset: <Path extends NestedPathOf<State>>(
    path: Path,
    notifyTargetPath?: boolean
  ) => void;
  set: <Path extends NestedPathOf<State>>(
    path: Path,
    value: NestedValueOf<State, Path>,
    silent?: boolean
  ) => void;
  subscribe: <Path extends NestedPathOf<State>>(
    path: Path,
    listener: Listener<NestedValueOf<State, Path>>,
    notifyImmediately?: boolean
  ) => VoidFunction;
  update: <Path extends NestedPathOf<State>>(
    path: Path,
    updater: UpdaterFn<State, Path>,
    silent?: boolean
  ) => void;
  _setDebugMode: (debug: boolean, key?: string) => void;
};

export type BranchStore<T extends AnyState> = Omit<
  Store<T>,
  '_setDebugMode' | 'reset'
> & {
  reset: <Path extends NestedPathOf<T>>(
    path?: Path,
    notifyTargetPath?: boolean
  ) => void;
};

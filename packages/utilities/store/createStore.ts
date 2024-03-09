import type { NestedPathOf, NestedValueOf } from '../@types/helpers';
import {
  clone,
  deletePath,
  getFromPath,
  isNotNullable,
  setOnPath,
} from '../misc';
import { readable, writable } from './operators';
import type { AnyState, Listener, Store } from './types';
import {
  type NestedObservableMap,
  createNestedObservableMap,
  getParentPath,
  isChildKey,
  isParentKey,
  log,
} from './utils';

export const createStore = <T extends AnyState>(initialState: T): Store<T> => {
  const cleanState = clone(initialState);
  let state = clone(cleanState);
  const listeners = createNestedObservableMap<
    T,
    Listener<NestedValueOf<T, any>>
  >();

  let debug = false;
  let debugKey = '';

  const store: Store<T> = {
    get: (path) => clone(getFromPath(state, path)),

    getState: () => clone(state),

    getReadable: (path) => readable(store, path),

    getWritable: (path) => writable(store, path),

    update: (path, updater, silent = false) => {
      const oldValue = store.get(path);
      const newValue = updater(oldValue);

      store.set(
        path,
        newValue,
        silent,
        // @ts-ignore-next-line
        'update'
      );
    },

    set: (path, newValue, silent = false, logKey = 'set') => {
      // do shallow comparison and return if value is the same
      if (getFromPath(state, path) === newValue) return;

      // make a copy of the old state
      const oldState = clone(state);

      // update value
      setOnPath(state, path, newValue);

      const otherNotifiableKeys = [
        ...getNotifiableKeys(listeners, path, isParentKey),
        ...getNotifiableKeys(listeners, path, isChildKey),
      ];

      if (debug) {
        log({
          path,
          baseMsg: getDebugMessage(`store.${logKey}`, debugKey),
          newValue: clone(newValue),
          oldValue: clone(getFromPath(oldState, path)),
          listeners: otherNotifiableKeys.reduce(
            (acc, key) => acc + (listeners.get(key)?.length ?? 0),
            listeners.get(path)?.length ?? 0
          ),
        });
      }

      if (silent) return;

      // notify listeners
      notifyListeners(listeners, state, oldState, path);

      otherNotifiableKeys.forEach((key) => {
        if (getFromPath(oldState, key) === getFromPath(state, key)) return;

        notifyListeners(listeners, state, oldState, key);
      });
    },

    subscribe: (path, listener, notifyImmediately = true) => {
      const unsubscribe = listeners.add(path, listener);

      if (notifyImmediately) {
        listener(getFromPath(state, path));
      }

      return unsubscribe;
    },

    reset: (path, notifyTargetPath = false) => {
      const resetState = clone(cleanState);

      // reset value
      const value = getFromPath(resetState, path);

      if (value === undefined) {
        const oldState = clone(state);
        deletePath(state, path);

        const parentPath = getParentPath(path) as NestedPathOf<T>;
        const notifiableKeys = [
          notifyTargetPath ? path : undefined,
          parentPath,
          ...(parentPath
            ? getNotifiableKeys(listeners, parentPath, isParentKey)
            : []),
        ].filter(isNotNullable);

        notifiableKeys.forEach((path) => {
          notifyListeners(listeners, state, oldState, path);
        });

        if (debug) {
          log({
            path,
            baseMsg: getDebugMessage('store.reset', debugKey),
            newValue: undefined,
            oldValue: getFromPath(oldState, path),
            listeners: notifiableKeys.reduce(
              (acc, key) => acc + (listeners.get(key)?.length ?? 0),
              0
            ),
          });
        }
      } else {
        store.set(
          path,
          value,
          false,
          // @ts-ignore-next-line
          'reset'
        );
      }
    },

    _setDebugMode: (value, key) => {
      debug = value;
      debugKey = key ?? '';
    },

    clearListeners: (path) => {
      listeners.clear(path);
    },

    clearAllListeners: listeners.clear,
  };

  return store;
};

const getNotifiableKeys = <T extends AnyState, Path extends NestedPathOf<T>>(
  listeners: NestedObservableMap<T, Listener<NestedValueOf<T, Path>>>,
  path: Path,
  predicate: (key: NestedPathOf<T>, path: Path) => boolean
): NestedPathOf<T>[] => listeners.keys().filter((key) => predicate(key, path));

const notifyListeners = <T extends AnyState, Path extends NestedPathOf<T>>(
  listeners: NestedObservableMap<T, Listener<NestedValueOf<T, Path>>>,
  state: T,
  prevState: T,
  path: Path
): void => {
  listeners
    .get(path)
    ?.forEach((listener) =>
      listener(
        clone(getFromPath(state, path) as NestedValueOf<T, Path>),
        clone(getFromPath(prevState, path) as NestedValueOf<T, Path>)
      )
    );
};

const getDebugMessage = (action: string, key?: string) => {
  return [key && `[${key}]`, action].filter(Boolean).join(' ');
};

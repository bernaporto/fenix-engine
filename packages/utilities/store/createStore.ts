import type { NestedPathOf, NestedValueOf } from '../@types/helpers';
import {
  clone,
  deletePath,
  getFromPath,
  isNotNullable,
  setOnPath,
} from '../misc';
import { readable, writable } from './operators';
import type { AnyState, Listener, Store, THistoryListener } from './types';
import {
  type NestedObservableMap,
  createNestedObservableMap,
  getParentPath,
  isChildKey,
  isParentKey,
  log,
} from './utils';

export const createStore = <T extends AnyState>(
  initialState: T,
  historyListener?: THistoryListener<T>
): Store<T> => {
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

      // make a copy of the old value
      const previous = clone(getFromPath(state, path));

      // make a copy of the new value
      const next = clone(newValue);

      // update value
      setOnPath(state, path, next);

      const otherNotifiableKeys = [
        ...getNotifiableKeys(listeners, path, isParentKey),
        ...getNotifiableKeys(listeners, path, isChildKey),
      ];

      if (debug) {
        log({
          path,
          baseMsg: getDebugMessage(`store.${logKey}`, debugKey),
          newValue: next,
          oldValue: previous,
          listeners: otherNotifiableKeys.reduce(
            (acc, key) => acc + (listeners.get(key)?.length ?? 0),
            listeners.get(path)?.length ?? 0
          ),
        });
      }

      if (silent) return;

      // notify listeners
      notifyListeners(listeners, next, previous, path);

      otherNotifiableKeys.forEach((key) => {
        if (getFromPath(oldState, key) === getFromPath(state, key)) return;

        const n = clone(getFromPath(state, key));
        const p = clone(getFromPath(oldState, key));

        notifyListeners(listeners, n, p, key);
      });

      // notify history listener
      historyListener?.(path, next, previous);
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
        const previous = clone(getFromPath(state, path));
        deletePath(state, path);

        const parentPath = getParentPath(path) as NestedPathOf<T>;
        const notifiableKeys = [
          notifyTargetPath ? path : undefined,
          parentPath,
          ...(parentPath
            ? getNotifiableKeys(listeners, parentPath, isParentKey)
            : []),
        ].filter(isNotNullable);

        notifiableKeys.forEach((key) => {
          if (getFromPath(oldState, key) === getFromPath(state, key)) return;

          const n = clone(getFromPath(state, key));
          const p = clone(getFromPath(oldState, key));

          notifyListeners(listeners, n, p, key);
        });

        // notify history listener
        historyListener?.(path, undefined as any, previous);

        if (debug) {
          log({
            path,
            baseMsg: getDebugMessage('store.reset', debugKey),
            newValue: undefined,
            oldValue: previous,
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

    clearListeners: (path, includeChildKeys = false) => {
      listeners.clear(path);

      if (includeChildKeys) {
        const childKeys = getNotifiableKeys(listeners, path, isChildKey);
        childKeys.forEach((key) => listeners.clear(key));
      }
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
  next: NestedValueOf<T, Path>,
  previous: NestedValueOf<T, Path>,
  path: Path
): void => {
  listeners.get(path)?.forEach((listener) => listener(next, previous));
};

const getDebugMessage = (action: string, key?: string) => {
  return [key && `[${key}]`, action].filter(Boolean).join(' ');
};

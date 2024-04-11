import type { EventArgs, EventListener, ListenerHandler } from './types';

export const makeListenerHandler = <
  E extends string,
  U extends EventArgs = EventArgs
>(): ListenerHandler<E, U> => {
  const listenerMap = new Map<E, Set<EventListener<U>>>();

  return {
    add: (event, callback) => {
      getListenersSet<E, U>(listenerMap, event).add(callback);
    },

    clear: (event) => {
      if (event) {
        listenerMap.delete(event);
      } else {
        listenerMap.clear();
      }
    },

    delete: (event, callback) => {
      listenerMap.get(event)?.delete(callback);
    },

    get: (event) => [...getListenersSet(listenerMap, event)],
  };
};

const getListenersSet = <E extends string, U extends EventArgs>(
  listenerMap: Map<E, Set<EventListener<U>>>,
  event: E
): Set<EventListener<U>> => {
  if (!listenerMap.has(event)) {
    listenerMap.set(event, new Set());
  }

  return listenerMap.get(event)!;
};

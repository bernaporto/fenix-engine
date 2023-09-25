import { makeListenerHandler } from './makeListenerHandler';
import type { EventCallback, EventEmitter } from './types';

export const makeEventEmitter = <
  Event extends string
>(): EventEmitter<Event> => {
  const listeners = makeListenerHandler<Event, any[]>();

  const off = (event: Event, callback: EventCallback) => {
    listeners.delete(event, callback);
  };

  return {
    off,

    on: (event, callback) => {
      listeners.add(event, callback);

      return () => off(event, callback);
    },

    once: (event, callback) => {
      const wrappedCallback = (...args: any[]) => {
        callback(...args);
        off(event, wrappedCallback);
      };
      listeners.add(event, wrappedCallback);

      return () => off(event, wrappedCallback);
    },

    emit: (event, ...args) => {
      listeners.get(event).forEach((listener) => {
        listener(...args);
      });
    },

    clear: (event) => {
      listeners.clear(event);
    },
  };
};

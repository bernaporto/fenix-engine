import EventEmitter from 'eventemitter3';
import type { EventCallback, EventHandler } from '../@types';

export const makeEventHandler = <T extends string, U extends string = T>(
  emitter = new EventEmitter()
): EventHandler<T, U> => {
  const getOffFn = (event: T, callback: EventCallback) => () => {
    emitter.off(event, callback);
  };

  return {
    on: (event, callback) => {
      emitter.on(event, callback);
      return getOffFn(event, callback);
    },

    once: (event, callback) => {
      emitter.once(event, callback);
      return getOffFn(event, callback);
    },

    emit: (event, ...args) => {
      emitter.emit(event, ...args);
    },

    clear: () => {
      emitter.removeAllListeners();
    },
  };
};

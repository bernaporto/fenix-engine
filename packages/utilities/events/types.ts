import type { VoidFunction } from '../@types';

type EventArgs = any[];
export type EventCallback = (...args: EventArgs) => void;
export type CustomEvent = `custom:${string}`;

export type EventEnabled = {
  events: EventHandler<string>;
};

export type EventHandler<T extends string, U extends string = T> = {
  on(event: T, callback: EventCallback): VoidFunction;
  once(event: T, callback: EventCallback): VoidFunction;
  emit(event: U, ...args: EventArgs): void;
  clear(): void;
};

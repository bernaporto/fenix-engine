import type { VoidFunction } from '../@types';

export type EventArgs = any[];
export type EventCallback = (...args: EventArgs) => void;
export type CustomEvent = `custom:${string}`;

export type EventEnabled = {
  events: PublicEventHandler<string>;
};

export type EventEmitter<Event extends string> = {
  on(event: Event, callback: EventCallback): VoidFunction;
  once(event: Event, callback: EventCallback): VoidFunction;
  off(event: Event, callback: EventCallback): void;
  emit(event: Event, ...args: EventArgs): void;
  clear(event?: Event): void;
};

export type PublicEventHandler<
  Event extends string,
  CustomEvent extends string = Event
> = {
  on(event: Event | CustomEvent, callback: EventCallback): VoidFunction;
  once(event: Event | CustomEvent, callback: EventCallback): VoidFunction;
  off(event: Event | CustomEvent, callback: EventCallback): void;
  emit(event: CustomEvent, ...args: EventArgs): void;
};

export type EventListener<T extends EventArgs = EventArgs> = (
  ...args: T
) => void;
export type ListenerHandler<
  E extends string,
  U extends EventArgs = EventArgs
> = {
  add(event: E, callback: EventListener<U>): void;
  clear(event?: E): void;
  delete(event: E, callback: EventListener<U>): void;
  get(event: E): EventListener<U>[];
};

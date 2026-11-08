import type { EventEmitter, PublicEventHandler } from './types';

export const makePublicEventHandler = <
  Event extends string,
  CustomEvent extends string = Event,
>(
  emitter: EventEmitter<Event | CustomEvent>,
): PublicEventHandler<Event, CustomEvent> => emitter;

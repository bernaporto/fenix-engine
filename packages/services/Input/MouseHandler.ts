import { either } from '@fenix-engine/utilities/functional';
import type { Vector2 } from '@fenix-engine/core/Math';
import {
  type Observable,
  type Readable,
  observable,
  readable,
} from '@fenix-engine/utilities/reactivity';
import type { VoidFunction } from '@fenix-engine/utilities/@types';

export enum MouseButton {
  LEFT = 0,
  MIDDLE = 1,
  RIGHT = 2,
}

export type MouseIdleState = {
  type: 'idle';
};

export type MouseWheelState = {
  type: 'wheel';
  delta: Vector2;
};

export type MouseMoveState = {
  type: 'move';
  delta: Vector2;
  screenPosition: Vector2;
  normalizedPosition: Vector2;
};

export type MouseClickState = {
  type: 'click';
  button: MouseButton;
  screenPosition: Vector2;
  normalizedPosition: Vector2;
  target?: HTMLElement;
};

export type MouseDragState = {
  type: 'drag';
  button: MouseButton;
  delta: Vector2;
  screenPosition: Vector2;
  normalizedPosition: Vector2;
};

export type MouseState =
  | MouseClickState
  | MouseDragState
  | MouseIdleState
  | MouseMoveState
  | MouseWheelState;

export class MouseHandler {
  public readonly state: Readable<MouseState>;
  public readonly destroy: VoidFunction;

  constructor(
    target: HTMLElement,
    buttons = Object.values(MouseButton) as MouseButton[]
  ) {
    const state = observable<MouseState>({
      type: 'idle',
    });

    const isButtonSupported = (event: MouseEvent) =>
      buttons.includes(event.button);
    const noop = () => {
      /* noop */
    };

    const lockToButtons = (handler: (event: MouseEvent) => void) =>
      either(isButtonSupported, handler, noop);

    const onMouseDown = lockToButtons(handleMouseDown(target, state));
    const onMouseUp = lockToButtons(handleMouseUp(state));
    const onMouseLeave = handleMouseLeave(state);
    const onMouseMove = handleMouseMove(target, state);
    const onWheel = handleWheel(target, state);

    target.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    target.addEventListener('mousemove', onMouseMove);
    target.addEventListener('mouseleave', onMouseLeave);
    target.addEventListener('wheel', onWheel);

    this.state = readable(state);
    this.destroy = () => {
      state.clearObservers();
      target.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      target.removeEventListener('mousemove', onMouseMove);
      target.removeEventListener('mouseleave', onMouseLeave);
      target.removeEventListener('wheel', onWheel);
    };
  }
}

// MOUSE DOWN
const handleMouseDown =
  (target: HTMLElement, state: Observable<MouseState>) =>
  (event: MouseEvent) => {
    const currState = state.get();
    if (currState.type === 'click') return;

    const { screenPosition, normalizedPosition } = getMouseMovementData(
      target,
      event
    );

    state.set({
      screenPosition,
      normalizedPosition,
      type: 'click',
      button: event.button,
      target: event.target instanceof HTMLElement ? event.target : undefined,
    });
  };

// MOUSE UP
const handleMouseUp = (state: Observable<MouseState>) => () => {
  const currState = state.get();
  if (currState.type === 'idle') return;

  state.set({
    type: 'idle',
  });
};

// MOUSE MOVE
const handleMouseMove =
  (target: HTMLElement, state: Observable<MouseState>) =>
  (event: MouseEvent) => {
    const currState = state.get();

    if (currState.type === 'click' || currState.type === 'drag') {
      state.set({
        type: 'drag',
        button: currState.button,
        ...getMouseMovementData(target, event),
      });
      return;
    }

    state.set({
      type: 'move',
      ...getMouseMovementData(target, event),
    });
  };

// MOUSE LEAVE
const handleMouseLeave = (state: Observable<MouseState>) => () => {
  state.set({
    type: 'idle',
  });
};

// MOUSE WHEEL
const handleWheel =
  (target: HTMLElement, state: Observable<MouseState>) =>
  (event: WheelEvent): void => {
    // Only act if on top of canvas
    if (event.target !== target) return;

    const { delta } = getMouseMovementData(target, event);

    state.set({
      delta,
      type: 'wheel',
    });
  };

// UTILS
export const getMouseMovementData = (
  target: HTMLElement,
  event: MouseEvent | WheelEvent
): {
  delta: Vector2;
  screenPosition: Vector2;
  normalizedPosition: Vector2;
} => {
  let delta: Vector2;
  if (event instanceof WheelEvent) {
    delta = {
      x: event.deltaX,
      y: event.deltaY,
    };
  } else {
    delta = {
      x: event.movementX,
      y: event.movementY,
    };
  }

  const screenPosition: Vector2 = {
    x: event.offsetX,
    y: event.offsetY,
  };

  const targetRect = target.getBoundingClientRect();
  const normalizedPosition: Vector2 = {
    x: (screenPosition.x / targetRect.width) * 2 - 1,
    y: -(screenPosition.y / targetRect.height) * 2 + 1,
  };

  return {
    delta,
    screenPosition,
    normalizedPosition,
  };
};

import { either } from '@fenix-engine/utilities/functional';
import type { Vector2 } from '@fenix-engine/core/Math';
import {
  type Observable,
  type ReadonlyObservable,
  makeObservable,
} from '@fenix-engine/utilities/reactivity';

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
  public readonly state: ReadonlyObservable<MouseState>;
  public readonly destroy: VoidFunction;

  constructor(
    canvas: HTMLCanvasElement,
    buttons = Object.values(MouseButton) as MouseButton[]
  ) {
    const state = makeObservable<MouseState>({
      type: 'idle',
    });

    const isButtonSupported = (event: MouseEvent) =>
      buttons.includes(event.button);
    const noop = () => {
      /* noop */
    };

    const lockToButtons = (handler: (event: MouseEvent) => void) =>
      either(isButtonSupported, handler, noop);

    const onMouseDown = lockToButtons(handleMouseDown(canvas, state));
    const onMouseUp = lockToButtons(handleMouseUp(state));
    const onMouseLeave = handleMouseLeave(state);
    const onMouseMove = handleMouseMove(canvas, state);
    const onWheel = handleWheel(canvas, state);

    canvas.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('wheel', onWheel);

    this.state = state.toReadable();
    this.destroy = () => {
      state.clearObservers();
      canvas.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      canvas.removeEventListener('wheel', onWheel);
    };
  }
}

// MOUSE DOWN
const handleMouseDown =
  (canvas: HTMLCanvasElement, state: Observable<MouseState>) =>
  (event: MouseEvent) => {
    const currState = state.get();
    if (currState.type === 'click') return;

    const { screenPosition, normalizedPosition } = getMouseMovementData(
      canvas,
      event
    );

    state.set({
      screenPosition,
      normalizedPosition,
      type: 'click',
      button: event.button,
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
  (canvas: HTMLCanvasElement, state: Observable<MouseState>) =>
  (event: MouseEvent) => {
    const currState = state.get();

    if (currState.type === 'click' || currState.type === 'drag') {
      state.set({
        type: 'drag',
        button: currState.button,
        ...getMouseMovementData(canvas, event),
      });
      return;
    }

    state.set({
      type: 'move',
      ...getMouseMovementData(canvas, event),
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
  (canvas: HTMLCanvasElement, state: Observable<MouseState>) =>
  (event: WheelEvent): void => {
    // Only act if on top of canvas
    if (event.target !== canvas) return;

    const { delta } = getMouseMovementData(canvas, event);

    state.set({
      delta,
      type: 'wheel',
    });
  };

// UTILS
export const getMouseMovementData = (
  canvas: HTMLCanvasElement,
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

  const normalizedPosition: Vector2 = {
    x: (screenPosition.x / canvas.width) * 2 - 1,
    y: -(screenPosition.y / canvas.height) * 2 + 1,
  };

  return {
    delta,
    screenPosition,
    normalizedPosition,
  };
};

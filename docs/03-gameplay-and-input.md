# Gameplay and input

## Per-frame updates

Use unit behaviours for logic tied to a unit's lifetime. Each update receives a
`TickerState` containing `deltaTime`, `elapsedTime`, and loop `status`.
`deltaTime` is measured in seconds and is useful for frame-rate-independent
movement:

```ts
import { game } from '@fenix-engine/core';

game.behaviours.register('move-right', (unit) => ({
  onUpdate: ({ deltaTime }) => {
    const position = unit.transform.position;
    unit.transform.setPosition({
      ...position,
      x: position.x + 2 * deltaTime,
    });
  },
}));
```

Pause or resume the shared game ticker with
`game.ticker.setStatus('paused')` or `game.ticker.setStatus('running')`.

## Keyboard input

`KeyboardHandler` listens on the document. Use key names or key combinations such
as `space` and `shift+space`, then destroy the handler when its owner is
finished:

```ts
import { KeyboardHandler } from '@fenix-engine/services/Input';

const keyboard = new KeyboardHandler();
keyboard.watch('space').on('keydown', () => {
  // Jump, confirm, or perform another game action.
});

// When the handler is no longer needed:
keyboard.destroy();
```

Input events are prevented from reaching the browser when handled. Input
targeted at an `HTMLInputElement` is ignored.

## Mouse input

`MouseHandler` tracks mouse movement, clicks, drags, and wheel input relative
to a target element. Its `state` is readable and can be subscribed to:

```ts
import { game } from '@fenix-engine/core';
import { MouseHandler } from '@fenix-engine/services/Input';

const mouse = new MouseHandler(game.domElement);
const unsubscribe = mouse.state.subscribe((state) => {
  if (state.type === 'click') {
    // Use state.normalizedPosition for camera raycasts.
  }
});

// When the handler is no longer needed:
unsubscribe();
mouse.destroy();
```

Camera units offer `raycast` and `raycastPoint` helpers for converting
normalized mouse coordinates into scene interactions.

## Game-specific systems

The engine provides basic scene, input, and update primitives rather than a
complete gameplay framework. Physics, collision rules, audio, save systems,
and game-specific UI can be implemented by the game or added as separate
libraries when needed.

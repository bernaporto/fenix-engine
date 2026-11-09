# Core concepts

## Game and stage

`Game` owns the Three.js renderer, the game ticker, engine registries, and a `Stage`.
The package exports a shared `game` instance for common use, or you can create
your own with `new Game()`. Call `game.destroy()` when the game instance is no
longer needed.

`game.stage.load(key)` loads a registered scene and disposes the previously
loaded scene. `game.stage.currentScene` provides the active scene. The stage
resizes the renderer and scene camera when the container or window changes size
by default. Subscribe to its `resize` event for subsequent container
dimensions:

```ts
const unsubscribe = game.stage.events.on(
  'resize',
  ({ width, height, aspect }) => {
    // Apply game-specific camera framing or layout.
  },
);

// When the owner is finished:
unsubscribe();
```

The event fires whenever the stage applies a valid size. `game.stage.size`
contains the latest dimensions (`null` until the first valid measurement), so
code subscribing after initialization can read the current size. `game.destroy()`
disposes the stage's resize observer and window listener.

## Scenes and layers

A `Scene` contains units organized into layers. Scene manifests can assign
hierarchy roots to numbered layers; units added at runtime with
`scene.append(unit)` go into layer 0. A scene needs a camera before it can
render.

Scenes provide queries such as `findById`, `findByName`, and `findByType`.
Units have an `id` and `type`, and can be assigned a `name`.

## Units

A `Unit` is the base scene object. It has a Three.js `node`, transform
controller, properties, events, and child units. Add or remove units through
`append` and `remove`, or attach a unit directly with `setParent`. The unit
hierarchy follows the underlying Three.js `Object3D` graph.

Built-in units include cameras, lights, boxes, planes, spheres, props, prefabs,
and animated puppets. Units are registered by type so manifests can construct
them; custom unit types can also be registered through `game.units.register`.

The transform controller accepts plain vector objects, for example:

```ts
unit.transform.setPosition({ x: 0, y: 1, z: 0 });
unit.transform.rotateY(45);
```

`rotateX`, `rotateY`, and `rotateZ` take degrees. The engine's `Vector2` and
`Vector3` helpers also accept and return plain objects while delegating math to
Three.js internally.

## Behaviours

Behaviours are reusable update controllers attached to units by registry key.
Register a behaviour before loading a manifest that refers to it:

```ts
game.behaviours.register('spin', (unit) => ({
  onUpdate: ({ deltaTime }) => {
    unit.transform.rotateY(90 * deltaTime);
  },
}));
```

The behavior factory can return `onLoad`, `onUpdate`, and `onDetach` callbacks.
Updates receive elapsed and delta time in seconds. `onDetach` runs when the
behavior is removed or its unit is disposed.

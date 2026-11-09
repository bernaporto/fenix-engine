# Introduction

Fenix Engine is a browser-based 3D game and game-builder engine built on Three.js.
It provides the game loop and lifecycle, a scene hierarchy of game units,
behaviour callbacks, asset and manifest loading, and keyboard and mouse input
services. The same runtime can power a game or an editor for building and
selecting scenes. Rendering and 3D assets are handled by Three.js.

## Start a game

Create a DOM element for the renderer:

```html
<div id="game"></div>
<script type="module" src="/src/main.ts"></script>
```

Create a game instance and automatically load a scene declared in the manifest:

```ts
import { Game } from '@fenix-engine/core';

const game = new Game();
const { scenePromise } = await game.init({
  containerId: 'game',
  manifest: 'assets/manifest.json',
  autoLoad: { sceneKey: 'main' },
});

if (!scenePromise) throw new Error('The scene was not started.');
const scene = await scenePromise;
```

`containerId` identifies the element that receives the WebGL canvas. The
manifest registers scene keys and optional game settings and materials.
`autoLoad: { sceneKey }` starts loading that scene after the manifest is
registered. `init()` returns `scenePromise`, which resolves to the loaded scene
or rejects if scene loading fails. `autoLoad: true` instead loads the manifest's
`settings.initialScene`, or the first registered scene if no default is set.
When `autoLoad` is omitted or `false`, `scenePromise` is `null` and no scene is
loaded; this is useful for showing an intro screen or building an editor UI
before choosing a scene.

Scenes can also be loaded explicitly at any time with
`await game.stage.load('main')`. `Stage.load()` resolves when the scene is ready.

The scene must provide a camera to render. See [Scenes and assets](./04-scenes-and-assets.md)
for a minimal manifest example.

## Where to go next

- Read [Core concepts](./02-core-concepts.md) to understand the runtime objects.
- Read [Gameplay and input](./03-gameplay-and-input.md) to add update logic and
  controls.
- Browse the [examples](../examples/) for runnable projects.

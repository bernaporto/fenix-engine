# Introduction

Fenix Engine is a browser-based 3D game engine built on Three.js. It provides
the game loop and lifecycle, a scene hierarchy of game units, behaviour
callbacks, asset and manifest loading, and keyboard and mouse input services.
Rendering and 3D assets are handled by Three.js.

## Start a game

Create a DOM element for the renderer:

```html
<div id="game"></div>
<script type="module" src="/src/main.ts"></script>
```

Initialize the shared game instance and load a scene declared in the game
manifest:

```ts
import { game } from '@fenix-engine/core';

await game.init({
  containerId: 'game',
  manifest: 'assets/manifest.json',
});

const scene = await game.stage.load('main');
```

`containerId` identifies the element that receives the WebGL canvas. The
manifest registers scene keys and optional game settings and materials. The
explicit `stage.load()` returns the loaded scene once its manifest data has
been built.

The scene must provide a camera to render. See [Scenes and assets](./04-scenes-and-assets.md)
for a minimal manifest example.

## Where to go next

- Read [Core concepts](./02-core-concepts.md) to understand the runtime objects.
- Read [Gameplay and input](./03-gameplay-and-input.md) to add update logic and
  controls.
- Browse the [examples](../examples/) for runnable projects.

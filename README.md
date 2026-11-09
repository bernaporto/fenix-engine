# Fenix Engine

Fenix Engine is a browser-based 3D game and game-builder engine built on
Three.js. It provides a game loop, scene and unit lifecycle, behaviours,
asset-backed units, and basic input services while keeping Three.js close at
hand. The same runtime can power games and tools for authoring or selecting
scenes.

## Engine guide

[01-introduction.md](./docs/01-introduction.md) — initialize the engine and load a scene.
[02-core-concepts.md](./docs/02-core-concepts.md) — games, scenes, units, transforms, and behaviours.
[03-gameplay-and-input.md](./docs/03-gameplay-and-input.md) — update logic, timing, keyboard and mouse input.
[04-scenes-and-assets.md](./docs/04-scenes-and-assets.md) — manifests, scene hierarchies, materials, and asset-backed units.

Runnable projects are available in [examples](./examples/).

## Games

[Grid Tactics](./games/grid-tactics/) is a basic 6 x 6 local turn-based movement
sandbox with placeholder pieces, blockers, keyboard controls, and a 3D board.
It uses existing engine features without extending the engine.

```sh
pnpm --filter @fenix-engine/grid-tactics dev
```

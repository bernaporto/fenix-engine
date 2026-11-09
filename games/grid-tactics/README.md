# Grid Tactics

A basic 6 x 6 local, turn-based board game built entirely with existing Fenix
Engine APIs. No engine changes or new runtime libraries are required.

## Run

From the repository root:

```sh
pnpm install
pnpm --filter @fenix-engine/grid-tactics dev
pnpm --filter @fenix-engine/grid-tactics build
pnpm --filter @fenix-engine/grid-tactics test
```

Open the URL printed by Vite in a browser with WebGL support.

## Play

- Amber starts. Each player has three pieces.
- Select a piece belonging to the active player, then an empty highlighted
  orthogonal neighbor. A successful move automatically ends the turn.
- Blockers and occupied tiles cannot be entered. There are no captures.
- Selecting the same piece again clears selection; selecting another friendly
  piece switches selection.
- Pass turn without moving, or reset to the initial board.
- Click/tap the 3D board or use the labeled tile buttons. On either board, arrow
  keys navigate, Enter/Space activates, and Escape clears selection.
- This is a movement sandbox, not a finished competitive game: no combat,
  scoring, AI, or victory condition.

## Implementation and placeholder assets

- [board.ts](./src/board.ts) contains immutable, engine-independent game rules.
- [main.ts](./src/main.ts) coordinates startup and game state.
  [boardView.ts](./src/boardView.ts) builds and updates tiles and pieces, handles
  3D picking, and owns the selection/cursor markers.
  [boardControls.ts](./src/boardControls.ts) handles the accessible tile grid,
  keyboard navigation, status, and turn/reset actions.
  [boardBehaviours.ts](./src/boardBehaviours.ts) registers movement easing and
  selection pulsing; reduced-motion preferences disable these animations.
- [manifest.json](./public/assets/manifest.json) defines the placeholder material
  palette; [board.json](./public/assets/scenes/board.json) contains the camera,
  lighting, and board base. [token.svg](./public/assets/token.svg) is a local
  placeholder UI icon. Pieces and blockers are intentionally simple primitives,
  with no external models or image downloads.
- Native DOM controls provide keyboard access and live action feedback.
  A game-owned `ResizeObserver` fits the orthographic camera to the viewport.
- Startup explicitly awaits `Stage.load` because `Game.init` does not await its
  `initialScene` load. The game also detaches its behaviours on hot reload.
- Rules tests run through this project's Vitest configuration, separately from
  the engine's root test suite.

## Suggested follow-ups

Game work that can use existing engine features:

1. Decide an objective and add victory/draw rules, then captures or abilities.
2. Replace primitive pieces with asset-backed props/prefabs; add terrain and
   authored board layouts.
3. Add undo/move history, saved matches, and a simple AI opponent in game code.
4. Add hover previews, richer tile labels, and camera controls.

Potential engine improvements, **not implemented here**:

1. Await initial-scene loading in `Game.init` and expose reliable load/error
   lifecycle signals.
2. Ensure destruction detaches behaviours and cleans up all stage subscriptions.
3. Offer opt-in container-based resizing/camera fitting.
4. Add filtered/visibility-aware picking helpers for interaction layers.

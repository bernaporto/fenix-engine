import { Box, Unit } from '@fenix-engine/core/Units';
import type { Camera, Unit as GameUnit } from '@fenix-engine/core/Units';
import {
  BOARD_SIZE,
  cellName,
  legalMoves,
  sameCell,
  type BoardState,
  type Cell,
} from './board';

export function cellToWorld(cell: Cell, y: number) {
  return {
    x: cell.col - (BOARD_SIZE - 1) / 2,
    y,
    z: cell.row - (BOARD_SIZE - 1) / 2,
  };
}

export type BoardView = {
  render: (state: BoardState, snap?: boolean) => void;
  setCursor: (cell: Cell) => void;
  pickCell: (event: PointerEvent, canvas: HTMLCanvasElement) => Cell | null;
  dispose: () => void;
};

export function createBoardView({
  scene,
  initialState,
}: {
  scene: {
    camera: Camera | null;
    append: (...units: Unit[]) => void;
  };
  initialState: BoardState;
}): BoardView {
  const camera = scene.camera;
  if (!camera) throw new Error('The board scene is missing its camera.');

  const pickRoot = new Unit({ name: 'board-picking-root' });
  const tileCells = new Map<string, Cell>();
  const pieces = new Map<string, GameUnit>();
  const piecesByUnitId = new Map<string, Cell>();
  const markers: { cell: Cell; unit: GameUnit }[] = [];
  scene.append(pickRoot);

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = { row, col };
      const tile = new Box({
        name: `tile-${cellName(cell)}`,
        width: 0.94,
        height: 0.16,
        depth: 0.94,
        position: cellToWorld(cell, -0.02),
        material: (row + col) % 2 === 0 ? 'tile-light' : 'tile-dark',
      });
      tileCells.set(tile.id, cell);
      pickRoot.append(tile);

      const marker = new Box({
        name: `move-${cellName(cell)}`,
        width: 0.22,
        height: 0.03,
        depth: 0.22,
        position: cellToWorld(cell, 0.08),
        material: 'legal-move',
      });
      marker.node.visible = false;
      markers.push({ cell, unit: marker });
      scene.append(marker);
    }
  }

  for (const cell of initialState.blockers) {
    const blocker = new Box({
      name: `blocker-${cellName(cell)}`,
      width: 0.72,
      height: 0.52,
      depth: 0.72,
      position: cellToWorld(cell, 0.32),
      material: 'blocker',
    });
    tileCells.set(blocker.id, cell);
    pickRoot.append(blocker);
  }
  for (const piece of initialState.pieces) {
    const unit = new Box({
      name: piece.id,
      width: 0.52,
      height: 0.64,
      depth: 0.52,
      position: cellToWorld(piece.cell, 0.4),
      material: piece.team,
      properties: { destination: piece.cell },
    });
    unit.addBehaviour('grid-movement');
    pieces.set(piece.id, unit);
    piecesByUnitId.set(unit.id, piece.cell);
    pickRoot.append(unit);
  }

  const selection = new Box({
    name: 'selection',
    width: 0.76,
    height: 0.03,
    depth: 0.76,
    material: 'selection',
  });
  selection.addBehaviour('selection-pulse');
  const cursor = new Box({
    name: 'keyboard-cursor',
    width: 0.98,
    height: 0.06,
    depth: 0.98,
    material: 'cursor',
  });
  scene.append(selection, cursor);

  return {
    render(state, snap = false) {
      const moves = legalMoves(state);
      for (const { cell, unit } of markers) {
        unit.node.visible = moves.some((move) => sameCell(move, cell));
      }

      for (const piece of state.pieces) {
        const unit = pieces.get(piece.id);
        if (!unit) throw new Error(`Missing piece unit: ${piece.id}`);
        unit.properties.set('destination', piece.cell);
        if (snap) unit.transform.setPosition(cellToWorld(piece.cell, 0.4));
        piecesByUnitId.set(unit.id, piece.cell);
      }

      const selected = state.pieces.find(
        (piece) => piece.id === state.selectedId,
      );
      selection.node.visible = selected !== undefined;
      if (selected) {
        selection.transform.setPosition(cellToWorld(selected.cell, 0.085));
      }
    },
    setCursor(cell) {
      cursor.transform.setPosition(cellToWorld(cell, 0.1));
    },
    pickCell(event, canvas) {
      const bounds = canvas.getBoundingClientRect();
      if (bounds.width <= 0 || bounds.height <= 0) return null;

      const hits = camera.raycast(
        {
          x: ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
          y: -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
        },
        pickRoot,
      );
      const hit = hits[0];
      if (!hit) return null;

      const cell = piecesByUnitId.get(hit.id) ?? tileCells.get(hit.id);
      if (!cell) throw new Error(`Picked unknown board unit: ${hit.name}`);
      return cell;
    },
    dispose() {
      for (const unit of pieces.values()) {
        unit.removeBehaviour('grid-movement');
      }
      selection.removeBehaviour('selection-pulse');
    },
  };
}

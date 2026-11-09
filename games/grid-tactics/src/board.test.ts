import { describe, expect, it } from 'vitest';
import {
  activateCell,
  createBoard,
  isBlocked,
  isOnBoard,
  legalMoves,
  passTurn,
  pieceAt,
  type BoardState,
} from './board';

describe('grid tactics rules', () => {
  it('starts with six distinct pieces, two blockers, and Amber to play', () => {
    const state = createBoard();
    expect(state.pieces).toHaveLength(6);
    expect(new Set(state.pieces.map((piece) => piece.id)).size).toBe(6);
    expect(
      new Set(state.pieces.map(({ cell }) => `${cell.row},${cell.col}`)).size,
    ).toBe(6);
    expect(state.blockers).toHaveLength(2);
    expect(state.turn).toBe('amber');
    expect(state.turnNumber).toBe(1);
    expect(state.selectedId).toBeNull();
    for (const { cell } of state.pieces) {
      expect(isOnBoard(cell)).toBe(true);
      expect(isBlocked(state, cell)).toBe(false);
    }
  });

  it('selects, switches, and deselects only the active player pieces', () => {
    const state = createBoard();
    expect(activateCell(state, { row: 0, col: 1 }).state).toBe(state);
    const selected = activateCell(state, { row: 5, col: 1 }).state;
    expect(selected.selectedId).toBe('amber-1');
    const switched = activateCell(selected, { row: 5, col: 2 }).state;
    expect(switched.selectedId).toBe('amber-2');
    expect(
      activateCell(switched, { row: 5, col: 2 }).state.selectedId,
    ).toBeNull();
    expect(switched.turnNumber).toBe(1);
    expect(state.selectedId).toBeNull();
  });

  it('offers only orthogonal, empty, in-bounds destinations', () => {
    const state = activateCell(createBoard(), { row: 5, col: 1 }).state;
    expect(legalMoves(state)).toEqual([
      { row: 4, col: 1 },
      { row: 5, col: 0 },
    ]);
    expect(legalMoves(createBoard())).toEqual([]);
  });

  it('moves exactly one piece, advances the turn, and preserves the previous state', () => {
    const selected = activateCell(createBoard(), { row: 5, col: 1 }).state;
    const { state, message } = activateCell(selected, { row: 4, col: 1 });
    expect(pieceAt(state, { row: 4, col: 1 })?.id).toBe('amber-1');
    expect(pieceAt(state, { row: 5, col: 1 })).toBeUndefined();
    expect(pieceAt(selected, { row: 5, col: 1 })?.id).toBe('amber-1');
    expect(
      state.pieces.filter((piece, index) => piece !== selected.pieces[index]),
    ).toHaveLength(1);
    expect(state.turn).toBe('indigo');
    expect(state.turnNumber).toBe(2);
    expect(state.selectedId).toBeNull();
    expect(message).toContain('Indigo to play');
    const indigo = activateCell(state, { row: 0, col: 1 }).state;
    expect(activateCell(indigo, { row: 1, col: 1 }).state.turn).toBe('amber');
  });

  it('rejects diagonal, long-distance, empty-without-selection, and invalid moves', () => {
    const initial = createBoard();
    expect(activateCell(initial, { row: 4, col: 1 }).state).toBe(initial);
    const state = activateCell(initial, { row: 5, col: 1 }).state;
    for (const cell of [
      { row: 4, col: 0 },
      { row: 3, col: 1 },
      { row: 6, col: 1 },
      { row: -1, col: 1 },
      { row: 4.5, col: 1 },
      { row: NaN, col: 1 },
      { row: 4, col: Infinity },
      { row: 4, col: 6 },
    ]) {
      const result = activateCell(state, cell);
      expect(result.state).toBe(state);
      expect(result.message.length).toBeGreaterThan(0);
    }
  });

  it('cannot enter blockers or capture an adjacent opponent', () => {
    const state: BoardState = {
      ...createBoard(),
      selectedId: 'amber-1',
      pieces: [
        { id: 'amber-1', team: 'amber', cell: { row: 2, col: 1 } },
        { id: 'indigo-1', team: 'indigo', cell: { row: 1, col: 1 } },
      ],
    };
    expect(legalMoves(state)).toEqual([
      { row: 3, col: 1 },
      { row: 2, col: 0 },
    ]);
    expect(activateCell(state, { row: 2, col: 2 }).message).toContain(
      'blocked',
    );
    expect(activateCell(state, { row: 2, col: 2 }).state).toBe(state);
    expect(activateCell(state, { row: 1, col: 1 }).message).toContain(
      'No captures',
    );
    expect(activateCell(state, { row: 1, col: 1 }).state).toBe(state);
  });

  it('passes without moving and a new board fully resets the session', () => {
    const selected = activateCell(createBoard(), { row: 5, col: 1 }).state;
    const passed = passTurn(selected);
    expect(passed.pieces).toBe(selected.pieces);
    expect(passed.turn).toBe('indigo');
    expect(passed.turnNumber).toBe(2);
    expect(passed.selectedId).toBeNull();
    const reset = createBoard();
    expect(reset).toEqual(createBoard());
    expect(reset.pieces).not.toBe(selected.pieces);
    expect(reset.blockers).not.toBe(selected.blockers);
  });
});

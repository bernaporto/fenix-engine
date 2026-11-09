export const BOARD_SIZE = 6;

export type Team = 'amber' | 'indigo';
export type Cell = Readonly<{ row: number; col: number }>;
export type Piece = Readonly<{ id: string; team: Team; cell: Cell }>;
export type BoardState = Readonly<{
  pieces: readonly Piece[];
  blockers: readonly Cell[];
  turn: Team;
  selectedId: string | null;
  turnNumber: number;
}>;
export type ActionResult = Readonly<{ state: BoardState; message: string }>;

export function sameCell(a: Cell, b: Cell): boolean {
  return a.row === b.row && a.col === b.col;
}

export function isOnBoard(cell: Cell): boolean {
  return (
    Number.isInteger(cell.row) &&
    Number.isInteger(cell.col) &&
    cell.row >= 0 &&
    cell.row < BOARD_SIZE &&
    cell.col >= 0 &&
    cell.col < BOARD_SIZE
  );
}

export function teamName(team: Team): string {
  return team === 'amber' ? 'Amber' : 'Indigo';
}

export function cellName(cell: Cell): string {
  return `${String.fromCharCode(65 + cell.col)}${cell.row + 1}`;
}

export function createBoard(): BoardState {
  return {
    pieces: (['amber', 'indigo'] as const).flatMap((team) =>
      [1, 2, 4].map((col, index) => ({
        id: `${team}-${index + 1}`,
        team,
        cell: { row: team === 'amber' ? BOARD_SIZE - 1 : 0, col },
      })),
    ),
    blockers: [
      { row: 2, col: 2 },
      { row: 3, col: 3 },
    ],
    turn: 'amber',
    selectedId: null,
    turnNumber: 1,
  };
}

export function pieceAt(state: BoardState, cell: Cell): Piece | undefined {
  return state.pieces.find((piece) => sameCell(piece.cell, cell));
}

export function isBlocked(state: BoardState, cell: Cell): boolean {
  return state.blockers.some((blocker) => sameCell(blocker, cell));
}

export function legalMoves(state: BoardState): Cell[] {
  const piece = state.pieces.find((item) => item.id === state.selectedId);
  if (!piece || piece.team !== state.turn) return [];

  const { row, col } = piece.cell;
  return [
    { row: row - 1, col },
    { row: row + 1, col },
    { row, col: col - 1 },
    { row, col: col + 1 },
  ].filter(
    (cell) =>
      isOnBoard(cell) && !isBlocked(state, cell) && !pieceAt(state, cell),
  );
}

export function passTurn(state: BoardState): BoardState {
  return {
    ...state,
    turn: state.turn === 'amber' ? 'indigo' : 'amber',
    selectedId: null,
    turnNumber: state.turnNumber + 1,
  };
}

export function activateCell(state: BoardState, cell: Cell): ActionResult {
  if (!isOnBoard(cell)) {
    return { state, message: 'Choose a tile inside the board.' };
  }

  const piece = pieceAt(state, cell);
  if (piece?.team === state.turn) {
    const selectedId = state.selectedId === piece.id ? null : piece.id;
    return {
      state: { ...state, selectedId },
      message: selectedId
        ? `${teamName(piece.team)} piece at ${cellName(cell)} selected. Choose a highlighted neighboring tile.`
        : 'Selection cleared. Choose one of your pieces.',
    };
  }

  if (legalMoves(state).some((move) => sameCell(move, cell))) {
    const moved = {
      ...state,
      pieces: state.pieces.map((item) =>
        item.id === state.selectedId ? { ...item, cell: { ...cell } } : item,
      ),
    };
    const next = passTurn(moved);
    return {
      state: next,
      message: `${teamName(state.turn)} moved to ${cellName(cell)}. ${teamName(next.turn)} to play.`,
    };
  }

  const message = isBlocked(state, cell)
    ? 'That tile is blocked.'
    : piece
      ? `That is an ${teamName(piece.team)} piece. No captures in this sandbox.`
      : state.selectedId
        ? 'Move one tile horizontally or vertically to an empty highlighted tile.'
        : `Select an ${teamName(state.turn)} piece first.`;

  return { state, message };
}

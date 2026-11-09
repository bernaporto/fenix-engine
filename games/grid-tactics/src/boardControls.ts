import {
  BOARD_SIZE,
  cellName,
  isBlocked,
  legalMoves,
  pieceAt,
  sameCell,
  teamName,
  type BoardState,
  type Cell,
} from './board';

const INITIAL_CURSOR: Cell = { row: BOARD_SIZE - 1, col: 1 };

type BoardControlsOptions = {
  onActivate: (cell: Cell) => void;
  onPass: () => void;
  onReset: () => void;
  onClearSelection: () => void;
  onCursorChange: (cell: Cell) => void;
};

export type BoardControls = {
  render: (state: BoardState, message: string) => void;
  activate: (cell: Cell) => void;
  setCursor: (cell: Cell) => void;
  attachCanvas: (canvas: HTMLCanvasElement) => void;
  setActionsEnabled: (enabled: boolean) => void;
  dispose: () => void;
};

/*---------------------------------- Setup -----------------------------------*/
function getElement<T extends HTMLElement>(id: string, type: new () => T): T {
  const node = document.getElementById(id);
  if (!(node instanceof type)) throw new Error(`Missing game element: ${id}`);
  return node;
}

export function createBoardControls(
  options: BoardControlsOptions,
): BoardControls {
  const board = getElement('board-controls', HTMLDivElement);
  const status = getElement('status', HTMLParagraphElement);
  const turn = getElement('turn', HTMLHeadingElement);
  const turnNumber = getElement('turn-number', HTMLParagraphElement);
  const pass = getElement('pass', HTMLButtonElement);
  const reset = getElement('reset', HTMLButtonElement);
  let state: BoardState;
  let cursor = INITIAL_CURSOR;
  let canvas: HTMLCanvasElement | undefined;

  const buttons: { cell: Cell; button: HTMLButtonElement }[] = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = { row, col };
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.row = String(row);
      button.dataset.col = String(col);
      buttons.push({ cell, button });
      board.appendChild(button);
    }
  }

  function getCellFromTarget(target: EventTarget | null): Cell | null {
    if (!(target instanceof HTMLButtonElement) || !board.contains(target)) {
      return null;
    }

    const row = Number(target.dataset.row);
    const col = Number(target.dataset.col);
    if (!Number.isInteger(row) || !Number.isInteger(col)) return null;
    return { row, col };
  }

  function onTileClick(event: MouseEvent): void {
    const cell = getCellFromTarget(event.target);
    if (cell) activate(cell);
  }

  function onTileFocus(event: FocusEvent): void {
    const cell = getCellFromTarget(event.target);
    if (cell) setCursor(cell);
  }

  function setCursor(cell: Cell): void {
    cursor = cell;
    options.onCursorChange(cell);
    for (const item of buttons) {
      item.button.tabIndex = sameCell(item.cell, cursor) ? 0 : -1;
    }
  }

  function activate(cell: Cell): void {
    setCursor(cell);
    options.onActivate(cell);
  }

  function render(nextState: BoardState, message: string): void {
    state = nextState;
    status.textContent = message;
    turn.textContent = `${teamName(state.turn)} to play`;
    turn.dataset.team = state.turn;
    turnNumber.textContent = `Local hot-seat / turn ${state.turnNumber}`;

    const moves = legalMoves(state);
    for (const { cell, button } of buttons) {
      const piece = pieceAt(state, cell);
      const blocked = isBlocked(state, cell);
      const legal = moves.some((move) => sameCell(move, cell));
      button.textContent = piece
        ? piece.team === 'amber'
          ? 'A'
          : 'I'
        : blocked
          ? '#'
          : legal
            ? '+'
            : '.';
      button.dataset.team = piece?.team ?? '';
      button.dataset.blocked = String(blocked);
      button.dataset.legal = String(legal);
      button.setAttribute(
        'aria-pressed',
        String(piece !== undefined && piece.id === state.selectedId),
      );
      button.setAttribute(
        'aria-label',
        `${cellName(cell)}: ${piece ? `${teamName(piece.team)} piece` : blocked ? 'blocked' : 'empty'}${legal ? ', legal move' : ''}`,
      );
    }
    setCursor(cursor);
  }

  /*---------------------------------- Input -----------------------------------*/
  function onKeyDown(event: KeyboardEvent): void {
    const directions: Record<string, Cell> = {
      ArrowUp: { row: -1, col: 0 },
      ArrowDown: { row: 1, col: 0 },
      ArrowLeft: { row: 0, col: -1 },
      ArrowRight: { row: 0, col: 1 },
    };
    const direction = directions[event.key];

    if (direction) {
      event.preventDefault();
      const next = {
        row: Math.max(0, Math.min(BOARD_SIZE - 1, cursor.row + direction.row)),
        col: Math.max(0, Math.min(BOARD_SIZE - 1, cursor.col + direction.col)),
      };
      setCursor(next);
      if (board.contains(document.activeElement)) {
        buttons.find(({ cell }) => sameCell(cell, next))?.button.focus();
      } else if (state) {
        const piece = pieceAt(state, next);
        status.textContent = `${cellName(next)}: ${piece ? `${teamName(piece.team)} piece` : isBlocked(state, next) ? 'blocked' : 'empty'}.`;
      }
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      options.onClearSelection();
      return;
    }

    if (
      canvas &&
      event.target === canvas &&
      (event.key === 'Enter' || event.key === ' ')
    ) {
      event.preventDefault();
      if (!event.repeat) activate(cursor);
    }
  }

  /*-------------------------------- Lifecycle ---------------------------------*/
  board.addEventListener('click', onTileClick);
  board.addEventListener('focusin', onTileFocus);
  pass.addEventListener('click', options.onPass);
  reset.addEventListener('click', options.onReset);
  board.addEventListener('keydown', onKeyDown);

  return {
    render,
    activate,
    setCursor,
    attachCanvas(target) {
      canvas = target;
      canvas.addEventListener('keydown', onKeyDown);
    },
    setActionsEnabled(enabled) {
      pass.disabled = !enabled;
      reset.disabled = !enabled;
    },
    dispose() {
      board.removeEventListener('click', onTileClick);
      board.removeEventListener('focusin', onTileFocus);
      board.removeEventListener('keydown', onKeyDown);
      pass.removeEventListener('click', options.onPass);
      reset.removeEventListener('click', options.onReset);
      canvas?.removeEventListener('keydown', onKeyDown);
      canvas = undefined;
      board.replaceChildren();
      pass.disabled = true;
      reset.disabled = true;
    },
  };
}

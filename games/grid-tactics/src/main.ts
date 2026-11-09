import './style.css';
import { Game } from '@fenix-engine/core';
import { createBoard, activateCell, passTurn, type Cell } from './board';
import { createBoardControls } from './boardControls';
import { registerBoardBehaviours } from './boardBehaviours';
import { createBoardView, type BoardView } from './boardView';

function getContainer(): HTMLDivElement {
  const container = document.getElementById('game');
  if (!(container instanceof HTMLDivElement)) {
    throw new Error('Missing game element: game');
  }
  return container;
}

async function start(): Promise<void> {
  const container = getContainer();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let state = createBoard();
  let game: Game | undefined;
  let boardView: BoardView | undefined;
  let resizeObserver: ResizeObserver | undefined;
  let attachedCanvas: HTMLCanvasElement | undefined;
  let pointerHandler: ((event: PointerEvent) => void) | undefined;

  function render(message: string, snap = false): void {
    boardView?.render(state, snap);
    controls.render(state, message);
  }

  function activate(cell: Cell): void {
    const result = activateCell(state, cell);
    state = result.state;
    render(result.message);
  }

  const controls = createBoardControls({
    onActivate: activate,
    onPass: () => {
      state = passTurn(state);
      render(
        `Turn passed. ${state.turn === 'amber' ? 'Amber' : 'Indigo'} to play.`,
      );
    },
    onReset: () => {
      state = createBoard();
      controls.setCursor({ row: 5, col: 1 });
      render('Board reset. Amber to play. Select one of your pieces.', true);
    },
    onClearSelection: () => {
      state = { ...state, selectedId: null };
      render('Selection cleared. Choose one of your pieces.');
    },
    onCursorChange: (cell) => boardView?.setCursor(cell),
  });
  controls.render(state, 'Loading board...');

  try {
    const activeGame = new Game();
    game = activeGame;
    registerBoardBehaviours(activeGame, reducedMotion);
    await activeGame.init({
      containerId: 'game',
      manifest: 'assets/manifest.json',
    });
    // Game.init does not await initial-scene loading, so load it explicitly.
    const scene = await activeGame.stage.load('board');
    boardView = createBoardView({
      scene,
      initialState: state,
    });

    const canvas = activeGame.domElement;
    attachedCanvas = canvas;
    canvas.tabIndex = 0;
    canvas.setAttribute(
      'aria-label',
      '3D tactics board. Arrow keys navigate tiles; Enter or Space selects or moves; Escape clears selection.',
    );
    const onPointerDown = (event: PointerEvent): void => {
      if (event.button !== 0 || !event.isPrimary) return;
      canvas.focus({ preventScroll: true });
      const cell = boardView?.pickCell(event, canvas);
      if (cell) controls.activate(cell);
      else render('Choose a tile inside the board.');
    };
    pointerHandler = onPointerDown;
    canvas.addEventListener('pointerdown', onPointerDown);
    controls.attachCanvas(canvas);

    const camera = scene.camera;
    if (!camera) throw new Error('The board scene is missing its camera.');
    const resize = (): void => {
      const { width, height } = container.getBoundingClientRect();
      if (width <= 0 || height <= 0) return;
      const aspect = width / height;
      activeGame.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      activeGame.renderer.setSize(width, height);
      camera.resize(aspect);
      camera.setZoom(Math.min(20 / 8.5, (20 * aspect) / 8.5));
    };
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    controls.setActionsEnabled(true);
    render('Amber to play. Select one of your pieces.', true);

    const dispose = (): void => {
      resizeObserver?.disconnect();
      boardView?.dispose();
      controls.dispose();
      canvas.removeEventListener('pointerdown', onPointerDown);
      activeGame.destroy();
      canvas?.remove();
    };
    import.meta.hot?.dispose(dispose);
  } catch (error) {
    resizeObserver?.disconnect();
    boardView?.dispose();
    controls.dispose();
    if (attachedCanvas && pointerHandler) {
      attachedCanvas.removeEventListener('pointerdown', pointerHandler);
      attachedCanvas.remove();
    }
    game?.destroy();
    throw error;
  }
}

void start().catch((error: unknown) => {
  console.error('Grid Tactics failed to start', error);
  const status = document.getElementById('status');
  if (status) {
    status.textContent = `Unable to start Grid Tactics: ${error instanceof Error ? error.message : String(error)}. Check WebGL support and reload.`;
    status.setAttribute('role', 'alert');
  }
});

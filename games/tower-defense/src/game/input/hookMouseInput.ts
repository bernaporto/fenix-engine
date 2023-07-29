import { MouseButton, MouseHandler } from '@fenix-engine/services/Input';
// import { handlePan } from './handlePan';
// import { handleZoom } from './handleZoom';

export const hookMouseInput = (canvas: HTMLCanvasElement) => {
  const mouse = new MouseHandler(canvas, [MouseButton.LEFT]);

  mouse.state.subscribe((state) => {
    if (state.type === 'idle') return;

    switch (state.type) {
      case 'drag':
        // handlePan(state);

        break;

      case 'wheel': {
        // handleZoom(state);
        break;
      }

      default:
        break;
    }
  });

  // Disable context menu
  const onContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  document.addEventListener('contextmenu', onContextMenu);

  return mouse;
};

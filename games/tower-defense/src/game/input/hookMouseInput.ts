import { MouseButton, MouseHandler } from '@fenix-engine/services/Input';

export const hookMouseInput = (canvas: HTMLCanvasElement) => {
  const mouse = new MouseHandler(canvas, [MouseButton.LEFT]);

  // Disable context menu
  const onContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  document.addEventListener('contextmenu', onContextMenu);

  return mouse;
};

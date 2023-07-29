import { BehaviourType } from '@/constants';
import { game } from '@fenix-engine/core';
import { MouseHandler } from '@fenix-engine/services/Input';
import { draggable } from './draggable';
import { zoomable } from './zoomable';

export const registerCameraBehaviours = (mouse: MouseHandler) => {
  const register = game.behaviours.register;

  register(BehaviourType.Draggable, draggable(mouse));
  register(BehaviourType.Zoomable, zoomable(mouse));
};

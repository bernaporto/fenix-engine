import { Unit, Camera } from '@fenix-engine/core/Units';

export const isCamera = (unit: Unit): unit is Camera => unit instanceof Camera;

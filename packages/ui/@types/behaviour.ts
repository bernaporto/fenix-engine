import { UIUnit } from '../units/UIUnit';

export type UIBehaviourController = {
  onDetach?: VoidFunction;
  onAttributeChange?: (attribute: string, value: unknown) => void;
};

export type UIBehaviour = <T extends UIUnit>(
  unit: T
) => UIBehaviourController | void;

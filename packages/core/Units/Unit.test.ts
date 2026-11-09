import { describe, expect, it, vi } from 'vitest';
import { BehaviourRegistry } from '../Game/registries/BehaviourRegistry';
import { Unit } from './Unit';

describe('Unit disposal', () => {
  it('detaches each behaviour when disposed', () => {
    const onDetach = vi.fn();
    BehaviourRegistry.add('unit-dispose-test', () => ({ onDetach }));
    const unit = new Unit();
    unit.addBehaviour('unit-dispose-test');

    unit.dispose();
    unit.dispose();

    expect(onDetach).toHaveBeenCalledTimes(1);
    expect(unit.behaviours).toEqual([]);
  });

  it('detaches child behaviours when a parent is disposed', () => {
    const onDetach = vi.fn();
    BehaviourRegistry.add('unit-child-dispose-test', () => ({ onDetach }));
    const parent = new Unit();
    const child = new Unit();
    child.addBehaviour('unit-child-dispose-test');
    parent.append(child);

    parent.dispose();

    expect(onDetach).toHaveBeenCalledTimes(1);
    expect(child.node.parent).toBeNull();
  });
});

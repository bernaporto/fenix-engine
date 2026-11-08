import { describe, expect, it, vi } from 'vitest';
import { Object3D } from 'three';
import type { TickerState } from '../Tools/Ticker';
import { Layer } from './Layer';
import { SceneItem } from './SceneItem';

const tickerState: TickerState = {
  deltaTime: 0,
  elapsedTime: 0,
  status: 'running',
};

describe('SceneItem', () => {
  it('derives children and parent from the Three.js object graph', () => {
    const parent = new SceneItem('parent');
    const child = new SceneItem('child');

    parent.node.add(child.node);

    expect(parent.children).toEqual([child]);
    expect(child.parent).toBe(parent);

    parent.node.remove(child.node);

    expect(parent.children).toEqual([]);
    expect(child.parent).toBeNull();
  });

  it('reparents items through Three.js and keeps both sides in sync', () => {
    const firstParent = new SceneItem('first');
    const secondParent = new SceneItem('second');
    const child = new SceneItem('child');

    firstParent.append(child);
    secondParent.append(child);

    expect(firstParent.children).toEqual([]);
    expect(secondParent.children).toEqual([child]);
    expect(child.parent).toBe(secondParent);
    expect(child.node.parent).toBe(secondParent.node);
  });

  it('only removes items that are direct children', () => {
    const parent = new SceneItem('parent');
    const child = new SceneItem('child');
    const unrelated = new SceneItem('unrelated');

    parent.append(child);
    parent.remove(unrelated);

    expect(child.parent).toBe(parent);

    parent.remove(child);

    expect(child.parent).toBeNull();
    expect(parent.children).toEqual([]);
  });

  it('recognizes SceneItems added beneath a Three.js-only parent', () => {
    const externalParent = new Object3D();
    const child = new SceneItem('child');

    externalParent.add(child.node);

    expect(child.parent).toBeNull();

    child.removeFromParent();

    expect(child.node.parent).toBeNull();
  });

  it('clears layer children through the Three.js object graph', () => {
    const layer = new Layer();
    const child = new SceneItem('child');

    layer.append(child);
    layer.clear();

    expect(layer.children).toEqual([]);
    expect(child.parent).toBeNull();
    expect(child.node.parent).toBeNull();
  });

  it('updates and disposes its children from the object graph', () => {
    class ChildItem extends SceneItem {
      public update = vi.fn((_state: TickerState) => {});
    }

    const parent = new SceneItem('parent');
    const child = new ChildItem('child');
    parent.node.add(child.node);

    parent.update(tickerState);
    expect(child.update).toHaveBeenCalledWith(tickerState);

    parent.dispose();

    expect(child.node.parent).toBeNull();
    expect(parent.node.children).toEqual([]);
  });
});

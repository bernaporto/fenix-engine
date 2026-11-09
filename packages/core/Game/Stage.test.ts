import { afterEach, describe, expect, it, vi } from 'vitest';
import type { WebGLRenderer } from 'three';
import { Stage } from './Stage';

vi.mock('../Scene', () => ({ Scene: vi.fn() }));

class ResizeObserverStub implements ResizeObserver {
  private static observers: ResizeObserverStub[] = [];

  constructor(private callback: ResizeObserverCallback) {
    ResizeObserverStub.observers.push(this);
  }

  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();

  static get instances(): ResizeObserverStub[] {
    return this.observers;
  }

  static trigger(): void {
    this.observers.forEach((observer) => observer.callback([], observer));
  }

  static clear(): void {
    this.observers = [];
  }
}

function createRenderer(width: number, height: number) {
  const container = document.createElement('div');
  document.body.append(container);
  vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
    width,
    height,
  } as DOMRect);
  const canvas = document.createElement('canvas');
  container.append(canvas);

  const renderer = Object.assign(Object.create(null), {
    autoClear: true,
    domElement: canvas,
    setClearColor: vi.fn(),
    setPixelRatio: vi.fn(),
    setSize: vi.fn(),
  }) as WebGLRenderer;

  return { container, renderer };
}

describe('Stage resize notifications', () => {
  afterEach(() => {
    ResizeObserverStub.clear();
    vi.unstubAllGlobals();
    document.body.replaceChildren();
  });

  it('notifies subscribers initially and when the container resizes', () => {
    vi.stubGlobal('ResizeObserver', ResizeObserverStub);
    const { container, renderer } = createRenderer(800, 600);
    const stage = new Stage(renderer);
    const onResize = vi.fn();
    const unsubscribe = stage.events.on('resize', onResize);
    stage.applyConfig({ autoResize: true });
    expect(stage.size).toEqual({
      width: 800,
      height: 600,
      aspect: 4 / 3,
    });
    expect(onResize).toHaveBeenLastCalledWith({
      width: 800,
      height: 600,
      aspect: 4 / 3,
    });
    expect(ResizeObserverStub.instances).toHaveLength(1);
    expect(ResizeObserverStub.instances[0].observe).toHaveBeenCalledWith(
      container,
    );

    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
      width: 1000,
      height: 500,
    } as DOMRect);
    ResizeObserverStub.trigger();

    expect(onResize).toHaveBeenLastCalledWith({
      width: 1000,
      height: 500,
      aspect: 2,
    });
    expect(stage.size).toEqual({
      width: 1000,
      height: 500,
      aspect: 2,
    });
    const notificationCount = onResize.mock.calls.length;
    unsubscribe();
    ResizeObserverStub.trigger();
    expect(onResize).toHaveBeenCalledTimes(notificationCount);
    stage.dispose();
  });

  it('disconnects container observation when disposed', () => {
    vi.stubGlobal('ResizeObserver', ResizeObserverStub);
    const { renderer } = createRenderer(800, 600);
    const stage = new Stage(renderer);
    stage.applyConfig({ autoResize: true });

    stage.dispose();

    expect(ResizeObserverStub.instances[0].disconnect).toHaveBeenCalled();
  });

  it('does not report zero-sized containers', () => {
    vi.stubGlobal('ResizeObserver', ResizeObserverStub);
    const { container, renderer } = createRenderer(800, 600);
    const stage = new Stage(renderer);
    stage.applyConfig({ autoResize: true });
    const onResize = vi.fn();
    stage.events.on('resize', onResize);
    onResize.mockClear();

    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
      width: 0,
      height: 0,
    } as DOMRect);
    ResizeObserverStub.trigger();

    expect(onResize).not.toHaveBeenCalled();
    expect(stage.size).toEqual({
      width: 800,
      height: 600,
      aspect: 4 / 3,
    });
    stage.dispose();
    expect(stage.size).toBeNull();
  });
});

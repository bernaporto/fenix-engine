import { afterEach, describe, expect, it, vi } from 'vitest';
import { Game } from './Game';

const { loadGameManifest } = vi.hoisted(() => ({
  loadGameManifest: vi.fn(),
}));

vi.mock('../Data', () => ({ loadGameManifest }));
vi.mock('./registries', () => ({
  BehaviourRegistry: { add: vi.fn() },
  MaterialRegistry: { add: vi.fn() },
  SceneRegistry: { add: vi.fn() },
  UnitRegistry: { add: vi.fn() },
}));
vi.mock('./Stage', () => ({ Stage: vi.fn() }));

function createGame(scenePromise: Promise<never>) {
  const stage = {
    applyConfig: vi.fn(),
    load: vi.fn(() => scenePromise),
  };
  const renderer = {
    domElement: document.createElement('canvas'),
    shadowMap: { enabled: false, type: 0 },
  };
  const game = Object.create(Game.prototype) as Game;
  Object.defineProperties(game, {
    renderer: { value: renderer },
    stage: { value: stage },
  });

  const container = document.createElement('div');
  container.id = 'game-container';
  document.body.append(container);

  return { game, stage, container };
}

describe('Game auto-loading', () => {
  afterEach(() => {
    vi.clearAllMocks();
    document.body.replaceChildren();
  });

  it('only registers the manifest when autoLoad is omitted', async () => {
    loadGameManifest.mockResolvedValue({
      settings: { initialScene: 'main' },
      scenes: [{ key: 'main', path: 'main.json' }],
    });
    const scenePromise = Promise.resolve(null) as Promise<never>;
    const { game, stage } = createGame(scenePromise);

    const result = await game.init({
      containerId: 'game-container',
      manifest: 'manifest.json',
    });

    expect(stage.load).not.toHaveBeenCalled();
    expect(result.initialScene).toBe('main');
    expect(result.scenePromise).toBeNull();
  });

  it('auto-loads the manifest default when autoLoad is true', async () => {
    loadGameManifest.mockResolvedValue({
      settings: { initialScene: 'preferred' },
      scenes: [
        { key: 'first', path: 'first.json' },
        { key: 'preferred', path: 'preferred.json' },
      ],
    });
    const scenePromise = Promise.resolve(null) as Promise<never>;
    const { game, stage } = createGame(scenePromise);

    const result = await game.init({
      containerId: 'game-container',
      manifest: 'manifest.json',
      autoLoad: true,
    });

    expect(stage.load).toHaveBeenCalledWith('preferred');
    expect(result.scenePromise).toBe(scenePromise);
    expect(result.initialScene).toBe('preferred');
  });

  it('falls back to the first registered scene when no default is configured', async () => {
    loadGameManifest.mockResolvedValue({
      scenes: [
        { key: 'first', path: 'first.json' },
        { key: 'second', path: 'second.json' },
      ],
    });
    const scenePromise = Promise.resolve(null) as Promise<never>;
    const { game, stage } = createGame(scenePromise);

    const result = await game.init({
      containerId: 'game-container',
      manifest: 'manifest.json',
      autoLoad: true,
    });

    expect(stage.load).toHaveBeenCalledWith('first');
    expect(result.initialScene).toBe('first');
    expect(result.scenePromise).toBe(scenePromise);
  });

  it('auto-loads an explicitly selected scene', async () => {
    loadGameManifest.mockResolvedValue({
      scenes: [
        { key: 'first', path: 'first.json' },
        { key: 'editor', path: 'editor.json' },
      ],
    });
    const scenePromise = Promise.resolve(null) as Promise<never>;
    const { game, stage } = createGame(scenePromise);

    const result = await game.init({
      containerId: 'game-container',
      manifest: 'manifest.json',
      autoLoad: { sceneKey: 'editor' },
    });

    expect(stage.load).toHaveBeenCalledWith('editor');
    expect(result.scenePromise).toBe(scenePromise);
    expect(result.initialScene).toBe('editor');
  });

  it('rejects auto-loading when no scene is registered', async () => {
    loadGameManifest.mockResolvedValue({ scenes: [] });
    const { game, stage } = createGame(Promise.resolve(null) as Promise<never>);

    await expect(
      game.init({
        containerId: 'game-container',
        manifest: 'manifest.json',
        autoLoad: true,
      }),
    ).rejects.toThrow(
      'Cannot auto-load a scene because the manifest has none.',
    );
    expect(stage.load).not.toHaveBeenCalled();
  });
});

// Arrow Game Example
// Description: Shoot arrows at the target to score points. The game ends when you run out of health.

// This file represents how games should be created and used.

// The game class will load a manifest file in the assets folder and load all the modules and assets accordingly.
const game = new Game({
  manifest: 'assets/manifest.json',
});

/**
 * units can have behaviours attached to them.
 * Behaviours are functions that are called only once and can be used to update the object's state.
 * Behaviours can also be used to listen to events (e.g. collision, click, etc.).
 * Behaviours can be added to units in the manifest file or in the scene file.
 */
game.registerBehaviour({
  key: 'playerController',
  behaviour: (unit) => {
    const keyboard = new Keyboard();
    /**
     * The unit can emit custom events so other behaviours can listen to them.
     */
    keyboard
      .on('Space', () => unit.emit('shoot'))
      .on('ArrowLeft', () => unit.emit('moveLeft'))
      .on('ArrowRight', () => unit.emit('moveRight'))
      .on('ArrowUp', () => unit.emit('aimUp'))
      .on('ArrowDown', () => unit.emit('aimDown'));
  },
});

/**
 * The game store should contain all the game data and state.
 * It should also contain internal data that could be used by the developer as well (e.g. game settings, loading progress, etc.)
 */
// TODO: Develop internal data store model.

game.on('load', () => {
  /**
   * Each scene should have its own file in the scenes folder, described in the game manifest file.
   * The manifest file should also describe which scene is going to be loaded first (e.g. 'main', 'splash', 'menu', etc. )
   * A scene can contain multiple layers and each layer can contain multiple objects. The UI layer is always rendered on top.
   * Scene layers can be of type UI or 3D. (Should UI have a different engine?)
   */
  const scene = game.stage.loadScene('main');

  /**
   * Each object should have its own file in the objects folder, described in the game manifest file.
   * Objects can be of type prop, puppet, light or camera.
   * Props are static objects that can be used as decoration or with simple animations (e.g. trees, platforms, etc.).
   * Puppets are skinned objects that can be animated with a skeleton (e.g. characters, animals, etc.).
   * All objects can be accessed through the scene object.
   */
  const lights = scene.findObjectByType('light');
  lights.forEach((light) => {
    light.setIntensity(0.5);
  });

  const target = scene.findObjectById('target');
  target.addBehaviour((object) => {
    object.on('update', () => {
      // Do something on every frame.
    });

    object.on('collision', (object) => {
      // Do something when the object collides with another object.
      // e.g object.destroy();
    });
  });

  /**
   * Objects can also be created dynamically.
   */
  const arrowFactory = new PropFactory({
    name: 'arrow',
    asset: 'arrow.prop',
  });

  const player = scene.findObjectById('player');
  player.on('shoot', () => {
    const arrow = arrowFactory.create();
    const arrowTrail = new ParticleSystem();

    arrow.add(arrowTrail);
    player.add(arrow);
    arrow.setPosition(0, 0, 0);

    arrow.addBehaviour((object) => {
      object.on('update', (dt) => {
        object.setPosition({
          x: object.position.x + dt * SPEED,
          y: object.position.y,
          z: object.position.z,
        });
      });
    });
  });
});

// BEHAVIOURS -> MORE IDEAS

// DEPENDENCY INJECTION (Typescript only?)
/**
 * game.injector.register(GameStore);
 *
 * player.addBehaviour(PlayerController);
 *
 * class PlayerController {
 *   constructor (
 *     private store: GameStore,
 *   )
 * }
 */

// PRE-DEFINED CONTEXT

const handlePlayer = ({
  // Default properties
  object,
  // Custom properties
  arrowFactory,
  store,
}) => {
  /* ... */
};

game.registerBehaviour('PlayerController', handlePlayer, {
  store: game.store,
  arrowFactory: new PuppetFactory({
    /* ... */
  }),
});

// INTERNAL STATE

const handlePlayerMovement = ({ object }) => {
  /* ... */
};

game.registerBehaviour('PlayerMovementController', handlePlayerMovement);

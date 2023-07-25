TODO:

- Add schemes to validate json config files (?) ([yup](https://github.com/jquense/yup))
- ~~Add state to scene that should be initialized by the scene manifest~~
- ~~Add `findUnitBy*` methods to `Scene` class (e.g. `findUnitById`, `findUnitsByTag`, `findUnitsByType`)~~
- ~~Add reactive state to unit~~
  - ~~(e.g. `unit.state.get('health')`, `unit.state.set('health', 100)`, `unit.state.subscribe('health', (health) => { ... })`)~~
  - ~~State can be initialized through scene manifest or prefab manifest~~
- ~~Add `game.behaviour.register` method with additional parameters (e.g. `game.behaviour.register('player', playerBehaviour, { ... })`)~~
- ~~Unify GameSettings and GameConfig types~~
  - ~~Add shadow configuration to GameSettings~~

import { Behaviour } from '@fenix-engine/core/@types';
import { Prop } from '@fenix-engine/core/Units';
import { Vector3 } from '@fenix-engine/core/Math';

export const towerBehaviour: Behaviour = (unit) => {
  const towersAt = [
    { x: 9.5, y: 0, z: 10.5 },
    { x: 9.5, y: 0, z: 8.5 },
  ];
  const path = towersAt.some((pos) =>
    Vector3.equals(pos, unit.transform.position),
  )
    ? 'assets/props/watch.obj'
    : 'assets/props/tower_slot_banner.obj';
  const prop = new Prop({
    path,
    castShadow: true,
    material: 'double-sided-material',
  });
  prop.transform.setPosition({
    x: 0,
    y: -0.03,
    z: 0,
  });
  unit.append(prop);

  return {};
};

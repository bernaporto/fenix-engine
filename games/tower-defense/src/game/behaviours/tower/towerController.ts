import { Behaviour } from '@fenix-engine/core/@types';
import { Prop, Unit } from '@fenix-engine/core/Units';
import { Vector3 } from '@fenix-engine/core/Math';

export const towerController: Behaviour = (unit) => {
  const towersAt = [
    { x: 9.5, y: 0, z: 10.5 },
    { x: 9.5, y: 0, z: 8.5 },
  ];
  const path = towersAt.some((pos) =>
    Vector3.equals(pos, unit.transform.position)
  )
    ? 'assets/props/towers/watch.obj'
    : 'assets/props/towers/tower_slot_banner.obj';
  const prop = new Prop({
    path,
    castShadow: true,
    material: 'double-sided-material',
  });

  unit.append(prop);
  adjustPosition(unit);

  return {};
};

// TODO: This should be done in the model
const adjustPosition = (unit: Unit) => {
  unit.transform.setPosition(
    Vector3.add(unit.transform.position, {
      x: 0,
      y: -0.03,
      z: 0,
    })
  );
};

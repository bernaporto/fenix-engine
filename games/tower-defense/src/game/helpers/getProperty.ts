import { Scene } from '@fenix-engine/core/Scene';
import { Unit } from '@fenix-engine/core/Units';

export const getProperty = <T>(
  node: Unit | Scene,
  property: string,
  fallback?: T
): T => {
  const value = node.properties.get(property);

  if (value === undefined) {
    if (fallback === undefined) {
      throw new Error(
        `Property ${property} not found on ${
          'name' in node ? `unit ${node.name}` : 'scene'
        }`
      );
    }

    return fallback;
  }

  return value as T;
};

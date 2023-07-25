import { Vector3 } from '@fenix-engine/core/Math';

type PathFollowerConfig = {
  path: Vector3[];
  speed: number;
};

type ComputedPathNode = {
  position: Vector3;
  distance: number;
};

export class PathFollower {
  private _calculatedPath: ComputedPathNode[];
  private _speed: number;
  private _travalledDistance = 0;

  constructor({ path, speed }: PathFollowerConfig) {
    this._speed = speed;
    this._calculatedPath = computePath(path);
  }

  public setTravelledDistance(distance: number) {
    this._travalledDistance = distance;
  }

  public getNextPosition(
    delta: number,
    currentPosition: Vector3
  ): {
    done: boolean;
    nextNodePos: Vector3;
    position: Vector3;
    travelledDistance: number;
  } {
    // 1. calculate movement distance based on delta and speed and sum it with travelled distance
    const movementDistance = delta * this._speed;
    const nextTravelledDistance = this._travalledDistance + movementDistance;

    // 2. get previous and next nodes based on travelled distance
    const nodes = getClosestNodes(this._calculatedPath, nextTravelledDistance);

    if (nodes === null) {
      return {
        done: true,
        nextNodePos: this._calculatedPath.at(-1)?.position ?? currentPosition,
        position: currentPosition,
        travelledDistance: this._travalledDistance,
      };
    }

    const { previous, next } = nodes;

    // 3. get lerp factor based on movement distance and distance to next node
    const stageTravelledDist =
      previous.distance === 0
        ? nextTravelledDistance
        : nextTravelledDistance % previous.distance;
    const lerpFactor = stageTravelledDist / (next.distance - previous.distance);

    // 4. lerp between previous node and next node positions using lerp factor
    const position = Vector3.lerp(previous.position, next.position, lerpFactor);

    return {
      position,
      done: false,
      nextNodePos: next.position,
      travelledDistance: nextTravelledDistance,
    };
  }
}

const getClosestNodes = (
  nodes: ComputedPathNode[],
  travelledDistance: number
): {
  previous: ComputedPathNode;
  next: ComputedPathNode;
} | null => {
  for (let i = 1; i < nodes.length; i++) {
    const previousNode = nodes[i - 1];
    const nextNode = nodes[i];

    // console.log(travelledDistance, previousNode.distance, nextNode.distance);

    if (
      travelledDistance >= previousNode.distance &&
      travelledDistance < nextNode.distance
    ) {
      return {
        previous: previousNode,
        next: nextNode,
      };
    }
  }

  return null;
};

const computePath = (path: Vector3[]): ComputedPathNode[] => {
  const computedPath: ComputedPathNode[] = [
    {
      position: path[0],
      distance: 0,
    },
  ];
  let accumulatedDistance = 0;

  for (let i = 1; i < path.length; i++) {
    const previousNode = path[i - 1];
    const nextNode = path[i];

    const distance = Vector3.distance(previousNode, nextNode);
    accumulatedDistance += distance;

    computedPath.push({
      position: nextNode,
      distance: accumulatedDistance,
    });
  }

  return computedPath;
};

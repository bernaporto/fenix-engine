import {
  Object3D,
  OrthographicCamera,
  Raycaster,
  Vector3 as THREE_Vector3,
  Vector2 as THREE_Vector2,
} from 'three';
import { Constants } from '@fenix-engine/shared/constants';
import { degreesToRadians, remap } from '@fenix-engine/shared/utils';
import { Unit } from './Unit';
import { Vector2, Vector3 } from '../Math';

const raycaster = new Raycaster();

export class Camera extends Unit {
  private _joint = new Object3D();
  private _camera: OrthographicCamera;

  constructor() {
    super({ name: 'Camera' });

    this._camera = new OrthographicCamera();
    this._joint.add(this._camera);
    this._joint.name = 'camera_joint';
    this.node.add(this._joint);
    this.node.name = 'camera_pivot';
  }

  public get camera() {
    return this._camera;
  }

  public setAngle(angle: Vector2) {
    this._joint.rotation.set(0, 0, 0);
    this._joint.rotateOnAxis(
      new THREE_Vector3(1, 0, 0),
      degreesToRadians(angle.x)
    );
    this.node.rotation.set(0, 0, 0);
    this.node.rotateOnWorldAxis(
      new THREE_Vector3(0, 1, 0),
      degreesToRadians(angle.y)
    );
    this.node.updateWorldMatrix(false, true);
  }

  public setDistance(distance: number) {
    if (this._camera.position.z === distance) return;

    this._camera.position.set(0, 0, distance);
    this.node.updateWorldMatrix(false, true);
  }

  public setPosition({ x, y, z }: Vector3) {
    this.node.position.set(x, y, z);
    this.node.updateWorldMatrix(false, true);
  }

  public setLocalPosition({ x, y, z }: Vector3) {
    const localPos = this.node.worldToLocal(new THREE_Vector3(x, y, z));
    this.setPosition(localPos);
  }

  public setZoom(zoom: number) {
    if (this._camera.zoom === zoom) return;

    this._camera.zoom = zoom;
    this._camera.updateProjectionMatrix();
  }

  public resize(aspect: number, viewSize = Constants.VIEW_SIZE) {
    this._camera.left = (-aspect * viewSize) / 2;
    this._camera.right = (aspect * viewSize) / 2;
    this._camera.top = viewSize / 2;
    this._camera.bottom = -viewSize / 2;
    this._camera.updateProjectionMatrix();
  }

  public raycast(normalizedMousePos: Vector2, root: Unit): Vector3[] {
    raycaster.setFromCamera(
      new THREE_Vector2(normalizedMousePos.x, normalizedMousePos.y),
      this._camera
    );

    return raycaster.intersectObjects([root.node], true).map(({ point }) => ({
      x: point.x,
      y: point.y,
      z: point.z,
    }));
  }

  public worldToScreen(worldPos: Vector3, canvas: HTMLCanvasElement): Vector2 {
    const { width, height } = canvas;

    const position = new THREE_Vector3(worldPos.x, worldPos.y, worldPos.z);
    position.project(this._camera);

    return {
      x: remap(position.x, -1, 1, 0, width),
      y: height - remap(position.y, -1, 1, 0, height),
    };
  }
}

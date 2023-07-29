import {
  Object3D,
  OrthographicCamera,
  Raycaster,
  Vector3 as THREE_Vector3,
  Vector2 as THREE_Vector2,
  PerspectiveCamera,
} from 'three';
import { degreesToRadians, remap } from '@fenix-engine/utilities/misc';
import type { CameraConfig } from '../@types';
import { Vector2, type Vector3 } from '../Math';
import { Unit } from './Unit';
import { resizeCamera } from './utils';

const raycaster = new Raycaster();

export class Camera extends Unit {
  private _angle: Vector2;
  private _camera: OrthographicCamera | PerspectiveCamera;
  private _joint: Object3D;

  constructor(config?: CameraConfig) {
    super(config);

    const { angle, cameraType, distance, fov, zoom }: CameraConfig = {
      angle: Vector2.zero,
      cameraType: 'orthographic',
      distance: 0,
      fov: 60,
      zoom: 1,
      type: 'camera',
      ...config,
    };

    this._angle = angle;

    const { camera, joint } = createCamera(cameraType);
    this._camera = camera;
    this._joint = joint;
    this.node.add(joint);

    this.setFov(fov);
    this.setAngle(angle);
    this.setDistance(distance);
    this.setZoom(zoom);
  }

  public get angle() {
    return this._angle;
  }

  public get camera() {
    return this._camera;
  }

  public get distance() {
    return this._camera.position.z;
  }

  public get zoom() {
    return this.camera.zoom;
  }

  public setAngle(angle: Vector2) {
    this._angle = angle;
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

  public setFov(value: number) {
    if (this._camera instanceof OrthographicCamera) return;

    this._camera.fov = value;
    this._camera.updateProjectionMatrix();
  }

  public setZoom(zoom: number) {
    if (this._camera.zoom === zoom) return;

    this._camera.zoom = zoom;
    this._camera.updateProjectionMatrix();
  }

  public resize(aspect: number) {
    resizeCamera(this._camera, aspect);
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

/* UTILS */
const createCamera = (
  cameraType: 'orthographic' | 'perspective'
): {
  camera: OrthographicCamera | PerspectiveCamera;
  joint: Object3D;
} => {
  const joint = new Object3D();
  const camera =
    cameraType === 'orthographic'
      ? new OrthographicCamera()
      : new PerspectiveCamera();

  joint.add(camera);
  joint.name = 'camera_joint';

  return { camera, joint };
};

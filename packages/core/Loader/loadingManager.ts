import { FileLoader, LoadingManager } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

export const loadingManager = new LoadingManager();

/* JSON files */
const jsonLoader = new FileLoader(loadingManager);
loadingManager.addHandler(
  /\.(json|html|manifest|prefab|scene|xml)$/i,
  jsonLoader
);

/* 3D Models */
const objLoader = new OBJLoader(loadingManager);
loadingManager.addHandler(/\.obj$/i, objLoader);

const gltfLoader = new GLTFLoader(loadingManager);
loadingManager.addHandler(/\.(glb|gltf)$/i, gltfLoader);

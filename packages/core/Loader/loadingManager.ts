import { FileLoader, LoadingManager } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

export const loadingManager = new LoadingManager();

/* JSON files */
const jsonLoader = new FileLoader(loadingManager);
loadingManager.addHandler(/\.(json|xml|manifest|prefab|scene)$/i, jsonLoader);

/* 3D Models */
const objLoader = new OBJLoader(loadingManager);
loadingManager.addHandler(/\.obj$/i, objLoader);

const gltfLoader = new GLTFLoader(loadingManager);
loadingManager.addHandler(/\.(glb|gltf)$/i, gltfLoader);

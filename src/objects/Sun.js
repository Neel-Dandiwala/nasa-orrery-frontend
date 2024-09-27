// Sun.js
import * as THREE from 'three';

export default class Sun {
  constructor() {
    this.sphere = new THREE.Mesh(
      new THREE.SphereGeometry(10, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0xff0000 })
    );
  }

  addToScene(scene) {
    scene.add(this.sphere);
  }
}

// Star.js
import * as THREE from 'three';

export default class Star {
  static DISTANCE_TO_KUIPER_BELT = 7479893535; 
  static LIGHT_COLOR = 0xffffff;
  static LIGHT_INTENSITY = 1;
  static LIGHT_DECAY_RATE = 0.6;

  constructor(data) {
    this._diameter = data.diameter || 0; 
    this._threeRadius = this.createThreeRadius(); 
    this.sphere = this.createGeometry(); 
  }

  createThreeRadius() {
    return this._diameter * 2 / 2; 
  }

  createGeometry() {
    
    const geometry = new THREE.SphereGeometry(this._threeRadius, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(geometry, material); 

    
    const lightDistanceStrength = Star.DISTANCE_TO_KUIPER_BELT * 2;
    const sunLight = new THREE.PointLight(Star.LIGHT_COLOR, Star.LIGHT_INTENSITY, lightDistanceStrength, Star.LIGHT_DECAY_RATE);
    mesh.rotation.x = Math.PI / 2; 
    mesh.add(sunLight); 

    return mesh;
  }

  addToScene(scene) {
    scene.add(this.sphere);
  }
}

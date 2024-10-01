
import { fragmentShader as surfaceFragmentShader, vertexShader as surfaceVertexShader } from '../shaders/earth/Surface';
import * as THREE from 'three';

export default class Earth {
  static DISTANCE_TO_KUIPER_BELT = 7479893535; 
  static LIGHT_COLOR = 0xffffff;
  static LIGHT_INTENSITY = 1;
  static LIGHT_DECAY_RATE = 0.6;

  constructor(data) {
    this._diameter = data.diameter || 0; 
    this._threeRadius = this.createThreeRadius(); 
    this.textureLoader = new THREE.TextureLoader();
    this.mapTexture = this.textureLoader.load('/textures/earth/earth_atmos_2048.jpg');
    this.normalMapTexture = this.textureLoader.load('/textures/earth/earth_normal_2048.jpg');
    this.specularMapTexture = this.textureLoader.load('/textures/earth/earth_specular_2048.jpg');
    this.lightTexture = this.textureLoader.load('/textures/earth/earth_lights_2048.png');
    this.cloudTexture = this.textureLoader.load('/textures/earth/earth_clouds_2048.png');
    this.sphere = this.createGeometry(); 
    this.cloudSphere = this.createCloudGeometry();
  }

  createThreeRadius() {
    return this._diameter * 10 / 2; 
  }

  createGeometry() {
    const geometry = new THREE.SphereBufferGeometry(0.2, 50, 50);
    geometry.computeTangents();
    // const material = new THREE.MeshPhongMaterial({ 
    //   map: this.mapTexture,
    //   normalMap: this.normalMapTexture,
    //   specularMap: this.specularMapTexture,
    //   color: 0xffffff
    // });
    // material.map.encoding = THREE.sRGBEncoding;
    // material.specularMap.encoding = THREE.sRGBEncoding;
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        uDayTexture: { value: this.mapTexture },
        uNightTexture: { value: this.lightTexture },
        uNormalMapTexture: { value: this.normalMapTexture },
        uSpecularMapTexture: { value: this.specularMapTexture },
        uCloudTexture: { value: this.cloudTexture },
        sunPosition: { value: new THREE.Vector3(5, 0, 0) },
        uNormalPower: { value: 0.3 },
        uPosition: { value: new THREE.Vector3(0,0,0)},
      },
      vertexShader: surfaceVertexShader,
      fragmentShader: surfaceFragmentShader,
    });

    const mesh = new THREE.Mesh(geometry, material); 
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    
    const lightDistanceStrength = Earth.DISTANCE_TO_KUIPER_BELT * 2;
    const sunLight = new THREE.PointLight(Earth.LIGHT_COLOR, Earth.LIGHT_INTENSITY, lightDistanceStrength, Earth.LIGHT_DECAY_RATE);
    // mesh.rotation.x = Math.PI / 2; 
    mesh.position.set(0, 0, 0);
    // mesh.add(sunLight); 

    return mesh;
  }

  createCloudGeometry() {
    const geometry = new THREE.SphereBufferGeometry(0.203, 50, 50);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        cloudTexture: { value: this.cloudTexture }
      },
      // vertexShader: vertexShader,
      // fragmentShader: fragmentShader,
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material); 
    mesh.position.set(0, 0, 0);

    return mesh;
  }

  addToScene(scene) {
    scene.add(this.sphere);
    // scene.add(this.cloudSphere);
  }
}

import * as THREE from 'three';
import { vertexShader as sunVertexShader, fragmentShader as sunFragmentShader } from '../shaders/SunShader';
import { vertexShader as sunshineVertexShader, fragmentShader as sunshineFragmentShader } from '../shaders/SunshineShader';
import { vertexShader as parentVertexShader, fragmentShader as parentFragmentShader } from '../shaders/Parent';

export default class Sun {
  static DISTANCE_TO_KUIPER_BELT = 7479893535; 
  static LIGHT_COLOR = 0xffffff;
  static LIGHT_INTENSITY = 1;
  static LIGHT_DECAY_RATE = 0.6;

  constructor(data) {
    this._diameter = data.diameter || 0; 
    this._threeRadius = this.createThreeRadius(); 
    this.textureLoader = new THREE.TextureLoader();
    this.texture = this.textureLoader.load('/textures/sun_surface.jpg');
    this.sphere = this.createGeometry(); 
    this.innerSphere = this.createInnerGeometry();
    this.OuterSphere = this.createOuterGeometry();
  }

  createThreeRadius() {
    return this._diameter * 10 / 2; 
  }

  createGeometry() {
    
    const geometry = new THREE.SphereBufferGeometry(1.0, 50, 50);
    // const material = new THREE.MeshStandardMaterial({ 
    //   map: this.texture, 
    //   emissive: 0xffaa00, 
    //   emissiveIntensity: 0.7
    // });
    const material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: '#extension GL_OES_standard_derivatives : enable'
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0 },
        uPerlin: { value: null },
        resolution: { value: new THREE.Vector4() },
      },

      vertexShader: sunVertexShader,
      fragmentShader: sunFragmentShader
    })
    const mesh = new THREE.Mesh(geometry, material); 

    
    const lightDistanceStrength = Sun.DISTANCE_TO_KUIPER_BELT * 2;
    const sunLight = new THREE.PointLight(Sun.LIGHT_COLOR, Sun.LIGHT_INTENSITY, lightDistanceStrength, Sun.LIGHT_DECAY_RATE);
    // mesh.rotation.x = Math.PI / 2; 
    // mesh.add(sunLight); 

    return mesh;
  }

  createInnerGeometry() {
    const innerGeometry = new THREE.SphereBufferGeometry(0.95, 50, 50); // Slightly smaller radius
    const innerMaterial = new THREE.ShaderMaterial({
      extensions: {
        derivatives: '#extension GL_OES_standard_derivatives : enable'
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector4() },
      },
      vertexShader: parentVertexShader,
      fragmentShader: parentFragmentShader
    });

    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    

    return innerMesh; // Return the inner sphere mesh
  }

  createOuterGeometry() {
    
    const geometry = new THREE.SphereBufferGeometry(1.25, 50, 50);
    // const material = new THREE.MeshStandardMaterial({ 
    //   map: this.texture, 
    //   emissive: 0xffaa00, 
    //   emissiveIntensity: 0.7
    // });
    const material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: '#extension GL_OES_standard_derivatives : enable'
      },
      side: THREE.BackSide,
      uniforms: {
        time: { value: 0 },
        uPerlin: { value: null },
        resolution: { value: new THREE.Vector4() },
      },
      transparent: true,
      vertexShader: sunshineVertexShader,
      fragmentShader: sunshineFragmentShader
    })
    const mesh = new THREE.Mesh(geometry, material); 

    
    const lightDistanceStrength = Sun.DISTANCE_TO_KUIPER_BELT * 2;
    const sunLight = new THREE.PointLight(Sun.LIGHT_COLOR, Sun.LIGHT_INTENSITY, lightDistanceStrength, Sun.LIGHT_DECAY_RATE);
    // mesh.rotation.x = Math.PI / 2; 
    // mesh.add(sunLight); 

    return mesh;
  }

  addToScene(scene, innerScene) {
    scene.add(this.sphere);
    scene.add(this.OuterSphere);
    innerScene.add(this.innerSphere);
  }
}

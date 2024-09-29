
// https://github.com/theshanergy/solarsystem/tree/master
// https://github.com/sanderblue/solar-system-threejs


<template>
    <div ref="solarSystem" id="solar-system" style="width: 100%; height: 100vh">
    </div>
  </template>
  
  <script setup>
  import * as THREE from 'three'
  import { onMounted, onBeforeUnmount, ref } from 'vue'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
  import Sphere from '../objects/Sphere';
  import Sun from '../objects/Sun';

  const solarSystem = ref(null)
  let scene, camera, orbitControls, renderer, cubeCamera, scene1, cubeRenderTarget
  let time = 0;
  let sun = new Sun({
    diameter: 20,
  });

  const initScene = () => {
    const sceneElement = solarSystem.value
  
    scene = new THREE.Scene()
    
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.05, 5 * Math.pow(10, 13))
    camera.position.set(0, 0, 5)
    camera.lookAt(new THREE.Vector3(0, 0, 0))
  
    orbitControls = new OrbitControls(camera, sceneElement)
  
    cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
      format: THREE.RGBAFormat,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
      encoding: THREE.sRGBEncoding
    });
    scene1 = new THREE.Scene();
    cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget); // Near, far, resolution
    scene1.add(cubeCamera);

    renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    sceneElement.appendChild(renderer.domElement)
  
    setLights()
    setAxis()
    // const sun = new Sun();
    // sun.addToScene(scene);


  sun.addToScene(scene, scene1);

    animate(Sun)
  }
  
  const setLights = () => {
    const ambientLightCount = 4
  }
  
  const setObjectPosition = (object, index) => {
    switch (index) {
      case 0:
        object.position.set(0, 0, 10000)
        break
      case 1:
        object.position.set(0, 0, -10000)
        break
      case 2:
        object.position.set(10000, 0, 0)
        break
      case 3:
        object.position.set(-10000, 0, 0)
        break
    }
  }
  
  const setAxis = () => {
    // scene.rotation.x = 90 * 0.0174532925
  }
  
  const animate = () => {
    requestAnimationFrame(animate)
    cubeCamera.position.copy(sun.sphere.position);
    cubeCamera.update(renderer, scene1)
    sun.sphere.material.uniforms.uPerlin.value = cubeRenderTarget.texture;

    orbitControls.update()
    time += 0.01;

    sun.sphere.material.uniforms.time.value = time;
    
    sun.innerSphere.material.uniforms.time.value = time;
    renderer.render(scene, camera)
  }
  
  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
  
  onMounted(() => {
    initScene()
    window.addEventListener('resize', handleResize)
  })
  
  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    if (renderer && renderer.domElement) {
      solarSystem.value.removeChild(renderer.domElement)
    }
  })
  </script>
  
  <style scoped>
  #solar-system {
    display: block;
    overflow: hidden;
  }
  </style>
  

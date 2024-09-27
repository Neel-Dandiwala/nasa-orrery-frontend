
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
  import Sun from '../objects/Sun';
  import Star from '../objects/Star';

  const solarSystem = ref(null)
  let scene, camera, orbitControls, renderer
  
  const initScene = () => {
    const sceneElement = solarSystem.value
  
    scene = new THREE.Scene()
    
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.05, 5 * Math.pow(10, 13))
    camera.position.set(0, 0, 300)
    camera.lookAt(new THREE.Vector3(0, 0, 0))
  
    orbitControls = new OrbitControls(camera, sceneElement)
  
    renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    sceneElement.appendChild(renderer.domElement)
  
    setLights()
    setAxis()
    const sun = new Sun();
    // sun.addToScene(scene);

  const star = new Star({
    diameter: 20,
  });
  star.addToScene(scene);

    animate()
  }
  
  const setLights = () => {
    const ambientLightCount = 4

    for (let i = 0; i < ambientLightCount; i++) {
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.175)
      setObjectPosition(directionalLight, i)
      scene.add(directionalLight)
    }
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
    scene.rotation.x = 90 * 0.0174532925
  }
  
  const animate = () => {
    requestAnimationFrame(animate)
    orbitControls.update()
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
  

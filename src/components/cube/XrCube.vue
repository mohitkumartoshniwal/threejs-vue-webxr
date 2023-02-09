<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ARButton } from "three/examples/jsm/webxr/ARButton";
import * as THREE from "three";

let scene = new THREE.Scene();
let renderer;
let controls;

let canvasRef = ref();

let boxGeometry = new THREE.BoxGeometry(1, 1, 1);
let boxMaterial = new THREE.MeshStandardMaterial({ color: "mediumpurple" });
let box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(0, 0, -2);

scene.add(box);

let ambientLight = new THREE.AmbientLight("#ffffff", 1);
scene.add(ambientLight);

let camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.y = 1;
camera.position.z = 2;
camera.lookAt(new THREE.Vector3(0, 0, 0));

scene.add(camera);

// let loop = () => {
//   box.rotation.y += 0.02;
//   renderer.render(scene, camera);
//   requestAnimationFrame(loop);
// };

let loop = () => {
  box.rotation.y += 0.02;

  controls.update();
  renderer.render(scene, camera);
};

let resizeCallback = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};

onMounted(() => {
  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true,
    alpha: true,
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.render(scene, camera);
  renderer.xr.enabled = true;

  renderer.setAnimationLoop(loop);

  document.body.appendChild(ARButton.createButton(renderer));

  controls = new OrbitControls(camera, canvasRef.value);
  controls.enableDamping = true;

  window.addEventListener("resize", resizeCallback);

  //   requestAnimationFrame(loop);
});

onUnmounted(() => {
  renderer.setAnimationLoop(null);
  window.removeEventListener("resize", resizeCallback);
});
</script>

<template>
  <canvas ref="canvasRef"></canvas>
</template>

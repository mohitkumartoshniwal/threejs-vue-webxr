<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { ARButton } from "three/examples/jsm/webxr/ARButton";
import * as THREE from "three";

let scene = new THREE.Scene();
let renderer;
let controls;

let shownModel;
let loadedModel;
let modelName = "Taxi";

let reticle;

let hitTestSource = null;
let hitTestSourceRequested = false;

let canvasRef = ref();

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

reticle = new THREE.Mesh(
  new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
  new THREE.MeshStandardMaterial()
);
reticle.matrixAutoUpdate = false;
reticle.visible = false;

scene.add(reticle);

// let loop = () => {
//   box.rotation.y += 0.02;
//   renderer.render(scene, camera);
//   requestAnimationFrame(loop);
// };

let loop = (timestamp, frame) => {
  if (renderer.xr.isPresenting) {
    shownModel.visible = false;
  }

  if (frame) {
    const referenceSpace = renderer.xr.getReferenceSpace();
    let session = renderer.xr.getSession();

    if (hitTestSourceRequested === false) {
      session.requestReferenceSpace("viewer").then((referenceSpace) => {
        session
          .requestHitTestSource({ space: referenceSpace })
          .then((source) => {
            hitTestSource = source;
          });
      });

      hitTestSourceRequested = true;

      session.addEventListener("end", () => {
        hitTestSourceRequested = false;
        hitTestSource = null;
      });
    }

    if (hitTestSource) {
      const hitTestResults = frame.getHitTestResults(hitTestSource);
      if (hitTestResults.length > 0) {
        const hit = hitTestResults[0];
        reticle.visible = true;
        reticle.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix);
      } else {
        reticle.visible = false;
      }
    }
  }

  scene.children.forEach((object) => {
    if (object.name === modelName) {
      object.rotation.y += 0.01;
    }
  });
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

  document.body.appendChild(
    ARButton.createButton(renderer, {
      requiredFeatures: ["hit-test"],
    })
  );

  controls = new OrbitControls(camera, canvasRef.value);
  controls.enableDamping = true;

  const gltfLoader = new GLTFLoader();
  let dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  gltfLoader.setDRACOLoader(dracoLoader);

  gltfLoader.load(`/models/${modelName}.gltf`, (gltf) => {
    loadedModel = gltf.scene.children[0];

    shownModel = loadedModel.clone();
    shownModel.name = modelName;
    shownModel.scale.set(0.5, 0.5, 0.5);
    scene.add(shownModel);
  });

  window.addEventListener("resize", resizeCallback);

  function onSelect() {
    if (reticle.visible && loadedModel) {
      let model = loadedModel.clone();

      model.name = `XR-${modelName}`;
      model.position.setFromMatrixPosition(reticle.matrix);
      model.scale.set(0.3, 0.3, 0.3);
      scene.add(model);
    }
  }

  let controller = renderer.xr.getController(0);
  controller.addEventListener("select", onSelect);

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

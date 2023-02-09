<script setup>
import XrModelOverlay from "./XrModelOverlay.vue";

let width = 280;
let height = 280;
</script>

<template>
  <div class="gallery-container">
    <div class="gallery">
      <XrModelOverlay :width="width" :height="height" modelName="Ambulance" />
      <XrModelOverlay :width="width" :height="height" modelName="Spaceship" />
      <XrModelOverlay :width="width" :height="height" modelName="Taxi" />
      <XrModelOverlay :width="width" :height="height" modelName="Truck" />
      <!-- <XrModelOverlay :width="width" :height="height" modelName="Van" /> -->
    </div>
  </div>
</template>

<style scoped>
.gallery-container {
  width: 100%;
  height: 100vh;
  overflow: auto;
}

.gallery {
  height: 100%;
  width: 60%;
  display: flex;
  flex-wrap: wrap;
  gap: 3rem;
  padding: 5rem;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
}
</style>

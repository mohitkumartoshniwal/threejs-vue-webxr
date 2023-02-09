import { createRouter, createWebHistory } from 'vue-router'
import Cube from '../components/cube/Cube.vue'
import XrCube from '../components/cube/XrCube.vue'
import XrModel from '../components/hit-test/XrModel.vue'
import XrModelOverlay from '../components/dom-overlay/XrModelOverlay.vue'
import XrGallery from '../components/gallery/XrGallery.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: XrGallery
    },
    {
      path: '/cube',
      name: 'cube',
      component: Cube
    },

    {
      path: '/xr-cube',
      name: 'xr-cube',
      component: XrCube
    },
    {
      path: '/xr-model',
      name: 'xr-model',
      component: XrModel
    },
    {
      path: '/xr-model-overlay',
      name: 'xr-model-overlay',
      component: XrModelOverlay
    },
    {
      path: '/xr-gallery',
      name: 'xr-gallery',
      component: XrGallery
    },

  ]
})

export default router

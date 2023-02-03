import { createRouter, createWebHistory } from 'vue-router'
import Cube from '../components/cube/Cube.vue'
import XrCube from '../components/cube/XrCube.vue'
import XrModel from '../components/hit-test/XrModel.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Cube
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


  ]
})

export default router

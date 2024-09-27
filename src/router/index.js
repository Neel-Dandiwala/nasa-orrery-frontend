import { createRouter, createWebHistory } from 'vue-router'
import Space from '../pages/Space.vue'
const routes = [
    // {
    //   path: '/:catchAll(.*)',
    //   name: 'NotFound',
    //   component: NotFound
    // },
    // {
    //   path: '/404/:resource',
    //   name: '404Resource',
    //   component: NotFound,
    //   props: true
    // },
    // {
    //   path: '/network-error',
    //   name: 'NetworkError',
    //   component: NetworkError
    // },
    {
      path: '/',
      name: 'Space',
      component: Space
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_BASE_URL),
    routes
  })
//   router.beforeEach(() => {
//     NProgress.start()
//   })
  
//   router.afterEach(() => {
//     NProgress.done()
//   })
  
  export default router
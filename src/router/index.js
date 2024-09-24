import { createRouter, createWebHistory } from 'vue-router'
import HelloWorld from '../components/HelloWorld.vue'
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
      name: 'HelloWorld',
      component: HelloWorld
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
  })
//   router.beforeEach(() => {
//     NProgress.start()
//   })
  
//   router.afterEach(() => {
//     NProgress.done()
//   })
  
  export default router
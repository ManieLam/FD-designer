import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Designer',
    component: () => import(/* webpackChunkName: "designer" */ '@/views/App/Designer.vue')
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // },
  {
    path: '/online/:name/:id',
    name: 'Online',
    meta: { title: '在线预览' },
    // component: { render: (e) => e('router-view') }
    component: () => import(/* webpackChunkName: "online" */ '@/views/App/PreviewOnline.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router

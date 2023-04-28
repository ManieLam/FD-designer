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
  {
    path: '/edit/:name/:id',
    name: 'DesignerEdit',
    component: () => import(/* webpackChunkName: "designer" */ '@/views/App/Designer.vue')
    // redirect: {
    //   name: 'Designer',
    //   params: {
    //     name: 'redirect',
    //     id: 'redirect'
    //   }
    // }
  },
  {
    path: '/online/:name/:id',
    name: 'Online',
    meta: { title: '在线预览' },
    // component: { render: (e) => e('router-view') }
    component: () => import(/* webpackChunkName: "online" */ '@/views/App/PreviewOnline.vue')
  },
  {
    path: '/testPostmessage',
    name: 'TestPostmessage',
    component: () => import(/* webpackChunkName: "test" */ '@/views/Test/TestPostmessage.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router

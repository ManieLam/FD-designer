import Vue from 'vue'
import App from '@/views/App/index.vue'
import router from './router'
import store from './store'
// import './plugins/element.js'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/index.sass'

import Widgets from '@/utils/widgets'

Vue.config.productionTip = false

Vue.use(Element, {
  size: 'small'
})
Vue.prototype.$Widget = Widgets

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

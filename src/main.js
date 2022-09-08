import Vue from 'vue'
import App from '@/views/App/index.vue'
import router from './router'
import store from './store'
// import './plugins/element.js'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/index.sass'
import 'anso-ui/assets/customTheme/index.sass'
import 'anso-ui/lib/anso-ui.css'

import Widgets from '@/utils/widgets'
import defaultValueSet from '@/utils/defaultConfig'
import AnsoUI from 'anso-ui'

Vue.config.productionTip = false

Vue.use(Element, {
  size: 'small'
})
Vue.use(AnsoUI)
Vue.prototype.$Widget = Widgets
Vue.prototype.$defValue = defaultValueSet

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

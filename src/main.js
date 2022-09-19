import Vue from 'vue'
import App from '@/views/App/index.vue'
import router from './router'
import store from './store'
// import './plugins/element.js'
import Element from 'element-ui'
import register from '@/components/AttrSettingForm/register'

import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/index.sass'
import 'anso-ui/assets/customTheme/index.sass'
import 'anso-ui/lib/anso-ui.css'

import Widgets from '@/utils/widgets'
import defaultValueSet from '@/utils/defaultConfig'
import gbImport from '@/utils/import'
import AnsoUI from 'anso-ui'
import CodeEditorConstruct from '@/components/CodeEditor/CodeEditorConstruct'

Vue.config.productionTip = false

Vue.use(Element, {
  size: 'small'
})
Vue.use(AnsoUI)

Object.entries(register).map(([name, comp]) => {
  Vue.component(name, comp)
})

Vue.prototype.$Widget = Widgets
Vue.prototype.$defValue = defaultValueSet
Vue.prototype.$gbImport = gbImport
Vue.use(CodeEditorConstruct)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

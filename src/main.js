import Vue from 'vue'
import App from '@/views/App/index.vue'
import router from './router'
import store from './store'
// import './plugins/element.js'
import Element from 'element-ui'
import register from '@/components/AttrSettingForm/register'
import { registerModules } from '@/components/Translator/index.js'

import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/index.sass'
// import 'anso-ui/assets/elTheme/theme/index.css'
import 'anso-ui/assets/customTheme/index.sass'
import 'anso-ui/lib/anso-ui.css'

import Widgets from '@/model/widgets'
import defaultValueSet from '@/model/defaultConfig'
import gbImport from '@/utils/import'
import require, { normalRequire } from '@/utils/request'
import canvasAPI from '@/Api/canvas'
import AnsoUI from 'anso-ui'
import { resourceConfig, transformRequest } from './utils/ansoConfig'

import CodeEditorConstruct from '@/components/CodeEditor/CodeEditorConstruct'
import SmartDialog from '@/components/SmartDialog.vue'
import SmartDrawer from '@/components/SmartDrawer.vue'

Vue.config.productionTip = false

Vue.use(Element, {
  size: 'small',
  zIndex: 1000
})
Vue.use(AnsoUI, {
  table: {
    resourceConfig: {
      type: Function,
      default: resourceConfig
    },
    transformRequest: {
      type: Function,
      default: transformRequest
    }
  }
})
// console.info(FDTranslator)
// Vue.use(FDTranslator)

// 注册转译模板
registerModules(Vue)

// 动态注册组件到全局使用
Object.entries(register).map(([name, comp]) => {
  Vue.component(name, comp)
})

Vue.use(CodeEditorConstruct) // 注册代码编辑器插件
Vue.component('SmartDialog', SmartDialog)
Vue.component('SmartDrawer', SmartDrawer)

Vue.prototype.$Widget = Widgets
Vue.prototype.$defValue = defaultValueSet
Vue.prototype.$gbImport = gbImport
Vue.prototype.$require = require
Vue.prototype.$normalRequire = normalRequire
Vue.prototype.$api = {
  canvas: canvasAPI
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

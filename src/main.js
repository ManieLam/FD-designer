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
import 'anso-ui/assets/customTheme/index.sass'
import 'anso-ui/lib/anso-ui.css'

import Widgets from '@/utils/widgets'
import defaultValueSet from '@/utils/defaultConfig'
import gbImport from '@/utils/import'
import require from '@/utils/request'
import AnsoUI from 'anso-ui'

import CodeEditorConstruct from '@/components/CodeEditor/CodeEditorConstruct'
import SmartDialog from '@/components/SmartDialog.vue'
import SmartDrawer from '@/components/SmartDrawer.vue'

Vue.config.productionTip = false

Vue.use(Element, {
  size: 'small'
})
Vue.use(AnsoUI)
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

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

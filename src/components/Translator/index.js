/**
 * 解译
 * 导出 --- *.vue 文件? config.json文件? 整套文件（解析器、json、模板文件）
 * 输入 --- config.js文件
 *
 * install -- 搭配main.js中vue.use()
 * */

/**
 * @param opt 传入应用项目的router, store
 * @param canvas 配置的画布
 * 挂载点? document.body.appendChild?
 * 生成后文件存储地方? /public/FDjs
 */
import FormTemp from '@/components/Translator/Template/Form.vue'
/* export default {
  install (Vue, { opt, canvas = [] }) {
    // let constructors = []
    if (canvas.length > 0) {
      console.info('canvas:', canvas)
      const constructors = canvas.map(config => {
        const vmComp = () => import(`./Template/${config?.template}`)
        return {
          comp: Vue.extend({ ...vmComp, router: opt.router || {}, store: opt.store || {} }),
          prosData: config
        }
      })
      const instances = constructors.map(constructor => new constructor.comp({ prosData: constructor.prosData }).$mount())
      console.info('transltor------')
      console.log(instances)
      // return constructors
      instances.forEach(inst => document.body.appendChild(inst.$el))
    } else {
      return
    }
  }
} */
export default async function (Vue, { opt, canvas = [] }) {
  // console.info(canvas)
  // console.info(Vue.extend({ template: '<div>2222</div>' }))
  if (canvas.length > 0) {
    const constructors = canvas.map(config => {
      // ${config?.template}
      // const vmComp = import('./Template/Form.vue')
      return {
        comp: Vue.extend({ ...FormTemp, router: opt.router || {}, store: opt.store || {} }),
        propsData: config
      }
    })
    console.info(constructors)
    // return constructors
    const instances = []
    for await (const constructor of constructors) {
      console.log(constructor.comp)
      if (constructor.comp) {
        const CompFn = constructor.comp
        const vm = await new CompFn({ propsData: { config: constructor.propsData } }).$mount()
        // console.log(vm)
        // console.log(vm.$el)
        if (vm) {
          instances.push(vm)
        }
        // instances.forEach(inst => document.body.appendChild(inst.$el))
      }
    }
    console.log(instances)
    return instances
    // return {}
  } else {
    return []
  }
}

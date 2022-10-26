/**
 * 解译
 * 导出 --- *.vue 文件? config.json文件? 整套文件（解析器、json、模板文件）
 * 输入 --- config.js文件
 *
 * 使用方法一：install -- 搭配main.js中vue.use()
 * 使用方法二：vue.component('xxx')
 * 使用方法三：路由() => import(''), 直接引入使用
 * 使用方法四：Vue.compile( template ) 渲染模板
 * */
export const templateRegister = {
  // Form: () => import('./Template/Form.vue')
  Form: require('./Template/Form.vue').default
}

/* 用于异步调用某个js组件 */
export function loadScript (url) {
  return new Promise((resolve, reject) => {
    var script = document.createElement('script')
    script.type = 'text/javascript'
    if (script.readyState) { // IE
      script.onreadystatechange = function () {
        if (script.readyState === 'loaded' || script.readyState === 'complete') {
          script.onreadystatechange = null
          resolve()
        }
      }
    } else { // Others
      script.onload = function () {
        console.log('complete')
        resolve()
      }
      script.onerror = function (e) {
        reject(e)
      }
    }
    script.src = url
    document.getElementsByTagName('body')[0].appendChild(script)
  })
}

/* 注册模板文件 */
export function registerModules (Vue, propsData = {}) {
  const components = Object.values(templateRegister)
  // 将业务线异步组件存到全局
  components.forEach(comp => {
    if (comp.name) {
      // const mergeComp = Object.assign(comp, { propsData: propsData })
      // const MergeComp = Vue.extend(Object.assign(comp, { propsData }))
      // console.info(MergeComp)
      Vue.component(comp.name, Vue.extend(comp))
      // Vue.component(comp.name, (resolve, reject) => {
      //   // resolve(new MergeComp({ propsData }))
      //   resolve(MergeComp)
      // })
    }
  })
  console.info('注册')
}

/* 获取vueComponent组件 */
export function getVueComp (Vue, { opt, canvas = [] }) {
  if (canvas.length > 0) {
    console.info('canvas:', canvas)
    return canvas.reduce((r, config) => {
      const target = templateRegister[config.template]
      const VComp = Vue.extend({ ...target, router: opt.router || {}, store: opt.store || {} })
      const compName = config.name || `${config.template}_${Math.floor(Math.random() * 100)}`
      return Object.assign(r, {
        [compName]: (resolve, reject) => {
          const instance = new VComp({ propsData: config })
          resolve(instance)
        }
      })
    }, {})
  } else {
    return {}
  }
}

/* 利用@vue/component-compiler-utils ，VueLoaderPlugin, 将template\script\style 代码块切分 */
export function transToESM () {
  // TODO 调用rollup -c 命令行，生成js
  // TODO 获取打包后的整个public/exportParse
  // TODO 需要调用服务打包成zip，或者多个文件下载.....
}

/**
 * @param opt 传入应用项目的router, store
 * @param canvas 配置的画布
 * 挂载点? document.body.appendChild?
 * 生成后文件存储地方? /public/FDjs
 */
// import FormTemp from '@/components/Translator/Template/Form.vue'
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
/*  Vue.component('FormComponent', new TargetVC({ propsData: { config: vc.propsData } })) */
/* export default async function (Vue, { opt, canvas = [] }) {
  // console.info(canvas)
  // console.info(Vue.extend({ template: '<div>2222</div>' }))
  if (canvas.length > 0) {
    const constructors = canvas.map(config => {
      // ${config?.template}
      // const vmComp = import('./Template/Form.vue')
      // const target = (templateRegister[config.template])()
      const target = templateRegister[config.template]
      // console.log('target---')
      console.info(target)
      return {
        template: `./Template/${config.template}`,
        vComponent: templateRegister[config.template],
        // plugin: install(Vue, opt) {}
        constructor: Vue.extend({ ...target, router: opt.router || {}, store: opt.store || {} }),
        // comp: templateRegister[config.template],
        propsData: config
      }
    })
    // console.info(constructors)
    return constructors
    // const instances = []
    // for await (const constructor of constructors) {
    //   // console.log(constructor.comp)
    //   if (constructor.comp) {
    //     const CompFn = constructor.comp
    //     const vm = await new CompFn({ propsData: { config: constructor.propsData } })
    //     // console.log(vm)
    //     // console.log(vm.$el)
    //     if (vm) {
    //       instances.push(vm)
    //     }
    //     // instances.forEach(inst => document.body.appendChild(inst.$el))
    //   }
    // }
    // console.log(instances)
    // return instances
    // return {}
  } else {
    return []
  }
} */

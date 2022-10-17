/**
 * 解译
 * 导出 --- *.vue 文件
 * 输入 --- config.js文件
 * */
export default {
  install (Vue, { opt, canvas = [] }) {
    let constructor = []
    if (canvas.length) {
      constructor = canvas.map(config => Vue.extend({ ...config, router: opt.router, store: opt.store }))
    }
    return constructor
  }
}

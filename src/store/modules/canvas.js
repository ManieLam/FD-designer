/** 记录画布, 同步记录在localstorage
 * 画布数据结构查看 CanvasModel
 * */
import { formAttrs as defaultFormAttrs } from '@/model/defaultConfig'
import { CanvasModel } from '@/model/canvas' // 定义画布数据
// import { isEqual, omit } from 'lodash'

const state = () => ({
  canvas: {}, // { canvas_0: <{page: [], title: ''}:pageModel> }
  editingName: '' // 正在编辑的画布名称
  // count: 1
})

const mutations = {
  /* 切换画布 */
  toggle (states, name) {},
  /* 新增画布 */
  add (states, { name, routerName, data }) {
    if (routerName) {
      // 追加本地化，如：预览切换编辑
      const localCanvas = localStorage.getItem('Canvas-all')
      const allCanvas = localCanvas ? JSON.parse(localStorage.getItem('Canvas-all')) : {}
      const existIndex = Object.entries(allCanvas).findIndex(([cKey, cObj]) => {
        return cKey === routerName || cObj.routerName === routerName
      })
      // console.log('eee:', existItem, existItemName)
      if (existIndex > -1) {
        // console.log('编辑已存在的页面')
        // 本地存在该页面编辑
        const existItemName = Object.keys(allCanvas)[existIndex]
        // console.log('existItemName:', existItemName)
        states.canvas[existItemName] = data
        states.editingName = existItemName
      } else {
        // console.log('本地追加')
        // 本地追加
        states.editingName = routerName
        states.canvas[routerName] = new CanvasModel(data, defaultFormAttrs)
        // localStorage.setItem('Canvas-all', JSON.stringify(states.canvas))
        // sessionStorage.setItem('Canvas-editing', routerName)
      }
    } else {
      // 初始新增
      states.canvas[name] = new CanvasModel({ body: [] }, defaultFormAttrs)
    }
  },
  /* 画布中新增组件 */
  addWidget (states, { name, element, eIndex = 0 }) {
    // console.info('画布vuex新增:', name, element)
    const elements = states.canvas[name]?.body
    if (elements) {
      elements.splice(eIndex, 0, element)
    } else {
      states.canvas[name] = new CanvasModel({ body: element ? [element] : [] }, defaultFormAttrs)
    }
    states.editingName = name
  },
  /* 删除 */
  deleteWidget (states, { name, eIndex }) {
    const elements = states.canvas[name]?.body
    if (elements) {
      elements.splice(eIndex, 1)
    }
  },
  /* 清空, 不是清除 */
  clear (states, name) {
    // console.log('清空')
    const { configId, routerName } = states.canvas[name]
    // 如果存在routerName和configId则保留，这是是否已发布的标志
    states.canvas[name] = new CanvasModel({ configId, routerName }, defaultFormAttrs)
  },
  /* 更新 */
  updateHoldWidget (states, { name, element = {}, eIndex, elements }) {
    states.canvas[name].body = elements
  },
  updateTheWidget (states, { name, eindex = null, attrs = null }) {
    const section = states.canvas[name]
    if (section && eindex !== null && attrs) {
      section.body[eindex] = attrs
    }
  },
  /** 更新单画布事件 */
  updateActions (states, { name, actions = null, type = 'REWRITE', actionName = '', actionVal }) {
    const canvas = states.canvas[name]
    if (canvas && canvas.actions?.length) {
      if (type === 'REWRITE') {
        canvas.actions = actions
      } else if (type === 'PUSH') {
        canvas.actions[actionName] = actionVal
      }
    } else {
      console.warn('画布中暂无表单')
    }
  },
  // 更新单画布属性
  assignConfig (states, config) {
    const { name, attrs = null, actions = null, buttons = null, assignObj = null } = config
    const section = states.canvas[name]
    if (section) {
      if (attrs) states.canvas[name].attrs = { ...attrs, ...(attrs || {}) }
      if (actions) states.canvas[name].actions = { ...actions, ...(actions || {}) }
      // console.log('按钮们:', buttons.sort((a, b) => a?.sort - b?.sort))
      if (buttons) {
        states.canvas[name].buttons = [] // 防止getter.
        states.canvas[name].buttons = buttons
      }
      // if (buttons) states.canvas[name].buttons = buttons.sort((a, b) => a?.sort - b?.sort)
      // console.info('保存：', assignObj)
      if (assignObj) states.canvas[name] = Object.assign(states.canvas[name], assignObj)
    }
  },
  /* 记录画布异步请求资源 */
  updateCanvasResource () {
  },
  /* 导出、全部导出 */
  export (states, name, isAll = false) {}
}

const actions = {
  /* 初始化 */
  init ({ state, commit }, data = {}) {
    // console.info('初始化:', state)
    const storages = localStorage.getItem('Canvas-all')
    if (data.routerName) {
      // 属于重新需要本地化数据
      // console.info('属于重新需要本地化数据')
      commit('add', { name: state.editingName, ...data })
    } else {
      if (storages) {
        // 存在缓存
        state.canvas = JSON.parse(storages)
        state.editingName = sessionStorage.getItem('Canvas-editing')
      } else {
        state.editingName = sessionStorage.getItem('Canvas-editing') || 'canvas_0'
        commit('add', { name: state.editingName })
      }
    }
    // console.info('初始化:', state.editingName)
  },
  toggleCanvas () {
  }
  // updateFormActions ({ state, commit }, { name, actions = null }) {
  //   const section = state.canvas[name]
  //   if (section && actions) {
  //   }
  // }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

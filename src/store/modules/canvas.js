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
  /* 初始化 */
  init (states) {
    // console.info('初始化:', localStorage.getItem('Canvas-all'))
    const storages = localStorage.getItem('Canvas-all')
    states.canvas = storages ? JSON.parse(storages) : {}
    states.editingName = localStorage.getItem('Canvas-editing') || ''
  },
  /* 切换画布 */
  toggle (states, name) {},
  /* 新增画布 */
  add (states, { name, element = {}, eIndex = 0 }) {
    // console.info('画布vuex新增:', name, element)
    const elements = states.canvas[name]?.body
    if (elements) {
      elements.splice(eIndex, 0, element)
    } else {
      states.canvas[name] = new CanvasModel({ body: [element] }, defaultFormAttrs)
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
  /* 清空 */
  clear (states, name) {
    delete states.canvas[name]
  },
  /* 更新 */
  update (states, { name, element = {}, eIndex, elements }) {
    states.canvas[name].body = elements
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
  updateConfig (states, config) {
    const { name, attrs = null, actions = null, buttons = null } = config
    const section = states.canvas[name]
    if (section) {
      if (attrs) states.canvas[name].attrs = { ...attrs, ...(attrs || {}) }
      if (actions) states.canvas[name].actions = { ...actions, ...(actions || {}) }
      if (buttons) states.canvas[name].buttons = Array.isArray(buttons) ? buttons.sort((a, b) => a?.sort - b?.sort) : [...buttons]
    }
  },
  updateField (states, { name, findex = null, attrs = null, actions = null }) {
    const section = states.canvas[name]
    if (section && findex !== null && (attrs || actions)) {
      section.body[findex] = attrs
    }
  },
  /* 记录画布异步请求资源 */
  updateCanvasResource () {
  },
  /* 导出、全部导出 */
  export (states, name, isAll = false) {}
}

const actions = {
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

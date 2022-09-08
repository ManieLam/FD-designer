/** 记录画布, 同步记录在localstorage
 * 画布包括：字段fields(name,label,form,compTag), 表单form(attrs,actions)
 * */
import { formAttrs } from '@/utils/defaultConfig'
const state = () => ({
  collects: {}, // {name: {fields: []}, form: {attrs, ctions}}
  editingName: '' // 正在编辑的画布名称
  // count: 1
})

const mutations = {
  /* 初始化 */
  init (states) {
    // console.info('初始化:', localStorage.getItem('Canvas-all'))
    const storages = localStorage.getItem('Canvas-all')
    states.collects = storages ? JSON.parse(storages) : {}
    states.editingName = localStorage.getItem('Canvas-editing') || ''
  },
  /* 切换画布 */
  toggle (states, name) {},
  /* 新增画布 */
  add (states, { name, element = {}, eIndex = 0 }) {
    // console.info('画布vuex新增:', name, element)
    const elements = states.collects[name]?.fields
    if (elements) {
      elements.splice(eIndex, 0, element)
    } else {
      states.collects[name] = {
        fields: [element],
        form: {
          attrs: formAttrs || {},
          actions: {}
        }
      }
      // states.collects[name].fields = [element]
    }
  },
  /* 删除 */
  deleteWidget (states, { name, eIndex }) {
    const elements = states.collects[name]?.fields
    if (elements) {
      elements.splice(eIndex, 1)
    }
  },
  /* 清空 */
  clear (states, name) {
    // delete states.collects[name]
    delete states.collects[name].fields
    delete states.collects[name].form
  },
  /* 更新 */
  update (states, { name, element = {}, eIndex, elements }) {
    states.collects[name].fields = elements
  },
  // 更新表单属性
  updateConfig (states, { name, attrs, actions }) {
    const canvas = states.collects[name]
    if (canvas && (attrs || actions)) {
      const form = canvas.form
      states.collects[name].form = {
        attrs: { ...form.attrs, ...(attrs || {}) },
        actions: { ...form.actions, ...(actions || {}) }
      }
    }
  },
  /* 导出、全部导出 */
  export (states, name, isAll = false) {}
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

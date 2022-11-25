/** 记录画布, 同步记录在localstorage
 * 画布包括：字段fields(name,label,form,compTag), 表单form(attrs,actions)
 * */
import { formAttrs as defaultFormAttrs } from '@/utils/defaultConfig'
import { CanvasData } from '@/model/canvas' // 定义画布数据
// import { has } from 'lodash'

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
      states.collects[name] = new CanvasData({ fields: [element] }, defaultFormAttrs)
    }
    states.editingName = name
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
  /** 更新表单事件 */
  updateActions (states, { name, actions = null, type = 'REWRITE', actionName = '', actionVal }) {
    const canvas = states.collects[name]
    if (canvas && canvas.form) {
      if (type === 'REWRITE') {
        canvas.form.actions = actions
      } else if (type === 'PUSH') {
        canvas.form.actions[actionName] = actionVal
      }
    } else {
      console.warn('画布中暂无表单')
    }
  },
  // 更新表单属性
  updateConfig (states, { name, attrs = null, actions = null, buttons = null }) {
    const canvas = states.collects[name]
    if (canvas && (attrs || actions || buttons)) {
      const form = canvas.form
      states.collects[name].form = {
        attrs: { ...form.attrs, ...(attrs || {}) },
        actions: { ...form.actions, ...(actions || {}) },
        buttons: Array.isArray(buttons) ? buttons.sort((a, b) => a?.sort - b?.sort) : [...form.buttons]
      }
    }
  },
  updateField (states, { name, findex = null, attrs = null, actions = null }) {
    const canvas = states.collects[name]
    if (canvas && findex !== null && (attrs || actions)) {
      // const field = canvas.fields[findex]
      // console.info('attrs:', attrs)
      // const { form } = attrs
      // console.info('更新vuex中的字段', name, findex, field, attrs)

      // if (!isEqual(attrs.label, field.label)) canvas.fields[findex].label = attrs.label
      // if (!isEqual(attrs.name, field.name)) canvas.fields[findex].name = attrs.name
      // canvas.fields[findex].form = omit(form, ['label', 'name'])
      canvas.fields[findex] = attrs
    }
  },
  /* 记录画布异步请求资源 */
  // updateCanvasResource (states, attrs) {
  //   let resource = states.collects[states.editingName]?.resources || {}
  //   if (has(attrs, ['url', 'method', 'body', 'header'])) {
  //     resource[]
  //   }
  // },
  /* 导出、全部导出 */
  export (states, name, isAll = false) {}
}

const actions = {
  // updateFormActions ({ state, commit }, { name, actions = null }) {
  //   const canvas = state.collects[name]
  //   if (canvas && actions) {
  //   }
  // }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

/** 记录画布, 同步记录在localstorage
 * 画布数据结构查看 CanvasModel
 * TODO routerName与canvasName的冲突
 * */
import { formAttrs as defaultFormAttrs } from '@/model/defaultConfig'
import { CanvasModel } from '@/model/canvas' // 定义画布数据
import { MessageBox } from 'element-ui'
import { isEmpty, isEqual, pick } from 'lodash'

const state = () => ({
  canvas: {}, // { canvas_0: <{page: [], title: ''}:pageModel> } , 记录在sessionStorage
  editingName: '', // 正在编辑的画布名称, 记录在sessionStorage
  openCount: 1
})

const mutations = {
  /* 切换画布 */
  toggle (states, name) {
    if (name) {
      // console.log('切换到name:', name)
      states.editingName = name
      sessionStorage.setItem('Canvas-editing', name)
    }
  },
  /* 新增画布 */
  add (states, { name }) {
    // 初始新增
    // states.canvas[name] = new CanvasModel({ body: [], routerName: name }, defaultFormAttrs)
    states.canvas = {
      ...states.canvas,
      [name]: new CanvasModel({ body: [], routerName: name }, defaultFormAttrs)
    }
    const editingName = name || 'canvas_0'
    states.editingName = editingName
    sessionStorage.setItem('Canvas-all', JSON.stringify(states.canvas))
    sessionStorage.setItem('Canvas-editing', editingName)
  },
  /* 清空, 不是清除 */
  clear (states, name) {
    // console.log('清空')
    const { configId, routerName } = states.canvas[name]
    // 如果存在routerName和configId则保留，这是是否已发布的标志
    states.canvas[name] = new CanvasModel({ configId, routerName }, defaultFormAttrs)
    sessionStorage.setItem('Canvas-all', JSON.stringify(states.canvas))
  },
  /* 更新画布整体 */
  edit (states, { name, routerName, data = {} }) {
    const configId = data?.configId // 区分是否编辑
    if (!configId) return
    // 追加本地化，如：预览切换编辑
    const localCanvas = sessionStorage.getItem('Canvas-all')
    const allCanvas = localCanvas ? JSON.parse(sessionStorage.getItem('Canvas-all')) : {}
    states.canvas = allCanvas
    const existIndex = Object.entries(allCanvas).findIndex(([cKey, cObj]) => cObj.configId === configId)
    if (existIndex > -1) {
      // console.log('编辑已存在的页面')
      // 本地存在该页面编辑
      const existItemName = Object.keys(allCanvas)[existIndex]
      // 切换到该页面
      states.editingName = existItemName
      // 存在变动字段
      const _oldData = pick(allCanvas[existItemName], ['body', 'attrs', 'actions', 'buttons', 'template', 'resources'])
      const _newData = pick(data, ['body', 'attrs', 'actions', 'buttons', 'template', 'resources'])
      const isChange = !isEqual(_oldData, _newData)
      if (isChange) {
        // console.log('inEqual:', allCanvas[existItemName])
        // console.log('inEqual1:', data)
        // 是采用上次保存的画布，还是使用刷新后重新获取的线上数据为准呢。 --- 场景：多人编辑
        MessageBox.confirm(
          `您当前修改的画布${existItemName}还未发布，是否将线上数据覆盖当前？`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then((confirm) => {
          if (confirm) {
            // 确定覆盖
            states.canvas[existItemName] = data
            sessionStorage.setItem('Canvas-all', JSON.stringify(states.canvas))
            // states.editingName = existItemName
          }
        })
      }
    } else {
      // 本地追加
      // console.log('本地追加:')
      states.editingName = routerName
      states.canvas[routerName] = new CanvasModel(data, defaultFormAttrs)
      sessionStorage.setItem('Canvas-all', JSON.stringify(states.canvas))
      sessionStorage.setItem('Canvas-editing', routerName)
    }
  },
  /* 更新画布所有字段 */
  updateHoldWidget (states, { name, element = {}, eIndex, elements }) {
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
      if (assignObj) {
        // states.canvas[name] = Object.assign(states.canvas[name], assignObj)
        const newName = assignObj.routerName || name
        states.canvas[newName] = { ...states.canvas[name], ...assignObj }
        if (assignObj.routerName !== name) {
          states.canvas[name] = {}
          delete states.canvas[name]
        }
      }
    }
  },
  /* 记录画布异步请求资源 */
  updateCanvasResource () {
  },
  /* 导出、全部导出 */
  export (states, name, isAll = false) {},
  /* 移除缓存中的画布 */
  close (states, index) {
    // if (name) {
    //   const newCanvas = { ...states.canvas }
    //   delete newCanvas[name]
    //   states.canvas = newCanvas
    //   // delete states.canvas[name]
    //   // console.log('states.canvas:', states.canvas)
    //   sessionStorage.setItem('Canvas-all', JSON.stringify(states.canvas))
    //   states.editingName = ''
    //   sessionStorage.setItem('Canvas-editing', '')
    // }
    // 未发布的画布只有name，name可能会重复，id不会重复，但id只存在于已发布的画布
    // console.log('delete index:', index)
    if (index !== -1) {
      const newCanvas = { ...states.canvas }
      const name = Object.values(newCanvas)[index]?.routerName
      delete newCanvas[name]
      states.canvas = newCanvas
      sessionStorage.setItem('Canvas-all', JSON.stringify(states.canvas))
      states.editingName = ''
      sessionStorage.setItem('Canvas-editing', states.editingName)
    }
  },
  /* 复制 /online/testCopy/50 */
  copy (states, { name, copiedData = {} }) {
    if (!copiedData || isEmpty(copiedData)) return
    // console.log('复制对象:', copiedData)
    states.canvas = {
      ...states.canvas,
      [name]: new CanvasModel({ ...copiedData, configId: null, routerName: name, canvasName: name })
    }
    sessionStorage.setItem('Canvas-all', JSON.stringify(states.canvas))
  }
}

const actions = {
  /** 初始化
   * 0 没有任何数据，空页面 = 新建
   * 1 存在本地缓存，空页面 = 渲染第一个缓存
   * 2 带id访问，空页面 = 渲染id（编辑）
   * 3 带id访问，存在该本地缓存 = 渲染id（编辑）
   */
  init ({ state, commit }, data = {}) {
    console.info('初始化:', data)
    const storages = sessionStorage.getItem('Canvas-all') ? JSON.parse(sessionStorage.getItem('Canvas-all')) : null
    const editingName = data.routerName || sessionStorage.getItem('Canvas-editing')
    const isEdit = data?.data?.configId
    const isInStorage = storages ? Object.hasOwn(storages, editingName) : false
    // console.log('storages:', storages)
    // console.log('isInStorage:', isInStorage)
    // console.log('editingName:', editingName)
    if (isEdit) {
      // 属于重新需要本地化数据, 分为有缓存和无缓存处理
      // console.info('属于重新需要本地化数据')
      commit('edit', { name: editingName, ...data })
    } else {
      // 新增
      if ((!storages || isEmpty(storages)) && !isInStorage) {
        // 首次初始化
        // console.log('首次初始化')
        commit('add', { name: editingName || 'canvas_0' })
      } else {
        // 存在缓存
        // console.log('存在缓存')
        state.canvas = storages
        commit('toggle', editingName || Object.keys(storages)[0])
      }
    }
  },
  /* 切换画布 */
  toggleCanvas () {
  },
  /* 移除画布 */
  closeCanvas ({ state, commit, dispatch }, { name, id } = {}) {
    const canvasList = Object.entries(state.canvas) || []
    const index = canvasList.findIndex(([key, canvas]) => id ? canvas.configId === id : canvas.routerName === name)
    // console.log('删除:', name, '删除1', state.editingName)
    // console.log('find index:', index)
    if (name === state.editingName) {
      // 关闭当前页，需要切换到上一个页面
      if (index > 0) {
        commit('close', index)
        const newIndex = index - 1
        // console.log('closeCanvas----', newIndex)
        if (canvasList[newIndex]) {
          // console.log('canvasList[newIndex]:', canvasList[newIndex])
          commit('toggle', canvasList[newIndex].routerName)
        }
        return
      }
    }
    commit('close', index)
    dispatch('init')
    // dispatch('init')
  },
  /* 复制画布 */
  copyCanvas ({ state, commit }, data = {}) {
    if (!data) return
    // console.log('copy:', state.canvas)
    const regex = /_copied_\d+|_copied/
    const filterName = data.routerName.replace(regex, '')
    const nameList = Object.keys(state.canvas).filter(k => k.replace(regex, '') === filterName)
    const len = nameList.length
    const newName = len > 1 ? `${filterName}_copied_${len - 1}` : `${filterName}_copied`
    // console.log('newName:', newName)
    commit('copy', { name: newName, copiedData: data })
    commit('toggle', newName)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

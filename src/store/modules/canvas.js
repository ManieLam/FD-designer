/** 记录画布, 同步记录在localstorage
 * 画布数据结构查看 CanvasModel
 * TODO routerName与canvasName的冲突
 * */
import { formAttrs as defaultFormAttrs } from '@/model/defaultConfig'
import { CanvasModel } from '@/model/canvas' // 定义画布数据
import { gbServer } from '@/utils/import'
import { ServiceModel, EnvRecordModel, getDefaultService } from '@/model/service'
import { MessageBox } from 'element-ui'
import { isEmpty, isEqual, pick } from 'lodash'

const state = () => ({
  canvas: {}, // { canvas_0: <{page: [], title: ''}:pageModel> } , 记录在sessionStorage
  editingName: '', // 正在编辑的画布名称, 记录在sessionStorage
  openCount: 1
})

const mutations = {
  /* 切换画布 */
  TOGGLE (states, name) {
    if (name) {
      // console.log('切换到name:', name)
      states.editingName = name
      sessionStorage.setItem('Canvas-editing', name)
    }
  },
  /* 新增画布 */
  ADD (states, { name }) {
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
  CLEAR (states, name) {
    // console.log('清空')
    const { configId, routerName } = states.canvas[name]
    // 如果存在routerName和configId则保留，这是是否已发布的标志
    states.canvas[name] = new CanvasModel({ configId, routerName }, defaultFormAttrs)
    sessionStorage.setItem('Canvas-all', JSON.stringify(states.canvas))
  },
  /* 更新画布整体 */
  EDIT (states, { name, routerName, data = {} }) {
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
      console.log('本地追加:')
      states.editingName = routerName
      states.canvas[routerName] = new CanvasModel(data, defaultFormAttrs)
      sessionStorage.setItem('Canvas-all', JSON.stringify(states.canvas))
      sessionStorage.setItem('Canvas-editing', routerName)
    }
  },
  /* 更新画布所有字段 updateHoldWidget */
  UPDATE_HOLD_WIDGET (states, { name, element = {}, eIndex, elements }) {
    states.canvas[name].body = elements
  },
  /** 更新单画布事件 updateActions */
  UPDATE_ACTIONS (states, { name, actions = null, type = 'REWRITE', actionName = '', actionVal }) {
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
  // 更新单画布属性 assignConfig
  ASSIGN_CONFIG (states, config) {
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
        if (assignObj.routerName && assignObj.routerName !== name) {
          // 更新名称，对旧画布删除，将更名后的画布修改为新画布
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
  EXPORT (states, name, isAll = false) {},
  /* 移除缓存中的画布 */
  CLOSE (states, index) {
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
  COPY (states, { name, copiedData = {} }) {
    if (!copiedData || isEmpty(copiedData)) return
    // console.log('复制对象:', copiedData)
    states.canvas = {
      ...states.canvas,
      [name]: new CanvasModel({ ...copiedData, configId: null, routerName: name, canvasName: name })
    }
    sessionStorage.setItem('Canvas-all', JSON.stringify(states.canvas))
  },
  /* 初始化画布的服务, 对旧数据没有设置env环境的做补充 */
  INIT_SERVER (states, { name }) {
    const curCanvas = states.canvas[name]
    // console.log('curCanvas:', curCanvas)
    if (curCanvas && !curCanvas.env) {
      const server = { ...gbServer }
      console.log('init-server 1', curCanvas.env)
      curCanvas.env = new EnvRecordModel()
      if (!curCanvas.env.list.length) {
        // 从默认的环境中，每个环境同步共同的服务数据
        curCanvas.env.list = server.map(item => item.urls)
      }
      if (!curCanvas.env.inuse.name) {
        // inuse存当前使用的环境对象
        // curCanvas.env.inuse = server.find(list => list.name === ENV_VAR?.default)
        curCanvas.env.inuse = getDefaultService()
      }
      if (!curCanvas.env.serviceOptions?.length) {
        curCanvas.env.serviceOptions = [new ServiceModel()]
      }
    } else {
      console.log('init server 2')
    }
  },
  /* 更新画布中的服务，每次只更新一种属性 */
  UPDATE_SERVER (states, { name, type = 'env', data }) {
    // const curEnv = states.canvas[name].env
    switch (type) {
      case 'env': {
        // 更新整个环境数据
        if (Array.isArray(data)) {
          console.log('更新env:', data)
          states.canvas[name].env = data
        }
        break
      }
      case 'list': {
        // 更新canvas所有环境列表
        if (Array.isArray(data)) { states.canvas[name].env.list = data }
        break
      }
      case 'insue': {
        // 更新canvas在用环境
        if (Array.isArray(data)) { states.canvas[name].env.inuse = data }
        // if (data instanceof Object) { states.canvas[name].env.inuse = data }
        break
      }
      case 'serviceOptions': {
        // 更新环境选项
        if (Array.isArray(data)) {
          states.canvas[name].env.serviceOptions = data
        }
        break
      }
    }
    sessionStorage.setItem('Canvas-all', JSON.stringify(states.canvas))
  // },
  // SYNC_ENV_URLS (states, { name, urlData }) {
  //   const curEnv = states.canvas[name].env
  //   // 同步每个环境中的服务, 只同步类型，不同步url
  //   const newUrlObj = keyBy(urlData, 'name')
  //   const urlKeys = Object.keys(newUrlObj)
  //   // 只对default: true的环境修改
  //   const defEnvs = curEnv.list?.map((env) => {
  //     if (env.default) {
  //       const curKeys = keyBy(env.urls, 'name')
  //       const others = difference(urlKeys, Object.keys(curKeys))?.map(key => new ServiceModel(newUrlObj[key]))
  //       console.log('others:', others)
  //       // urls = urls.concat(others)
  //       return {
  //         ...env,
  //         urls: env.urls.concat(others)
  //       }
  //     }
  //   })
  //   states.canvas[name].env.list = newDef
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
    // console.info('初始化:', data)
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
      commit('EDIT', { name: editingName, ...data })
    } else {
      // 新增
      if ((!storages || isEmpty(storages)) && !isInStorage) {
        // 首次初始化
        // console.log('首次初始化')
        commit('ADD', { name: editingName || 'canvas_0' })
      } else {
        // 存在缓存
        // console.log('存在缓存')
        state.canvas = storages
        commit('TOGGLE', editingName || Object.keys(storages)[0])
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
        commit('CLOSE', index)
        const newIndex = index - 1
        // console.log('closeCanvas----', newIndex)
        if (canvasList[newIndex]) {
          // console.log('canvasList[newIndex]:', canvasList[newIndex])
          commit('TOGGLE', canvasList[newIndex].routerName)
        }
        return
      }
    }
    commit('CLOSE', index)
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
    commit('COPY', { name: newName, copiedData: data })
    commit('TOGGLE', newName)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

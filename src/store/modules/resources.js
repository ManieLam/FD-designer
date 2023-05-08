/** api包含的属性
 * const ResourceController = function (config) {
  return {
    method: 'GET',
    header: null,
    body: null,
    dataHandle: [],
    dataHandleFunc: {
      beforeRequired: {},
      afterRequired: {},
      error: {}
    },
    ...config
  }
} */

import { gbApiRequires } from '@/utils/import' // 假设这个属于公共导入的配置
import { ApiData } from '@/model/resource'
import { groupBy } from 'lodash'

const formatResource = gbApiRequires.map(r => ApiData({ ...r, __isGlobal: true }))

const state = {
  /* 全部全局接口的一维数组，包含业务或默认全局 */
  list: formatResource || [],
  /* 分组情况 */
  groups: {}
}
const mutations = {
  INIT (states) {
    const storages = localStorage.getItem('Resource-all') // 默认读取本地缓存，TODO 补充公共导入的配置
    if (storages) {
      states.list = JSON.parse(storages) || []
    } else {
      states.list = formatResource || []
    }
  },
  ADD_ONE (states, source) {
    // states.list.push(source)
    states.list.splice(0, 0, { ...source, __isGlobal: true })
  },
  REMOVE_ONE (states, dIndex) {
    states.list.splice(dIndex, 1)
  },
  UPDATE_ONE (states, { name, source = {}, index = undefined }) {
    const eIndex = isNaN(index) ? states.list.find(item => item.name === source.name) : index
    if (eIndex !== -1) {
      states.list[eIndex] = source
    }
  },
  SAVE_STORAGE (states) {
    localStorage.setItem('Resource-all', JSON.stringify(states.list))
  },
  /* 格式化分组 */
  INIT_GROUP (states) {
    states.groups = groupBy(states.list, (api) => api.group || 'global')
  },
  ADD_GROUP (states, name) {
    if (!states.groups[name]) {
      states.groups[name] = []
    }
  },
  UPDATE_GROUP (states, name, list) {

  }
}

const actions = {
  updateList ({ commit, state }, sources = []) {
    // console.info('sources:', sources)
    state.list = sources.map(s => { return { ...s, __isGlobal: true } })
    commit('SAVE_STORAGE', sources)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

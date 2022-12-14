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

const formatResource = gbApiRequires.map(r => ApiData(r))

const state = {
  /* 全部全局接口的一维数组，包含业务或默认全局 */
  list: formatResource || [],
  /* 分组情况 */
  groups: {}
}
const mutations = {
  init (states) {
    const storages = localStorage.getItem('Resource-all') // 默认读取本地缓存，TODO 补充公共导入的配置
    if (storages) {
      states.list = JSON.parse(storages) || []
    } else {
      states.list = formatResource || []
    }
  },
  addOne (states, source) {
    // states.list.push(source)
    states.list.splice(0, 0, source)
  },
  removeOne (states, dIndex) {
    states.list.splice(dIndex, 1)
  },
  updateOne (states, { name, source = {}, index = undefined }) {
    const eIndex = isNaN(index) ? states.list.find(item => item.name === source.name) : index
    if (eIndex !== -1) {
      states.list[eIndex] = source
    }
  },
  saveStorage (states) {
    localStorage.setItem('Resource-all', JSON.stringify(states.list))
  },
  /* 格式化分组 */
  initGroup (states) {
    states.groups = groupBy(states.list, (api) => api.group || 'global')
  },
  addGroup (states, name) {
    if (!states.groups[name]) {
      states.groups[name] = []
    }
  },
  updateGroup (states, name, list) {

  }
}

const actions = {
  updateList ({ commit, state }, sources = []) {
    state.list = sources
    commit('saveStorage', sources)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

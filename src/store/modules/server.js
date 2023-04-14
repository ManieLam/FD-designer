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

import { gbServer } from '@/utils/import' // 假设这个属于公共导入的配置
// import { ApiData } from '@/model/resource'
// import { groupBy } from 'lodash'

// const formatResource = gbApiRequires.map(r => ApiData({ ...r, __isGlobal: true }))
const LOCK = ['local', 'test', 'prePublish', 'public']

const state = {
  /* 全部全局接口的一维数组，包含业务或默认全局 */
  list: gbServer || [],
  inuse: ['local', 'BASE'],
  /* 分组情况 */
  groups: {}
}
const mutations = {
  init (states) {
    const storages = localStorage.getItem('Server-all') // 默认读取本地缓存，TODO 补充公共导入的配置
    if (storages) {
      states.list = JSON.parse(storages) || []
    } else {
      states.list = gbServer || []
    }
    states.inuse = localStorage.getItem('Server-inuse') || ['local', 'BASE']
  },
  addOne (states, source) {
    // states.list.push(source)
    states.list.splice(0, 0, { ...source })
  },
  removeOne (states, dIndex) {
    const target = states.list[dIndex]
    const removeAble = target && !LOCK.includes(target.name)
    if (removeAble) states.list.splice(dIndex, 1)
  },
  updateOne (states, { name, source = {}, index = undefined }) {
    const eIndex = isNaN(index) ? states.list.find(item => item.name === source.name) : index
    if (eIndex !== -1) {
      states.list[eIndex] = source
    }
  },
  saveStorage (states) {
    localStorage.setItem('Server-all', JSON.stringify(states.list))
  // },
  // toggleInuse (states, name) {
  //   if (typeof name === 'string') {
  //     states.inuse = name
  //     localStorage.setItem('Server-inuse', name)
  //   }
  }
}

const actions = {
  updateList ({ commit, state }, sources = []) {
    console.info('sources:', sources)
    state.list = sources.map(s => { return { ...s, __isGlobal: true } })
    commit('saveStorage', sources)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

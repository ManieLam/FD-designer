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
import { ServiceModel, EnvModel } from '@/model/service'
// import { ApiData } from '@/model/resource'
import { keyBy, difference } from 'lodash'

// const formatResource = gbApiRequires.map(r => ApiData({ ...r, __isGlobal: true }))
const LOCK = ['local', 'test', 'prePublish', 'public']

const state = {
  /* 全部全局接口的一维数组，包含业务或默认全局 */
  list: gbServer || [],
  inuse: ['local', 'BASE'],
  serviceList: [], // 全局共用的服务
  /* 分组情况 */
  groups: {}
}
const mutations = {
  init (states) {
    // const storages = localStorage.getItem('Server-all') // 默认读取本地缓存，TODO 补充公共导入的配置
    // const inuse = localStorage.getItem('Server-inuse')
    // const serviceList = localStorage.getItem('Server-service')
    // states.list = storages ? JSON.parse(storages) : gbServer || []
    // states.inuse = inuse ? JSON.parse(inuse) : ['local', 'BASE']
    // states.serviceList = serviceList ? JSON.parse(serviceList) : [new ServiceModel({ title: '默认服务', name: 'BASE' })]
  },
  addOne (states, source) {
    // states.list.push(source)
    states.list.splice(0, 0, new EnvModel({ ...source }))
    localStorage.setItem('Server-all', JSON.stringify(states.list))
  },
  removeOne (states, dIndex) {
    const target = states.list[dIndex]
    const removeAble = target && !LOCK.includes(target.name)
    if (removeAble) {
      states.list.splice(dIndex, 1)
      localStorage.setItem('Server-all', JSON.stringify(states.list))
    }
  },
  updateOne (states, { name, source = {}, index = undefined }) {
    const eIndex = isNaN(index) ? states.list.find(item => item.name === source.name) : index
    if (eIndex !== -1) {
      states.list[eIndex] = source
      localStorage.setItem('Server-all', JSON.stringify(states.list))
    }
  },
  saveStorage (states) {
    localStorage.setItem('Server-all', JSON.stringify(states.list))
  },
  saveServices (states) {
    localStorage.setItem('Server-service', JSON.stringify(states.serviceList))
  },
  /* 同步服务地址为传入的列表或缓存中的服务列表 */
  syncServices (states, serviceList) {
    const targetUrls = keyBy(serviceList && serviceList.length ? serviceList : state.serviceList, 'name')
    const urlKeys = Object.keys(targetUrls)
    // console.log('同步服务地址:', urlKeys)
    state.list = state.list
      .filter(item => item.default)
      .map((data) => {
        const { urls } = data
        const curKeys = keyBy(urls, 'name')
        // 补充非交集的服务，地址为空
        const others = difference(urlKeys, Object.keys(curKeys))?.map(key => new ServiceModel({
          ...targetUrls[key],
          url: ''
        }))
        data.urls = [...urls, ...others]
        return data
      })
  },
  toggleInuse (states, name) {
    if (Array.isArray(name)) {
      states.inuse = name
      localStorage.setItem('Server-inuse', JSON.stringify(name))
    }
  }
}

const actions = {
  updateList ({ commit, state }, sources = []) {
    // console.info('sources:', sources)
    state.list = sources.map(s => { return { ...s, __isGlobal: true } })
    commit('saveStorage', sources)
  },
  updateService ({ commit, state }, list = []) {
    state.serviceList = list
    commit('saveServices', list)
    commit('syncServices', list)
  // },
  // addService ({ commit, state }, source) {
  //   commit('addOne', source)
    // commit('saveServices', state.list)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

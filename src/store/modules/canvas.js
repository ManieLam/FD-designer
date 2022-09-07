/* 记录画布, 同步记录在localstorage */
// const {} from 'lodash'
const state = () => ({
  collects: {} // name: [...fieldList]
  // count: 1
})
const mutations = {
  /* 切换画布 */
  toggle (states, name) {},
  /* 新增画布 */
  add (states, { name, element = {}, eIndex = 0 }) {
    // console.info('画布vuex新增:', name, element)
    const canvasList = states.collects[name]
    if (canvasList) {
      canvasList.splice(eIndex, 0, element)
    } else {
      states.collects[name] = [element]
    }
  },
  /* 删除 */
  delete (states, name) {},
  /* 清空 */
  clear (states, name) {
    delete states.collects[name]
  },
  /* 更新 */
  update (states, { name, element = [] }) {},
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

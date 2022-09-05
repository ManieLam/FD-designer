/* 记录画布, 同步记录在localstorage */
const state = () => ({
  canvasCollects: [],
  count: 1
})
const mutations = {
  /* 切换画布 */
  toggle (states, name) {},
  /* 新增画布 */
  add (states, name, elements = []) {},
  /* 删除 */
  delete (states, name) {},
  /* 更新 */
  update (states, name, elements = []) {},
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

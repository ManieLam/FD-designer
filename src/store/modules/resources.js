const state = {
  sourceList: 184
}
const mutations = {
  add (states, source) {
    states.sourceList.push(source)
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

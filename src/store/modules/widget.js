const state = {
  width: 184
}
const mutations = {
  toggleWidth (states, width) {
    states.width = width
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

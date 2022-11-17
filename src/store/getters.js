const getters = {
  /* 获取画布信息 */
  canvasViews: state => state.canvas.collects,
  getCanvasView: (state) => (name) => state.canvas.collects[name] || {},
  canvasCount: state => Object.keys(state.canvas.collects)?.length,
  /* 获取api请求设置 */
  getResources: state => state.resources.list,
  getResourceByName: state => name => {
    const list = state.resources.list
    const index = list.findIndex(item => item.name === name)
    return index > -1 ? list[index] : {}
  },
  getResourceGroup: state => state.resources.groups
  // cachedViews: state => state.tagsView.cachedViews
  // menus: state => state.menus.menuList
  // shortcuts: state => state.shortcuts
}
export default getters

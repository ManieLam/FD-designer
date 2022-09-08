const getters = {
  canvasViews: state => state.canvas.collects,
  getCanvasView: (state) => (name) => state.canvas.collects[name] || {},
  canvasCount: state => Object.keys(state.canvas.collects)?.length
  // cachedViews: state => state.tagsView.cachedViews
  // menus: state => state.menus.menuList
  // shortcuts: state => state.shortcuts
}
export default getters

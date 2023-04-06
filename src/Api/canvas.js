/* 关于画布的接口 */
export default {
  /* 编辑画布 */
  edit: (id) => {
    return `/fileserver/ui/config/edit/${id}`
  },
  /* 新增保存画布/发布 */
  save: '/fileserver/ui/config/save',
  /* 删除画布 */
  delete: (id) => {
    return `/ui/config/delete/${id}`
  },
  /* 获取单个画布详情 */
  getDetail: (id) => {
    return `/fileserver/ui/config/get/${id}`
  },
  /* 获取画布列表，带筛选 */
  getList: '/fileserver/ui/config'
}

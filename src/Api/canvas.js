/* 关于画布的接口 */
export default {
  /* 编辑画布 */
  edit: (id) => {
    return `/customize-ui/ui/config/edit/${id}`
  },
  /* 新增保存画布/发布 */
  save: '/customize-ui/ui/config/save',
  /* 删除画布 */
  delete: (id) => {
    return `/customize-ui/ui/config/delete/${id}`
  },
  /* 获取单个画布详情 */
  getDetail: (id) => {
    return `/customize-ui/ui/config/get/${id}`
  },
  /* 获取画布列表，带筛选 */
  getList: '/customize-ui/ui/config'
}

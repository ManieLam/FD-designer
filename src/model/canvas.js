import { formButtons } from '@/utils/defaultConfig'
export const CanvasData = function ({ fields = [], formAttrs = {}, formActions = {} }, defaultFormAttrs = {}) {
  return {
    name: '',
    label: '',
    fields: fields,
    form: {
      attrs: Object.assign(defaultFormAttrs, formAttrs),
      actions: {
        immediateRemotePrecondition: {}, // 表单首次加载数据源 - 前置条件（TODO）
        immediateRemoteApi: [], // 表单首次加载数据源-接口（支持多个）
        immediateRemoteRule: {}, // 表单首次加载数据源-规则（默认并行）
        getResourceImmediate: false, // 是否立即发起数据请求
        getRelationImmediate: true, // 是否立即加载relation
        ...formActions
      },
      buttons: Object.values(formButtons).sort((a, b) => a?.sort - b?.sort)
    },
    groups: {},
    resources: {},
    template: 'Form'
  }
}

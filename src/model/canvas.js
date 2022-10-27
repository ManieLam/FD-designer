import { formButtons } from '@/utils/defaultConfig'
export const CanvasData = function ({ fields = [], formAttrs = {}, formActions = {} }, defaultFormAttrs = {}) {
  return {
    name: '',
    label: '',
    fields: fields,
    form: {
      attrs: Object.assign(defaultFormAttrs, formAttrs),
      actions: {
        immediateRemoteRequire: {},
        getResourceImmediate: false, // 是否立即发起数据请求
        getRelationImmediate: true, // 是否立即加载relation
        ...formActions
      },
      buttons: Object.values(formButtons).sort((a, b) => a?.sort - b?.sort)
    },
    groups: {},
    template: 'Form'
  }
}

import { formButtons } from '@/model/defaultConfig'
import { MultiApi } from '@/model/resource'
/* 以"xxxApi"命名的格式, 认为是异步动态接口对象, 在运行时会按照内置规则运行请求  */
export const CanvasModel = function ({ body = [], formAttrs = {}, formActions = {}, template = 'Form' }, defaultFormAttrs = {}) {
  return {
    // name: '',
    title: '',
    body: body,
    attrs: Object.assign(defaultFormAttrs, formAttrs),
    actions: {
      immediateRemotePrecondition: {}, // 表单首次加载数据源 - 前置条件（TODO）
      immediateRemoteApi: new MultiApi(), // 表单首次加载数据源-接口（支持多个）
      // immediateRemoteRule: {}, // 表单首次加载数据源-规则（默认并行）
      getResourceImmediate: false, // 是否立即发起数据请求
      getRelationImmediate: true, // 是否立即加载relation
      ...formActions
    },
    buttons: Object.values(formButtons).sort((a, b) => a?.sort - b?.sort),
    groups: {},
    resources: {},
    template
  }
}

export const PageModel = function () {
  return {
    title: '',
    page: [
      new CanvasModel(...arguments)
    ]
  }
}

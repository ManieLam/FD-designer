/* 自定义数据请求方法体 */
export const ApiDataHandles = {
  beforeRequired: {
    name: 'beforeRequired',
    title: '请求发送前',
    params: { params: '表单数据，即提交的数据' },
    placeholder: '\n return params',
    funcDefault: '(params) => { return params }',
    funcInput: '' // 实际在表单执行时，实际运行的方法，记录eval(真实方法)
  },
  afterRequired: {
    name: 'afterRequired',
    title: '请求返回响应数据时',
    params: { res: '响应参数，允许写Promise函数，触发error的catch' },
    placeholder: '\n return res.data',
    funcDefault: '(res) => { return res.data }',
    funcInput: ''
  },
  error: {
    name: 'error',
    title: '异常数据处理',
    params: { err: '异常数据' },
    placeholder: '\n return err',
    funcDefault: '(err) => { return err }',
    funcInput: ''
  }
}

/* 数据源结构 */
export function ApiData (config = {}) {
  return {
    method: 'GET',
    url: '',
    header: null,
    body: null, // query参数
    pathData: null, // path参数
    dataHandle: [],
    isFullDose: false,
    beforeRequired: ApiDataHandles.beforeRequired,
    afterRequired: ApiDataHandles.afterRequired,
    error: ApiDataHandles.error,
    name: config.name || new Date().getTime(), // 关键名称自动生成, 用`地址+方法`的格式，对于参数不同，但名称任意一项不同都认为新的接口
    group: '', // 组名， 默认为空代表全局
    ...config
  }
}

/* 数据参数传参结构 */
export function ApiBodyParams (config) {
  return {
    key: '',
    value: '',
    varType: 'const', // 变量类型, const/formData/router/localstorage
    // usable: true,
    __key: new Date().getTime(), // 用于参数列表记录
    ...config
  }
}

/*  */

export default {
  ApiData,
  ApiBodyParams,
  ApiDataHandles
}

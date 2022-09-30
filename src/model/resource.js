/* 自定义数据请求方法体 */
export const ApiDataHandles = {
  beforeRequired: {
    name: 'beforeRequired',
    title: '请求发送前',
    params: { params: '表单数据，即提交的数据' },
    desc: '\n return params',
    funcDefined: '(params) => { return params }' // 实际在表单执行时，实际运行的方法，记录eval(真实方法)
  },
  afterRequired: {
    name: 'afterRequired',
    title: '请求返回响应数据时',
    params: { res: '响应参数，允许写Promise函数，触发error的catch' },
    desc: '\n return res.data',
    funcDefined: '(res) => { return res.data }'
  },
  error: {
    name: 'error',
    title: '异常数据处理',
    params: { err: '异常数据' },
    desc: '\n return err',
    funcDefined: '(err) => { return err }'
  }
}

/* 数据源结构 */
export function ApiData (config = {}) {
  return {
    method: 'GET',
    url: '',
    header: null,
    body: null,
    dataHandle: [],
    beforeRequired: ApiDataHandles.beforeRequired,
    afterRequired: ApiDataHandles.afterRequired,
    error: ApiDataHandles.error,
    name: config.url ? `${config.url}_${config.method}` : '', // 关键名称自动生成
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

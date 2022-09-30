/* 数据源结构 */
export function ApiData (config = {}) {
  return {
    method: 'GET',
    url: '',
    header: null,
    body: null,
    dataHandle: [],
    dataHandleFunc: {
      beforeRequired: {},
      afterRequired: {},
      error: {}
    },
    name: config.url ? `${config.url}_${config.method}` : '', // 关键名称自动生成
    ...config
  }
}

/* 数据参数传参结构 */
export function ApiBodyParams (config) {
  return {
    key: '',
    value: '',
    varType: 'const', // 变量类型
    // usable: true,
    __key: new Date().getTime(), // 用于参数列表记录
    ...config
  }
}

/*  */

export default {
  ApiData,
  ApiBodyParams
}

/* 公共导入的配置， TODO 做成读出实际导入的 */
// 公共请求链接, 带参数表示固定参数
export const gbApiRequires = [
  // {
  //   name: 'getUser',
  //   method: 'GET',
  //   url: '/api/getUser',
  //   demo: '示例: 获取用水户信息',
  //   body: [
  //     { key: 'waterUserCode', value: '123', varType: 'const', __key: 1111 } // 带$,表示变量，如：$userCode
  //   ]
  // },
  // { name: 'relation', method: 'GET', url: '/api/relation', demo: '公共字典接口' }
  { method: 'GET', url: '/api/getUser', header: null, body: [{ key: 'waterUserCode', value: '123', varType: 'const', __key: 1111 }], dataHandle: [], beforeRequired: { name: 'beforeRequired', title: '请求发送前', params: { params: '表单数据，即提交的数据' }, placeholder: '\n return params', funcDefault: '(params) => { return params }', funcInput: '' }, afterRequired: { name: 'afterRequired', title: '请求返回响应数据时', params: { res: '响应参数，允许写Promise函数，触发error的catch' }, placeholder: '\n return res.data', funcDefault: '(res) => { return res.data }', funcInput: '' }, error: { name: 'error', title: '异常数据处理', params: { err: '异常数据' }, placeholder: '\n return err', funcDefault: '(err) => { return err }', funcInput: '' }, name: '/api/getUser_GET', demo: '示例: 获取用水户信息' },
  { method: 'POST', url: '/api/relation', header: null, body: null, dataHandle: ['beforeRequired'], beforeRequired: { name: 'beforeRequired', title: '请求发送前', params: { params: '表单数据，即提交的数据' }, placeholder: "params.relations=[{name: 'yesOrNo'}]\n return params", funcDefault: '(params) => { return params }', funcInput: "(params) => { params.relations=[{name: 'yesOrNo'}]\n return params }", __isChange: true }, afterRequired: { name: 'afterRequired', title: '请求返回响应数据时', params: { res: '响应参数，允许写Promise函数，触发error的catch' }, placeholder: '\n return res.data', funcDefault: '(res) => { return res.data }', funcInput: '' }, error: { name: 'error', title: '异常数据处理', params: { err: '异常数据' }, placeholder: '\n return err', funcDefault: '(err) => { return err }', funcInput: '' }, name: '/api/relation_POST', demo: '公共字典接口' },
  { method: 'POST', url: '/api/bookCode', header: null, body: null, dataHandle: ['beforeRequired'], beforeRequired: { name: 'beforeRequired', title: '请求发送前', params: { params: '表单数据，即提交的数据' }, placeholder: "params.area = '001'\n return params", funcDefault: '(params) => { return params }', funcInput: "(params) => { params.area = '001'\n return params }", __isChange: true }, afterRequired: { name: 'afterRequired', title: '请求返回响应数据时', params: { res: '响应参数，允许写Promise函数，触发error的catch' }, placeholder: '\n return res.data', funcDefault: '(res) => { return res.data }', funcInput: '' }, error: { name: 'error', title: '异常数据处理', params: { err: '异常数据' }, placeholder: '\n return err', funcDefault: '(err) => { return err }', funcInput: '' }, name: '/api/bookCode_POST', demo: '用于测试异步接口' },
  { method: 'POST', url: '/api/getCodeTree', header: null, body: null, dataHandle: ['beforeRequired'], beforeRequired: { name: 'beforeRequired', title: '请求发送前', params: { params: '表单数据，即提交的数据' }, placeholder: "params.codes= [{name: '001'}]\n return params", funcDefault: '(params) => { return params }', funcInput: "(params) => { params.codes= [{name: '001'}]\n return params }", __isChange: true }, afterRequired: { name: 'afterRequired', title: '请求返回响应数据时', params: { res: '响应参数，允许写Promise函数，触发error的catch' }, placeholder: '\n return res.data', funcDefault: '(res) => { return res.data }', funcInput: '' }, error: { name: 'error', title: '异常数据处理', params: { err: '异常数据' }, placeholder: '\n return err', funcDefault: '(err) => { return err }', funcInput: '' }, name: '/api/getCodeTree_POST', demo: '测试异步接口2' },
  { method: 'POST', url: '/api/addCode', header: null, body: null, dataHandle: ['afterRequired'], beforeRequired: { name: 'beforeRequired', title: '请求发送前', params: { params: '表单数据，即提交的数据' }, placeholder: '\n return params', funcDefault: '(params) => { return params }', funcInput: '' }, afterRequired: { name: 'afterRequired', title: '请求返回响应数据时', params: { res: '响应参数，允许写Promise函数，触发error的catch' }, placeholder: '\n return res', funcDefault: '(res) => { return res.data }', funcInput: '(res) => { \n return res }', __isChange: true }, error: { name: 'error', title: '异常数据处理', params: { err: '异常数据' }, placeholder: '\n return err', funcDefault: '(err) => { return err }', funcInput: '' }, name: '/api/addCode_POST', demo: '测试新增' },
  { method: 'POST', url: '/api/actRelation', demo: '测试动态relation接口', name: '/api/actRelation_POST' }
]

// 公共请求头、请求配置(axios的配置) - TODO
export const gbRequireOptions = {
  header: {}
}

// 公共事件 - TODO
export const gbFunc = {
  // reset: function (form) {},
  // refresh: function () {},
  // message
}

// 公共icon读取 - TODO
export const gbIcons = {}

export default {
  gbApiRequires,
  gbRequireOptions,
  gbFunc,
  gbIcons
}

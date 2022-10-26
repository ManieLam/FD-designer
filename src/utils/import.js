/* 公共导入的配置， TODO 做成读出实际导入的 */
// 公共请求链接, 带参数表示固定参数
export const gbApiRequires = [
  {
    name: 'getUser',
    method: 'GET',
    url: '/api/getUser',
    demo: '示例: 获取用水户信息',
    body: [
      { key: 'waterUserCode', value: '123', varType: 'const', __key: 1111 } // 带$,表示变量，如：$userCode
    ]
  },
  { name: 'relation', method: 'GET', url: '/api/relation', demo: '公共字典接口' }
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

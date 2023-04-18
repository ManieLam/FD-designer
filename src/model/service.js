/* 环境数据模板 */
export const EnvModel = function (config) {
  return {
    name: '',
    label: '',
    urls: [{
      name: 'BASE',
      title: '默认服务',
      url: ''
    }],
    vars: [],
    ...config
  }
}

/* 服务数据模板 */
export const ServiceModel = function (config = {}) {
  return {
    name: 'BASE',
    title: '默认服务',
    url: '',
    ...config
  }
}

// 默认4个环境，不允许删除，除非自定义的环境

export default {
  EnvModel
}

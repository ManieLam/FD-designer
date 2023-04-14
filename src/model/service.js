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

// 默认4个环境，不允许删除，除非自定义的环境

export default {
  EnvModel
}

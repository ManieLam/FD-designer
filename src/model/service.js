export const EnvModel = function (config) {
  return {
    name: '',
    label: '',
    urls: [{
      name: 'BASE_URL',
      title: '默认服务',
      url: ''
    }],
    vars: [],
    ...config
  }
}

// 默认4个环境，不允许删除，除非自定义的环境
export const defaultEnvConf = [
  { name: 'local', label: '本地环境', vars: [], urls: [{ title: '默认服务', url: 'http://0.0.0.0:4523/m1/1812979-0-default', name: 'BASE_URL' }] },
  { name: 'test', label: '测试环境', vars: [], urls: [] },
  { name: 'prePublish', label: '预发布环境', vars: [], urls: [] },
  { name: 'public', label: '正式环境', vars: [], urls: [] }
]

export default {
  EnvModel
}

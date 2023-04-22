import { gbServer } from '@/utils/import'
/* 画布中环境数据 */
export const EnvRecordModel = function (config) {
  return { // 画布服务环境
    inuse: [],
    list: gbServer,
    serviceOptions: [] // 记录画布中的服务选项，每个环境都存在相应的服务，但url不同
  }
}
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
export const ENV_VAR = {
  lock: ['LOCAL', 'TESK', 'PRE_PUBLISH', 'PUBLIC'],
  default: 'LOCAL'
}

export default {
  EnvModel,
  ServiceModel,
  ENV_VAR
}

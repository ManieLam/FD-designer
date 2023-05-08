import { gbServer } from '@/utils/import'
console.log('gbServer:', gbServer)
/* 获取默认服务 */
export function getDefaultService (env) {
  const defEnv = env ? env.name : 'LOCAL'
  const defService = 'BASE'
  const defEnvObj = env || gbServer.find(e => e.name === defEnv)
  const url = defEnvObj?.urls.find(u => u.name === defService).url
  return [defEnv, defService, url]
  // return gbServer.find(e => e.name === defEnv)
}
/* 画布中环境数据 */
export const EnvRecordModel = function (config) {
  return { // 画布服务环境
    inuse: getDefaultService(), // 当前正在使用的环境[ip, service, url]
    list: gbServer, // 画布中可配置的所有列表（可导入）
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

/* 存放需要格式转换的方法 */
import { useEval } from '@/utils/request'
import { presetOptions } from '@/model/defaultConfig'
import { formItemTags } from '@/model/componentAttrs.js'
import { keyBy } from 'lodash'

function getId (prefix = '', suffix = '') {
  return prefix + new Date().getTime() + suffix
}

/** 格式化表单字段验证规则
 *  @param rules 字段规则{isRequired:<Object>, isRegexp:<Array>, isValidator:<String> }
 *  */
export function formatFormRules (rules = {}) {
  return Object.entries(rules).filter(([name, rule]) => !!rule).reduce((list, [name, rule]) => {
    if (rule) {
      if (name === 'isRegexp') list = list.concat(rule.map(item => Object.assign(item, { pattern: new RegExp(item.patternStr) })))
      if (name === 'isRequired') list.push(rule)
      if (name === 'isValidator') {
        list.push({
          validator: function (rules, value, callback) {
            const ruleStr = `(rules, value, callback) => {\n ${rule} \n}`
            useEval(ruleStr, (func) => func(rules, value, callback))
          }
        })
      }
    }
    return list
  }, [])
}

/** 解译单个默认值, presetOptions存在4种选项 */
export const defValOptTree = presetOptions.reduce((r, c) => {
  if (c.options && Array.isArray(c.options)) {
    return Object.assign(r, keyBy(c.options, 'value'))
  }
  return r
}, {})

/** 格式化初始值
 * valueType: 默认值取值类型 - 同名填值/关联数据
 * presetType: 关联数据预设值
 * customFunc: 自定义方法字符串
 *  */
export function formatDefValFunc (value = {}, fields = [], field = {}) {
  const { valueType, presetType, customFunc } = field?.defaultValue || {}
  if (!presetType || valueType === 'isDefault') return value[field?.name]
  if (presetType) {
    const target = defValOptTree[presetType]
    if (presetType === 'customFunc') {
      // 同表单数据自定义
      let res = null
      useEval.call(this, customFunc, (func) => { res = func.call(this, value, fields, field) })
      // console.info('res:', res)
      return res
    } else {
      return target?.valFunc?.call(this, value, fields, field)
    }
  }
}

/** 通过tag格式化字段属性
 * @param tag <string> 录入类型（input/select...）
 */
export function formatField ({ tag, attrConf } = {}) {
  if (!tag) return {}
  const htmlTag = formItemTags[tag]
  // console.log('格式化字段')
  const defAttr = {
    name: getId(`${tag}_`),
    key: getId(`${tag}_`),
    compTag: tag,
    label: '自定义字段',
    tag: htmlTag,
    // options: this.checkEnumerated(htmlTag, config), // 不出默认选项，会不显示组件
    ...(this.$defValue?.[htmlTag] || {}),
    ...(attrConf || {})
  }
  return htmlTag === 'button' ? {
    compTag: tag,
    tag: htmlTag,
    key: getId(`${tag}_`),
    name: getId(`${tag}_`),
    buttonList: [{ ...this.$defValue?.[htmlTag] } || {}],
    ...(attrConf || {})
  } : defAttr
}

/* 获取地址栏地址参数 */
export const getURLQuery = () => {
  const splitList = window.location.href.split('?')
  return splitList.slice(1, splitList.length).reduce((r, item) => {
    const matchs = item.match(/^(\w+)=(\w+)/)
    return matchs?.[1] && matchs?.[2] ? { ...r, [matchs?.[1]]: matchs?.[2] } : r
  }, {})
}

export function getURLAll (key) {
  if (this?.$router) {
    const { query, params } = this.$route
    return params?.[key] || query?.[key] || ''
  } else {
    const queryObj = getURLQuery()
    return queryObj[key]
  }
}

/* 获取某个环境数据 */
function getEnvByName (envName, serviceName, canvas = {}) {
  if (envName) {
    const list = canvas.env?.list || []
    const index = list.findIndex(item => item.name === envName)
    const envObj = index > -1 ? list[index] : {}
    return {
      env: envObj,
      service: serviceName ? envObj.urls.find(url => url.name === serviceName) : {}
    }
  } else {
    return null
  }
}

/** 格式化<>/<>/url为可读url
 * @return <String>
 * @param url <String>
 * @param option <Object> {
 * renderDefaultService: <boolean> 当url属于跟随默认配置，是否需要转出来，如true则转为完整的http的，否则，则是相对地址，需要在服务器配置相应的接口转换
 * }
 * */
export function transUrlReadable (url, { renderDefaultService = false, canvas = null } = {}) {
  if (!url) return ''
  let replaceStr = ''
  if (/^https?:\/\/|http?:\/\//ig.test(url)) return url // 完整的http则不需要走下去
  const serviceBefore = url.match(/<([\w-]+)>/gi)?.map(e => e.replace(/<([\w-]+)>/gi, '$1'))
  if (serviceBefore && serviceBefore.length) {
    // 自定义
    const [ip, service] = serviceBefore
    const { env } = canvas ? getEnvByName(ip, '', canvas) : this.$store.getters.getEnvByName(ip)
    replaceStr = env?.urls?.find(url => url.name === service)?.url
  } else if (renderDefaultService) {
    // 跟随默认
    const inuseNode = canvas ? canvas.env.inuse : this.$store.getters.getServerInuse?.inuseNode
    // const { inuseNode } = this.$store.getters.getServerInuse
    // 当inuseNode为空时，表示这是配置了相对请求地址，默认跟随部署的环境做请求
    const appendUrl = inuseNode?.[2] || ''
    return appendUrl.charAt(appendUrl.length - 1) !== '/' && url.charAt(0) !== '/' ? `${appendUrl}/${url}` : appendUrl + url
  }
  return url.replace(/<([\w-]+)>\/<([\w-]+)>/gi, replaceStr)
}

export default {
  formatFormRules,
  formatDefValFunc
}

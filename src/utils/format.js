/* 存放需要格式转换的方法 */
import { useEval } from '@/utils/request'
import { presetOptions } from '@/utils/defaultConfig'
import { keyBy } from 'lodash'
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

export function formatDefValFunc (value = {}, fields = [], field = {}) {
  const { valueType, presetType, customFunc } = field?.defaultValue || {}
  if (!presetType || valueType === 'isDefault') return value[field?.name]
  if (presetType) {
    const target = defValOptTree[presetType]
    if (presetType === 'customFunc') {
      let res = null
      useEval.call(this, customFunc, (func) => { res = func.call(this, value, fields, field) })
      // console.info('res:', res)
      return res
    } else {
      return target?.valFunc?.call(this, value, fields, field)
    }
  }
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

export default {
  formatFormRules,
  formatDefValFunc
}

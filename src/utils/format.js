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

export default {
  formatFormRules,
  formatDefValFunc
}

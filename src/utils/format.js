/* 存放需要格式转换的方法 */
import { useEval } from '@/utils/request'
/** 格式化表单字段验证规则
 *  @param rules 字段规则{isRequired:<Object>, isRegexp:<Array>, isValidator:<String> }
 *  */
export function formatFormRules (rules = {}) {
  return Object.entries(rules).reduce((list, [name, rule]) => {
    if (rule) {
      if (name === 'isRegexp') list = list.concat(Object.assign(rule, { pattern: new RegExp(rule.pattern) }))
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

/** 解译默认值 */
export function formatDefaultValueFunc () {}

export default {
  formatFormRules,
  formatDefaultValueFunc
}

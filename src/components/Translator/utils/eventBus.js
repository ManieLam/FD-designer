import ruleConfig from '@/components/EventSetter/ruleConfig'
// import { getURLAll, formatDefValFunc } from '@/utils/format.js'
/** 事件通道
 * 对应/components/EventSetter/register.js中的eventName
 * @param rules <Array> 执行规则
 * @param eventName <String> 执行事件名称
 * @param tragetType <String> 执行目标类型: form/field
 * @param traget <Array> 执行目标键名
 * */
export function visabledEvent ({ targetType }) {}

// TODO router, localstorage
export function transParamsValue ({ param, datas, value }) {
  switch (param) {
    case 'fieldValue':
      return value
    case 'collectData':
      return datas
    // case 'router':
    //   // return getURLAll.call(this, value)
    // case 'localstorage':
    //   break
  }
}

export function transThreshold ({ threshold, thresholdVal, datas, value, field }) {
  // const theTransthreshold = ruleConfig.thresholdOptions.find(t => t.value === threshold)
  // 获取即将执行的阀值方法
  // const theFunc = theTransthreshold?.func || null
  // // 阀值执行参数
  // const
  // if (theFunc) {}
}

/** 执行规则判断
 * and和or，目前先执行and, TODO - or TODO多表单间
 * @param datas <object>
 * @param value <any>
 * @param rules <array>
*/
export function ruleValidate ({ rules = [], datas = {}, value, field }) {
  // 参数非boolean，持续进行判断
  return rules.reduce((res, rule) => {
    const { operation, param } = rule
    if (operation) {
      // 获取运算公式
      const operationItem = ruleConfig.operationOptions.find(r => r.value === rule.operation)
      // 获取运算参数
      const paramVal = transParamsValue({ param, datas, value })
      // 获取阀值参数
      // const thresholdVal = transThreshold({ ...rule, datas, value })
      // 运算执行
      operationItem.func.call(this, paramVal)
    }
  }, true)
}

/* 执行事件 */
export function eventFunc ({ target, targetType, eventName, rules }) {
  // 执行对象处理
  // 事件执行
}

/* 数据修改通道 - 替换所有数据 */
export function handleChangeData (nData = {}) {
  // 数据追加，如何数据替换？
  this.fullData = nData
  console.info('替换:', this.fullData)
}

/* 数据修改通道 - 追加赋值 */
export function handleAssignData (nData = {}) {
  this.fullData = { ...this.fullData, ...nData }
  console.log('追加：', this.fullData)
}

/* 执行通道事件, 允许接受窗口通道的信息，存在触发修改信息，弹窗展示等行为 */
export const channelEvent = {
  changeData: handleChangeData, // 数据修改通道
  assignData: handleAssignData // 数据修改通道
}

/* 允许接受窗口通道的信息，存在触发修改信息，弹窗展示等行为 */
export const validPostMesgToParent = Object.keys(channelEvent)

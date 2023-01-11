/** 注册执行的事件记录
 * 一般示例如：
 * - 打开弹窗/侧拉窗
 * - 发起异步请求
 * - 触发改变联动字段属性、字段数值
 * - 自定义，回调表单数据、表单字段配置、当前字段配置、当前数值
 * ----
 * 进一步抽取得：
 * - 通用动作：
 * - 组件动作: 显示/隐藏；禁用/启用；
 * - 广播动作: message/toast/alert/异步请求
 * - 自定义动作
 * */
export default [
  // 显示/隐藏
  {
    eventDesc: '显示/隐藏',
    eventTip: '当条件成立/不成立时，对执行目标的显示/隐藏',
    eventName: 'visabledEvent',
    actionType: 'common'
  },
  // 禁用/启用
  {
    eventDesc: '禁用/启用',
    eventName: 'disabledEvent',
    actionType: 'common'
  },
  {
    eventDesc: '修改属性',
    eventName: 'changeAttrsEvent',
    actionType: 'common'
  },
  {
    eventDesc: '修改赋值',
    eventName: 'changeValueEvent',
    actionType: 'common'
  },
  {
    eventDesc: '发起请求',
    eventName: 'fetchRequireEvent',
    actionType: 'common'
  },
  // 自定义
  {
    eventDesc: '自定义操作',
    eventName: 'customEvent',
    actionType: 'custom'
  }
]

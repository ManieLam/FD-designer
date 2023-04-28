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
/**
 * eventDesc 事件描述名称
 * eventTip  事件动作说明
 * eventName <string> 执行事件名称
 * eventType <string> 动作类型，不同界面上的配置内容不一样
*/
export default [
  {
    eventDesc: '通知',
    eventTip: '通知外部窗口已触发动作, 通知内容为：{ on: 动作<string>, formData: 表单数据<Object>, action: 动作事件配置对象<Object> }',
    eventName: 'notifyWindowEvent',
    eventType: 'message'
  },
  // 显示/隐藏
  {
    eventDesc: '显示/隐藏',
    eventTip: '当条件成立/不成立时，对执行目标的显示/隐藏',
    eventName: 'visabledEvent',
    eventType: 'changeAttr'
  },
  // 禁用/启用
  {
    eventDesc: '禁用/启用',
    eventName: 'disabledEvent',
    eventType: 'changeAttr'
  },
  {
    eventDesc: '修改属性',
    eventName: 'changeAttrsEvent',
    eventType: 'changeAttr'
  },
  {
    eventDesc: '修改赋值',
    eventName: 'changeValueEvent',
    eventType: 'changeAttr'
  },
  {
    eventDesc: '发起请求',
    eventName: 'fetchRequireEvent',
    eventType: 'apiRequire'
  },
  // 自定义
  {
    eventDesc: '自定义操作',
    eventName: 'customEvent',
    eventType: 'custom'
  }
]


export default {
  // 用于选择条件
  paramOptions: [
    { label: '字段数值', value: 'fieldValue' },
    { label: '表单数值', value: 'formDataCollect' },
    { label: '地址参数', value: 'routeValue' },
    { label: '本地缓存参数', value: 'localValue' }
  ],
  // 用于选择运算符
  operationOptions: [
    { label: '===', value: 'eq' },
    { label: '!==', value: 'notEq' },
    { label: 'in', value: 'includes' },
    { label: '>', value: 'gt' },
    { label: '>=', value: 'gte' },
    { label: '<', value: 'lt' },
    { label: '<=', value: 'lte' }
  ],
  // 用于选择阀值
  thresholdOptions: [
    { label: '空数据', value: 'isNil' },
    {
      label: '数据类型',
      value: 'dataType',
      children: [
        { label: 'int整型', value: 'int' },
        { label: '小数', value: 'float' }
      ]
    },
    { label: '选项值', value: 'option' }
  ],
  // 选择执行目标类型
  targetTypeOptions: [
    { label: '字段', value: 'field' },
    { label: '表单', value: 'form' }
  ]
}

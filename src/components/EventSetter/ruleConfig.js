import lodash from 'lodash'

function includeEvent (a, b) {
  if (a.constructor === Array) {
    return a.includes(b)
  } else if (a.constructor === Object) {
    return a.hasOwnProperty.call(b)
  }
}

/**
 * 根据输入的阀值内容的选项反推选项值, 执行环境为预览/渲染环境
 * @param options 选项集
 * @param value 输入的阀值
 * @param valkey 值的key, 即输入的阀值所在选项中的key
 * @param pickkey 挑选内容的key, 即挑选对比的选项中对应的key
*/
function optionPickEvent ({ options = [], value, valkey = 'label', pickkey = 'value' }) {
  const optObj = options.find(opt => opt[valkey] === value)
  return optObj ? optObj[pickkey] : ''
}

export default {
  // 用于选择条件
  paramOptions: [
    { label: '字段数值', value: 'fieldValue' },
    { label: '表单数值', value: 'collectData' },
    { label: '地址参数', value: 'router' },
    { label: '本地缓存参数', value: 'localstorage' }
  ],
  // 用于选择运算符, func记录该方法对应的执行内容
  operationOptions: [
    { label: '===', value: 'eq', func: (a, b) => { return a === b } },
    { label: '!==', value: 'notEq', func: (a, b) => { return a !== b } },
    { label: 'in', value: 'includes', func: includeEvent },
    { label: '>', value: 'gt', func: lodash.gt },
    { label: '>=', value: 'gte', func: lodash.gte },
    { label: '<', value: 'lt', func: lodash.lt },
    { label: '<=', value: 'lte', func: lodash.lte }
  ],
  // 用于选择阀值
  thresholdOptions: [
    { label: '空数据', value: 'isNil', func: lodash.isNil }, // 定值
    // {
    //   label: '数据类型',
    //   value: 'dataType',
    //   children: [
    //     { label: 'int整型', value: 'int', func: lodash. },
    //     { label: '小数', value: 'float' }
    //   ]
    // },
    { label: '选项值', value: 'option', func: optionPickEvent, valueInput: true, valPlaceholder: '请输入选项值内容' } // valueInput: 存在输入关键值
  ],
  // 选择执行目标类型
  targetTypeOptions: [
    { label: '字段', value: 'field' },
    { label: '表单', value: 'form' }
  ]
}

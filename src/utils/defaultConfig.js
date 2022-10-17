/* 默认数值配置 */

// 默认表单属性
export const formAttrs = {
  layout: 'default',
  // labelHidden: false,
  labelWidth: 100,
  labelPosition: 'right',
  readOnly: false,
  keepAliveData: true,
  isGroup: false // 是否组合
}

// 默认下拉组件(select)配置属性值
export const select = {
  clearable: true,
  filterable: true,
  defaultValue: {
    customFunc: '(data, fields, field) => {\n return data[field.name]}',
    valueType: 'isDefault'
  }, // 默认值配置
  placeholder: '请选择'
}

// 默认选项配置
export const defaultOptions = [{
  label: '选项1',
  value: 1
}, {
  label: '选项2',
  value: 2
}]

export default {
  formAttrs,
  defaultOptions,
  select
}

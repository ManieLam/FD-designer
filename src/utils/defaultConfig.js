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

// 默认表单按钮配置
export const formButtons = {
  cancel: { label: '取消', name: 'cancel', sort: 0, func: () => {}, returnBack: true },
  reset: {
    label: '重置',
    name: 'reset',
    sort: 1,
    func: () => {}
  },
  submit: {
    label: '提交',
    name: 'submit',
    type: 'primary',
    validate: true,
    sort: 2,
    func: () => {
      this.$refs.form.validate((valid) => {
        console.info('验证结果', valid)
      })
    }
  }
}

/* 表单输入元素配置属性值 */
export const select = {
  // type: '下拉组件',
  clearable: true,
  filterable: true,
  defaultValue: {
    customFunc: '(data, fields, field) => {\n return data[field.name]}',
    valueType: 'isDefault'
  }, // 默认值配置
  placeholder: '请选择'
}
export const input = {
  placeholder: '请输入',
  defaultValue: {
    customFunc: '(data, fields, field) => {\n return data[field.name]}',
    valueType: 'isDefault'
  }
}
export const text = {
  defaultValue: {
    customFunc: '(data, fields, field) => {\n return data[field.name]}',
    valueType: 'isDefault'
  }
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
  formButtons,
  defaultOptions,
  select,
  input
}

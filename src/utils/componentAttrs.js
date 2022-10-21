// class AttrUtils {
//   constructor (config = []) {
//     this.config = config
//   }

//   init () {}
// }

/**
 * attrs属性名解释：
 * @param label 属性描述
 * @param key 属性关键字段，对应配置表中的属性值
 * @param tag 属性表现的提供用户选择的表单控件（支持element-ui、anso-ui表单控件）,custom-list: 自定义列表
 * @param tip 信息提示
 * @param options 属性的配置选项
 * @param chains 属性的配置的联动函数
*/

const switchDefaultOptions = [{ label: '允许', value: true }, { label: '不允许', value: false }]

export const select = {
  attrs: [
    {
      label: '类型',
      key: 'type',
      tag: 'AnsoDataformText'
    },
    {
      label: '字段键名',
      key: 'name',
      tag: 'el-input'
    },
    {
      label: '文本标签',
      key: 'label',
      tag: 'el-input'
    },
    {
      label: '占位内容',
      key: 'placeholder',
      tag: 'el-input'
    },
    {
      label: '是否只读',
      key: 'disabled',
      tag: 'el-checkbox',
      labelHidden: true,
      options: [{ label: '只读', value: true }, { label: '可编辑', value: false }],
      chains: () => { }
    },
    {
      label: '是否分组',
      key: 'isGroup',
      tag: 'el-checkbox',
      labelHidden: true,
      options: [{ label: '分组', value: true }, { label: '不分', value: false }],
      chains: () => { }
    },
    {
      label: '是否多选',
      key: 'multiple',
      tag: 'el-checkbox',
      labelHidden: true,
      options: [{ label: '多选', value: true }, { label: '单选', value: false }]
    },
    {
      label: '是否允许清空选项',
      key: 'clearable',
      tag: 'el-checkbox',
      labelHidden: true,
      options: switchDefaultOptions
    },
    {
      label: '选项',
      key: 'options',
      tag: 'form-option',
      tip: '选项配置的方式只允许一种'
      // tag: 'el-select'
    },
    {
      label: '搜索',
      tag: 'form-search',
      // tag: 'el-switch',
      key: 'filterable',
      options: switchDefaultOptions
    },
    {
      label: '校验',
      key: 'validate',
      tag: 'form-validate'
    },
    {
      label: '默认值',
      key: 'defaultValue',
      tag: 'form-defaultValue'
    }
  ],
  actions: [
    // {
    //   label: '自带操作'
    // },
    {
      label: '联动配置',
      key: 'chains',
      tag: 'form-chains'
    }
  ]
}

export const button = (function () {
  const attrs = [
    { label: '按钮标签', key: 'label', tag: 'el-input' },
    { label: '排序', key: 'sort', tag: 'el-input-number' }
  ]
  return {
    submitAttrs: [
      ...attrs,
      { label: '提交前校验', key: 'validate', tag: 'el-switch' },
      { label: '配置数据源', key: 'funcStr', tag: 'form-remote' }
    ],
    resetAttrs: [
      ...attrs,
      { label: '重置前二次提醒', key: 'tipBeforeReset', tag: 'el-switch' }
    ],
    cancelAttrs: [
      ...attrs,
      { label: '取消前二次提醒', key: 'tipBeforeCancel', tag: 'el-switch' },
      { label: '取消后返回页面', key: 'routeAfterCancel', tag: 'el-input', placeholder: '请输入页面路由地址' }
    ],
    attrs
  }
})()

export default {
  select,
  button
}

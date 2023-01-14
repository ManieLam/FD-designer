/* 所有配置区属性设置 */

/* 表单组件录入的映射, key为实际所用的组件类型，value为AnsoDataform对应的form.tag标签 */
export const formItemTags = {
  AnsoDataformText: 'text',
  AnsoDataformInput: 'input',
  AnsoDataformTextRange: 'textRange',
  AnsoDataformNumber: 'number',
  AnsoDataformNumRange: 'numberRange',
  AnsoDataformSelect: 'select',
  AnsoDataformSwitch: 'switch',
  AnsoDataformSlider: 'slider',
  AnsoDataformCheckbox: 'checkbox',
  AnsoDataformRadio: 'radio',
  AnsoDataformCascader: 'cascader',
  AnsoDataformTime: 'time',
  AnsoDataformTimeRange: 'timeRange',
  AnsoDataformDate: 'date',
  AnsoDataformUpload: 'file',
  // AnsoDataformIcon: 'icon',
  InfoRender: 'render',
  AnsoButtonGroup: 'button',
  AnsoLink: 'link',
  AnsoDataformTransfer: 'transfer',
  AnsoDataformTree: 'tree'
}

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

/* 表单元素组件基本属性选项 */
const FormtagAttrs = {
  type: { label: '类型', key: 'type', tag: 'AnsoDataformText' },
  name: { label: '字段键名', key: 'name', tag: 'el-input' },
  label: { label: '文本标签', key: 'label', tag: 'el-input' },
  validate: { label: '校验', key: 'validate', tag: 'form-validate' },
  placeholder: { label: '占位内容', key: 'placeholder', tag: 'el-input' },
  defaultValue: { label: '默认值', key: 'defaultValue', tag: 'form-defaultValue' },
  disabled: { label: '只读', key: 'disabled', tag: 'el-checkbox', labelHidden: true, options: [{ label: '只读', value: true }, { label: '可编辑', value: false }], chains: () => { } }
}

/* 表单元素组件事件结构 */
export const FormtagActions = function (config = {}) {
  return {
    on: 'click', // 触发事件，不同执行者用的事件也不一样，常用click, change, 选择范围取自不同配置的actions
    target: '', // “被执行方”的name
    eventName: '', // 事件执行方法（自定义 + 内置TODO）
    rules: [],
    ...config
  }
}

export const actionHandles = {

}

export const select = {
  attrs: [
    // FormtagAttrs.type,
    FormtagAttrs.name,
    FormtagAttrs.label,
    FormtagAttrs.placeholder,
    FormtagAttrs.disabled,
    {
      label: '是否多选（TODO）',
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
      group: [
        {
          label: '配置',
          key: 'options',
          tag: 'form-option',
          tip: '选项配置的方式只允许一种'
          // tag: 'el-select'
        },
        {
          label: '是否分组（TODO）',
          key: 'isGroup',
          tag: 'el-checkbox',
          labelHidden: true,
          options: [{ label: '分组', value: true }, { label: '不分', value: false }],
          chains: () => { }
        }
      ]
    },
    {
      label: '搜索',
      tag: 'form-search',
      // tag: 'el-switch',
      key: 'filterable',
      options: switchDefaultOptions
    },
    FormtagAttrs.validate,
    FormtagAttrs.defaultValue
  ],
  actions: [
    { type: 'change', desc: '选中值发生变化时触发' },
    { type: 'visible-change', desc: '下拉框出现/隐藏时触发' },
    { type: 'remove-tag', desc: '多选模式下移除tag时触发' },
    { type: 'clear', desc: '点击清空按钮时触发' },
    { type: 'blur', desc: '当 input 失去焦点时触发' },
    { type: 'focus', desc: '当 input 获得焦点时触发' }
  ]
}

export const text = {
  attrs: [
    // FormtagAttrs.type,
    FormtagAttrs.name,
    FormtagAttrs.label,
    FormtagAttrs.defaultValue
  ]
}

export const input = {
  // attrs: new Proxy([], formtagAttrsHandler)
  attrs: [
    // FormtagAttrs.type,
    FormtagAttrs.name,
    FormtagAttrs.label,
    FormtagAttrs.placeholder,
    FormtagAttrs.disabled,
    FormtagAttrs.validate,
    {
      label: '最大长度限制',
      tag: 'el-input-number',
      key: 'maxlength'
    },
    {
      label: '最小长度限制',
      tag: 'el-input-number',
      key: 'minlength'
    },
    {
      label: '显示输入字数统计',
      tag: 'el-checkbox',
      labelHidden: true,
      key: 'show-word-limit'
    },
    FormtagAttrs.defaultValue,
    {
      label: '前缀',
      // tag: 'el-input',
      tag: 'form-affixes',
      key: 'prepend',
      affixesType: 'prepend'
    },
    {
      label: '后缀',
      // tag: 'el-input',
      tag: 'form-affixes',
      key: 'append',
      affixesType: 'append'
    }
  ],
  actions: [
    { type: 'blur', desc: '失去焦点时触发' },
    { type: 'focus', desc: '获得焦点时触发' },
    { type: 'change', desc: '输入框失去焦点或用户按下回车时触发' },
    { type: 'input', desc: '值改变时触发' },
    { type: 'clear', desc: '清空按钮时触发' }
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
      { label: '配置数据源', key: 'funcApi', tag: 'form-remote-list', title: '配置数据源', isSubmit: true }
    ],
    resetAttrs: [
      ...attrs,
      { label: '重置前二次提醒', key: 'tipBeforeAction', tag: 'el-switch' }
    ],
    cancelAttrs: [
      ...attrs,
      { label: '取消前二次提醒', key: 'tipBeforeAction', tag: 'el-switch' },
      { label: '关闭弹窗', key: 'closeDialog', tag: 'el-switch' },
      { label: '返回上一页', key: 'returnBack', tag: 'el-switch' }
      // { label: '取消后返回页面', key: 'routeAfterAction', tag: 'el-input', placeholder: '请输入页面路由【相对地址】' }
    ],
    attrs
  }
})()

export default {
  select,
  text,
  input,
  button
}

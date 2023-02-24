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
  disabled: { label: '禁用', key: 'disabled', tag: 'el-checkbox', labelHidden: true, options: [{ label: '禁用', value: true }, { label: '非禁用', value: false }], chains: () => { } }, // TODO 扩展禁用条件规则
  readOnly: { label: '只读', key: 'readOnly', tag: 'el-checkbox', labelHidden: true, options: [{ label: '只读', value: true }, { label: '读写', value: false }], chains: () => { } },
  clearable: { label: '允许清空', key: 'clearable', tag: 'el-checkbox', labelHidden: true, options: [{ label: '允许', value: true }, { label: '不允许', value: false }] }
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
    FormtagAttrs.clearable,
    {
      label: '是否多选（TODO）',
      key: 'multiple',
      tag: 'el-checkbox',
      labelHidden: true,
      options: [{ label: '多选', value: true }, { label: '单选', value: false }]
    },
    // {
    //   label: '是否允许清空选项',
    //   key: 'clearable',
    //   tag: 'el-checkbox',
    //   labelHidden: true,
    //   options: switchDefaultOptions
    // },
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
    },
    FormtagAttrs.defaultValue
  ],
  actions: [
    { type: 'blur', desc: '失去焦点时触发' },
    { type: 'focus', desc: '获得焦点时触发' },
    { type: 'change', desc: '输入框失去焦点或用户按下回车时触发' },
    { type: 'input', desc: '值改变时触发' },
    { type: 'clear', desc: '清空按钮时触发' }
  ]
}

export const cascader = {
  attrs: [
    FormtagAttrs.name,
    FormtagAttrs.label,
    FormtagAttrs.placeholder,
    FormtagAttrs.disabled,
    FormtagAttrs.validate,
    FormtagAttrs.clearable,
    {
      label: '是否多选（TODO）',
      key: 'multiple',
      tag: 'el-checkbox',
      labelHidden: true,
      options: [{ label: '多选', value: true }, { label: '单选', value: false }]
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
    {
      label: '取值关键key',
      tag: 'el-input',
      key: 'valueKey'
    },
    {
      label: '取值父级关键key',
      tag: 'el-input',
      key: 'parentKey'
    },
    {
      label: '次级菜单的展开方式',
      key: 'expandTrigger',
      tag: 'form-attr-passthrough',
      // tag: 'el-checkbox',
      passthroughAttr: { tag: 'AnsoDataformSelect', options: [{ label: 'click', value: 'click' }, { label: 'hover', value: 'hover' }], label: '次级菜单的展开方式', attrKey: 'props' }
    },
    {
      label: '仅显示最后一级',
      key: 'showAllLevels',
      tag: 'el-checkbox',
      labelHidden: true,
      options: [{ label: '是', value: true }, { label: '否', value: false }]
    },
    {
      label: '是否严格的遵守父子节点不互相关联',
      key: 'checkStrictly',
      tag: 'form-attr-passthrough',
      // tag: 'el-checkbox',
      passthroughAttr: { tag: 'el-checkbox', options: switchDefaultOptions, label: '是否严格的遵守父子节点不互相关联', attrKey: 'props' },
      labelHidden: true
    },
    FormtagAttrs.defaultValue
  ],
  actions: [
    { type: 'change', desc: '选中值发生变化时触发' },
    { type: 'clear', desc: '点击清空按钮时触发' }
  ]
}

export const switchComp = {
  attrs: [
    FormtagAttrs.name,
    FormtagAttrs.label,
    FormtagAttrs.disabled,
    // FormtagAttrs.validate,
    {
      label: '尺寸',
      key: 'size',
      tag: 'ansoDataformSelect',
      options: [
        { label: '大', value: 'lg' },
        { label: '小', value: 'sm' }
      ]
    },
    {
      label: '宽度',
      key: 'width',
      tag: 'el-input-number',
      controls: false,
      tip: '需要保存后刷新查看效果'
    },
    // 暂不开启
    // {
    //   label: '数值类型',
    //   key: 'activeType',
    //   tag: 'ansoDataformSelect',
    //   options: [
    //     { label: '数值', value: 'number' },
    //     { label: '字符串', value: 'string' },
    //     { label: '布尔', value: 'boolean' }
    //   ]
    // },
    {
      label: '开关的文字描述及背景色',
      key: 'options',
      tag: 'form-list',
      columnProps: [
        { label: '文字描述', prop: 'label' },
        // { label: '数值描述', prop: 'value' },
        { label: '背景色', prop: 'color', type: 'color' }
      ],
      draggable: false,
      handlAble: false,
      maxLen: 2
    },
    {
      label: '是否展示提示性语句',
      key: 'isTooltip',
      tag: 'el-checkbox',
      labelHidden: true,
      options: switchDefaultOptions
    },
    {
      label: '是否将文字描述处于按钮内',
      key: 'isInline',
      tag: 'el-checkbox',
      labelHidden: true,
      options: switchDefaultOptions
    },
    FormtagAttrs.defaultValue
  ],
  actions: [
    { type: 'change', desc: '选中值发生变化时触发' },
    { type: 'clear', desc: '点击清空按钮时触发' }
  ]
}

export const dateComp = {
  attrs: [
    FormtagAttrs.name,
    FormtagAttrs.label,
    FormtagAttrs.placeholder,
    FormtagAttrs.disabled,
    FormtagAttrs.readOnly,
    FormtagAttrs.clearable,
    FormtagAttrs.validate,
    {
      key: 'disabledDate',
      label: '选择范围配置【暂不开放】',
      tag: 'form-date-disabledDate'
    },
    {
      key: 'shortcut',
      label: '快捷键【暂不开放】',
      tag: 'form-date-shortcut'
    },
    {
      key: 'dateType',
      label: '显示类型',
      tag: 'ansoDataformSelect',
      isGroup: true,
      // 根据anso-ui可选项写死
      options: [
        { label: '日期(默认)', value: 'date', group: '单日期选择' },
        { label: '年份', value: 'year', group: '单日期选择' },
        { label: '月份', value: 'month', group: '单日期选择' },
        { label: '日期时间', value: 'datetime', group: '单日期选择' },
        { label: '周期', value: 'week', group: '单日期选择' },
        { label: '多日期', value: 'dates', group: '单日期选择' },
        { label: '日期范围', value: 'daterange', group: '日期范围选择' },
        { label: '日期时间范围', value: 'datetimerange', group: '日期范围选择' },
        { label: '月份范围', value: 'monthrange', group: '日期范围选择' }
      ]
    },
    {
      key: 'dateFormat',
      label: '时间模式配置',
      tag: 'ansoDataformSelect'
    },
    FormtagAttrs.defaultValue
  ],
  actions: []
}

export const fileComp = {
  attrs: [
    FormtagAttrs.name,
    FormtagAttrs.label,
    FormtagAttrs.placeholder,
    FormtagAttrs.disabled,
    { label: '是否多选', key: 'multiple', tag: 'el-checkbox', labelHidden: true },
    {
      label: '显示类型',
      key: 'uploadType',
      tag: 'ansoDataformSelect',
      isGroup: true,
      // 根据anso-ui可选项写死
      options: [
        { label: '图片', value: 'picture' },
        { label: '按钮', value: 'button' },
        { label: '拖放区', value: 'drag' }
      ]
    },
    {
      label: '上传接口',
      key: 'resource',
      tag: 'el-input'
    },
    {
      label: '上传所带参数',
      key: 'resType',
      tag: 'el-input'
    },
    {
      label: '展示接口',
      key: 'showResource',
      tag: 'el-input'
    },
    {
      label: '展示接口的使用類型',
      key: 'showResourceType',
      tag: 'el-input'
    },
    {
      label: '文件压缩比例',
      key: 'compress',
      tag: 'el-input'
    },
    {
      label: '备注说明',
      key: 'tip',
      tag: 'el-input'
    }

  ],
  actions: [
    { type: 'change', desc: '输入框失去焦点或用户按下回车时触发' }
  ]
}

export const button = (function () {
  const attrs = [
    { label: '按钮标签', key: 'label', tag: 'el-input' }
    // { label: '排序', key: 'sort', tag: 'el-input-number' } // 暂不开放
  ]
  const actions = [
    { type: 'click', desc: '点击' },
    { type: 'dblclick', desc: '双击' }
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
    attrs: [
      FormtagAttrs.name,
      ...attrs,
      {
        label: '类型',
        key: 'type',
        tag: 'ansoDataformSelect',
        options: [
          { label: '主要按钮', value: 'primary' },
          { label: '成功按钮', value: 'success' },
          { label: '警告按钮', value: 'warning' },
          { label: '危险按钮', value: 'danger' },
          { label: '信息按钮', value: 'info' },
          { label: '文字类型', value: 'text' }
        ]
      },
      {
        label: '图标',
        key: 'icon',
        tag: 'el-input'
      },
      FormtagAttrs.disabled
      /* // tooltip: { content } */
      // {
      //   label: 'tooltip提示',
      //   name: 'tooltip',
      //   tag: 'tooltip是对象需要独立开发的组件'
      // },
      /* // badge: { value, max, is-dot, hidden, type } */
      // {
      //   label: '徽标',
      //   name: 'badge',
      //   tag: 'badge是对象 需要独立开发组件 配置'
      // }
    ],
    actions
  }
})()

export default {
  select,
  text,
  input,
  cascader,
  switch: switchComp,
  date: dateComp,
  file: fileComp,
  button
}

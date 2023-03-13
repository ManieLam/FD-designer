/* 表单按钮组的属性，单个按钮属性请查看@/model/componentAttrs.js中的button属性 */
export const formButtonAttr = [
  {
    label: '表单按钮组属性',
    group: [
      {
        label: '按钮组水平位置',
        key: 'buttonAlign',
        tag: 'AnsoDataformSelect',
        options: [
          { label: '左', value: 'left' },
          { label: '中', value: 'center' },
          { label: '右', value: 'right' }
        ]
      },
      {
        label: '是否固定页脚底部',
        key: 'buttonFixed',
        tag: 'el-switch'
      }
    ]
  }

]

/* 表单允许配置的属性 */
export default [
  {
    label: '是否只读',
    key: 'readOnly',
    tag: 'el-checkbox',
    labelHidden: true,
    options: [{
      value: true,
      label: '开启'
    }]
  },
  // {
  //   // Anso-ui没有支持表单标题展示
  //   label: '表单标题',
  //   key: 'title',
  //   tag: 'el-input',
  //   placeholder: '请输入'
  // },
  {
    label: '布局类型',
    readonly: true,
    key: 'layout',
    tag: 'AnsoDataformSelect',
    options: [{
      value: 'default',
      label: '默认'
    }, {
      value: 'grid',
      label: '网格'
    }]
  },
  {
    label: '标签',
    key: 'label',
    group: [
      {
        label: '是否隐藏文本标签',
        key: 'labelHidden',
        tag: 'el-switch',
        'active-text': '隐藏'
      },
      {
        label: '文本标签宽度',
        key: 'labelWidth',
        placeholder: '请输入数值',
        tag: 'el-input'
      },
      {
        label: '文本显示位置',
        key: 'labelPosition',
        tag: 'AnsoDataformSelect',
        options: [
          { label: '顶部对齐', value: 'top' },
          { label: '居左', value: 'left' },
          { label: '居右', value: 'right' },
          { label: '居中', value: 'center' },
          { label: '两端对齐(TODO)', value: 'justify' }
        ]
        // },
        // {
        //   label: '辅助性提示',
        //   key: 'labelTip',
        //   tip: '带提示辅助性标签, 小图标在标签盘显示，hover显示辅助内容',
        //   tag: 'el-input'
      }
    ]
  // },
  // {
  //   label: '保留数据输入（TODO）',
  //   key: 'keepAliveData',
  //   tag: 'el-checkbox',
  //   labelHidden: true,
  //   options: [{
  //     value: true,
  //     label: '开启'
  //   }]
  }
]

export const actionOptions = [
  { type: 'changeValue', desc: '数值改变' }
]

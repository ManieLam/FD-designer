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
      label: '网格',
      disabled: true
    }]
  },
  {
    label: '标签',
    key: 'label',
    group: [
      // {
      //   label: '是否隐藏文本标签',
      //   key: 'labelHidden',
      //   tag: 'el-switch'
      // },
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
          { label: '居中', value: 'center' }
        ]
        // },
        // {
        //   label: '辅助性提示',
        //   key: 'labelTip',
        //   tip: '带提示辅助性标签, 小图标在标签盘显示，hover显示辅助内容',
        //   tag: 'el-input'
      }
    ]
  },
  {
    label: '保留数据输入（TODO）',
    key: 'keepAliveData',
    tag: 'el-checkbox',
    labelHidden: true,
    options: [{
      value: true,
      label: '开启'
    }]
  }
]

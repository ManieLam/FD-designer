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
      label: '占位符',
      key: 'placeholder',
      tag: 'el-input'
    },
    {
      label: '选项',
      key: 'options',
      tag: 'form-option',
      tip: '选项配置的方式只允许一种'
      // tag: 'el-select'
    },
    {
      label: '是否分组',
      key: 'isGroup',
      tag: 'el-switch',
      options: [{ label: '分组', value: true }, { label: '不分', value: false }],
      chains: () => {}
    },
    {
      label: '是否多选',
      key: 'multiple',
      tag: 'el-switch',
      options: [{ label: '多选', value: true }, { label: '单选', value: false }]
    },
    {
      label: '是否允许清空选项',
      key: 'clearable',
      tag: 'el-switch',
      options: switchDefaultOptions
    },
    // {
    //   label: '搜索',
    //   key: 'filterable',
    //   group: [
    //     {
    //       label: '是否允许搜索',
    //       tag: 'el-switch',
    //       key: 'filterable',
    //       options: switchDefaultOptions,
    //     }
    //   ]
    // },
    {
      label: '是否允许搜索',
      tag: 'form-search',
      // tag: 'el-switch',
      key: 'filterable',
      options: switchDefaultOptions
    // },
    // {
    //   label: '是否远程搜索',
    //   key: 'filter-method',
    //   tag: 'el-switch',
    //   options: switchDefaultOptions
    }
  ],
  actions: [
    {
      label: '异步搜索函数',
      key: 'remoteFunc',
      func: () => {}
    }
  ]
}

export default {
  select
}

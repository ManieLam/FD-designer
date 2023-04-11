/* 默认数值配置 */
import { getURLQuery } from '@/utils/format'
import { MultiApi } from '@/model/resource'

// 默认字段元素属性（一个字段的属性一般包含默认 + tag对应的属性）
export const bodyItemAttrs = {
  name: '', // 对应数据源的key
  key: '', // 用于表示该字段在文档中的身份id, 一般不变动
  label: '', // 字段标题
  compTag: '', // ?使用compTag还是tag
  tag: '', // 字段使用的组件类型（select/input/table/其他注册供使用的组件name）
  tip: '', // TODO 辅助文字提示
  defaultValue: {}, // 默认值配置对象
  actions: [], // 行为事件操作队列，不同组件对应不同actions,
  styles: {}, // 样式
  visabled: true, // TODO 是否可见(默认true)， 可选择自定义事件
  disbaled: false // TODO 是否禁用(默认false)， 可选择自定义事件
}

// 默认表单属性
export const formAttrs = {
  layout: 'default',
  // labelHidden: false,
  layoutAttrs: {
  //   layout: 'default' // 为保留原先配置的依然生效，layout不放在layoutAttrs中
  },
  labelWidth: 100,
  labelPosition: 'right',
  buttonAlign: 'left',
  buttonFixed: false,
  readOnly: false,
  keepAliveData: true,
  isGroup: false // 是否组合
}

// 根据表单layout类型设置默认值
export const formLayoutDefAttrs = {
  grid: {
    gridspanNum: 3,
    fieldSpan: []
  },
  row: {
    colspanNum: 3,
    isAutoColumn: true,
    collapsable: false,
    errorToptip: true,
    fieldSpan: []
  },
  inline: {
    collapsable: false,
    errorToptip: true
  }
}
export function getFormlayoutDefval ({ type = 'default', defData = {} }) {
  return formLayoutDefAttrs[type] ? {
    ...formLayoutDefAttrs[type],
    ...defData
  } : defData
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
    func: () => {},
    funcApi: new MultiApi()
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

/* 表单输入元素配置属性值 */
export const select = {
  // type: '下拉组件',
  clearable: true,
  filterable: true,
  defaultValue: {
    customFunc: '(data, fields, field) => {\n return data[field.name]}',
    valueType: 'isDefault'
  }, // 默认值配置
  placeholder: '请选择',
  options: defaultOptions
}
export const input = {
  clearable: true,
  placeholder: '请输入',
  defaultValue: {
    customFunc: '(data, fields, field) => {\n return data[field.name]}',
    valueType: 'isDefault'
  },
  inputType: 'text'
}
export const text = {
  defaultValue: {
    customFunc: '(data, fields, field) => {\n return data[field.name]}',
    valueType: 'isDefault'
  }
}
export const radio = {
  size: 'small',
  options: defaultOptions
}
export const cascader = {
  valueKey: 'value',
  parentKey: 'parentId',
  clearable: true,
  filterable: true,
  placeholder: '请选择',
  options: defaultOptions,
  expandTrigger: { attrKey: 'props', value: 'click' }
}

export const switchOption = (activeType) => {
  const valType = activeType
  // 获取数值类型转换对应的value类型, 根据anso-ui/ansoDataformSwitch限制的数值
  let optVal = null
  switch (valType) {
    case 'string':
      optVal = ['1', '0']; break
    case 'number':
      optVal = [1, 0]; break
    case 'boolean':
    default:
      optVal = [true, false]; break
  }
  return [{ label: '开', value: optVal[0], color: '#409EFF' }, { label: '关', value: optVal[1], color: '#BFBFBF' }]
}

export const switchConf = {
  // activeType: 'boolean', // 数值类型，同anso-ui叫法, 暂不开启
  size: 'lg',
  width: 40,
  isTooltip: false,
  isInline: false,
  options: switchOption()
}

export const dateConf = {
  dateType: 'date' // 默认是日期选择器
}

export const fileConf = {
  resource: 'https://gddxit.cn/wangch_obh/api/fileserver/upload',
  showResource: 'https://gddxit.cn/wangch_obh/api/fileserver/download/id',
  showResourceType: 'id'
}

// 默认值预设可选项
export const presetOptions = [
  {
    label: '缓存数据',
    options: [
      {
        label: 'localStorage',
        value: 'localStorage',
        category: 'localStorage',
        meta: '请填写localStorage指定的name',
        valFunc: (data, fields, field) => {
          const localKey = field?.defaultValue?.localStorage
          const localValue = localKey ? localStorage.getItem(localKey) : null
          if (localValue) {
            try {
              return JSON.parse(localValue)
            } catch (error) {
              return localValue
            }
          }
        }
      }
    ]
  },
  {
    label: '时间类型',
    options: [
      { label: '当日', meta: '一个月中的哪一日(DD)', value: 'localDate', valFunc: (data, fields, field) => { return new Date().getDate() } },
      { label: '当前时间', meta: '当时时刻(HH:mm:ss)', value: 'localTime', valFunc: (data, fields, field) => { return new Date().toTimeString() } },
      { label: '当天', meta: '年-月-日-时-分-秒(timestamp)', value: 'localDay', valFunc: (data, fields, field) => { return new Date().getTime() } },
      { label: '当天(0点)', meta: '年-月-日-时-分-秒(timestamp)', value: 'localDayStart', valFunc: (data, fields, field) => { return new Date(new Date().toDateString()).getTime() } },
      { label: '当天(24点)', meta: '年-月-日-时-分-秒(timestamp)', value: 'localDayEnd', valFunc: (data, fields, field) => { return new Date(new Date().toDateString()).getTime() + 24 * 60 * 60 * 1000 - 1 } },
      { label: '隔天', meta: '年-月-日-时-分-秒(timestamp)', value: 'localNextDay', valFunc: (data, fields, field) => { return new Date().getTime() + 24 * 60 * 60 * 1000 } },
      { label: '当月', meta: '当天月份(MM)', value: 'localMonth', valFunc: (data, fields, field) => { return new Date().getMonth() + 1 } },
      { label: '当年', meta: '当天年份(YYYY)', value: 'localYear', valFunc: (data, fields, field) => { return new Date().getFullYear() } }
    ]
  },
  {
    label: '地址栏数据',
    meta: '请填写参数指定的名称和传参方式',
    options: [
      /* {
        label: '地址栏“/”后的取值',
        meta: 'params',
        value: 'routerParams',
        valFunc: (data, fields, field) => {
          // try {
          //   if (this.$router) {
          //     const { params } = this.$route
          //     const key = field?.defaultValue?.routerParams
          //     return params?.[key] || ''
          //   } else {
          //     const _href = window.location.href
          //   }
          // } catch (error) {
          // }
        }
      }, */
      {
        label: '地址栏“?”后的取值',
        meta: 'query',
        value: 'routerQuery',
        valFunc: (data, fields, field) => {
          const key = field?.defaultValue?.routerQuery
          try {
            if (this?.$router) {
              const { query } = this.$route
              return query?.[key] || ''
            } else {
              const queryObj = getURLQuery()
              return queryObj[key]
            }
          } catch (error) {
            console.log('err:', error)
          }
        }
      }
    ]
  },
  {
    label: '自定义',
    options: [
      {
        label: '同表单数据自定义',
        value: 'customFunc',
        valFunc: (data, fields, field) => { return data[field.name] }
      },
      {
        label: '关联字段',
        meta: '表单内数据字段',
        value: 'customChainsField',
        valFunc: (data, fields, field) => {
          const key = field?.defaultValue?.customChainsField
          // TODO 跟随指定字段的联动效果
          return data?.[key]
        }
      }
    ]
  }
]

/* 按钮组中的子按钮元素 默认值设置 */
export function buttonConf (config = {}) {
  // console.log('默认值:', config)
  return {
    sort: 0,
    name: `btn_${Math.floor(Math.random() * 10)}`,
    label: '按钮',
    actions: [],
    ...config
  }
}

export default {
  formAttrs,
  formButtons,
  defaultOptions,
  presetOptions,
  select,
  input,
  radio,
  cascader,
  switch: switchConf,
  date: dateConf,
  file: fileConf,
  switchOption: switchOption,
  button: buttonConf()
}

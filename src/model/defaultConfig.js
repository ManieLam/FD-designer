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
  actions: [], // 行为事件操作队列，不同组件对应不同actions
  visabled: true, // TODO 是否可见(默认true)， 可选择自定义事件
  disbaled: false // TODO 是否禁用(默认false)， 可选择自定义事件
}

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
    func: () => {},
    funcApi: new MultiApi()
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

export default {
  formAttrs,
  formButtons,
  defaultOptions,
  presetOptions,
  select,
  input
}

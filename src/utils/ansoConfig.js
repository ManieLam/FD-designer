import { keys } from 'lodash'
import { Message } from 'element-ui'
import { httpOptions, httpBaseURL } from './request'

// 与后端约定的接口规范修改请求的方式
export const resourceConfig = ({ url, params }) => {
  return httpOptions({
    url: httpBaseURL + url,
    method: 'post',
    data: params
  }, false)
}

// 与后端约定的导出接口规范修改请求的方式
export const exportResourceConfig = ({ url, params }) => {
  return httpOptions({
    url: httpBaseURL + url,
    method: 'post',
    data: params
  }, false)
}

// 按与后端约定的接口规范进行接口请求数据格式化
export const transformRequest = ({ pageSize, pageIndex, sortBy, filterBy, filterFieldsObject, alwaysFilterBy = [] }) => {
  // console.log('filterFieldsObject', filterFieldsObject)
  return {
    pageSize,
    pageIndex,
    sortBy: sortByArray(sortBy),
    filterBy: [
      ...filterByArray(filterBy, filterFieldsObject),
      ...alwaysFilterBy
    ]
  }
}

// 按与后端约定的导出接口规范进行接口请求数据格式化
export const transExportRequest = ({ pageSize, pageIndex, sortBy, filterBy, filterFieldsObject, alwaysFilterBy = [], tableColumnList = [], tableVisibleList = [], tableColumnConfig = [], resource, exportFileName }) => {
  // console.log(tableColumnList, tableVisibleList)
  const columnList = tableColumnList.filter(t => tableVisibleList.includes(t))
  // console.log(columnList)
  return {
    pageSize,
    pageIndex,
    sortBy: sortByArray(sortBy),
    filterBy: [
      ...filterByArray(filterBy, filterFieldsObject),
      ...alwaysFilterBy
    ],
    columnList: columnList,
    columnConfig: tableColumnConfig,
    url: resource,
    featureName: exportFileName
  }
}

export const successExportResponse = ({ exportFileName }) => {
  Message({
    type: 'success',
    showClose: true,
    duration: 2000,
    message: `【${exportFileName}】下载请求成功`
  })
}

/**
 * @name sortByArray
 * @description 将sortBy数据格式化为Post接口需要的数组格式
 * @param {Object} sortBy 转换格式的数据
 */
export const sortByArray = (sortBy) => sortBy.map(sortByFormatItem)

// sortBy单个的数据格式化
const sortByFormatItem = ({ prop, order }) => ({ name: prop, sort: order })

/**
 * @name sortByFormat
 * @description 将sortBy数据格式化为Get接口需要的格式
 * @param {Object} sortBy 转换格式的数据
 */
export const sortByFormat = (sortBy) => sortByArray(sortBy).map(sortByToString).join(';')

// 将sortBy数据格式化成String形式
const sortByToString = ({ name, sort }) => `${name}|${sort}`

/**
 * @name filterByArray
 * @description 将filterBy数据格式化为Post接口需要的数组格式
 * @param {Object} filterValues 转换格式的数据
 * @param {Object} columnsList 所有检索字段的columns解释，必须设置column[key].form对象
 */
export const filterByArray = (filterValues, columnsList = {}) => {
  const filterKeys = keys(filterValues)
  return filterKeys.reduce((result, name) => {
    const columnFilter = columnsList[name].form
    const value = filterValues[name]
    if (value === '' || value === undefined || value === null || !columnFilter) return result
    return [...result, ...filterByFormatItem({ name, value, columnFilter })]
  }, [])
}

// filterBy单个的数据格式化
const filterByFormatItem = (props) => filterByFormatByTag[props.columnFilter.tag] ? filterByFormatByTag[props.columnFilter.tag](props) : filterByFormatByTag.default(props)

// filterBy单个的数据格式化,两个值切范围的情况
const filterByFormatByRange = ({ name, value }) => ([{
  name: name,
  type: 'ge',
  value: value[0]
}, {
  name: name,
  type: 'le',
  value: value[1]
}])

// filterBy单个的数据格式化,直接调用的情况
const filterByFormatByType = ({ name, value, type }) => ([{ name, type, value }])

// 后端支持的filter类型校验
/* eq：等于
ne：不等于
like： 类似
ge：大于等于
le：小于等于
gt：大于
lt：小于
in:包含
isNull:为Null
isNotNull:不为Null
startWith:以...开头（右模糊）
endWith:以...结束（左模糊） */
const validateFilterTypes = (type) => {
  const effectiveTypes = ['eq', 'ne', 'like', 'ge', 'le', 'gt', 'lt', 'in', 'isNull', 'isNotNull', 'startWith', 'endWith']
  return effectiveTypes.includes(type)
}

// 根据和后端约定的数据格式进行处理
const filterByFormatByTag = {
  // filterBy搜索控件为timeRange
  timeRange: filterByFormatByRange,
  // filterBy搜索控件为numberRange
  numberRange: filterByFormatByRange,
  // filterBy搜索控件为textRange
  textRange: ({ name, value: propValue }) => {
    return filterByFormatByRange({ name, value: Array.from(propValue, val => val || '') })
  },
  // filterBy搜索控件为date,判断是否为范围，是的话按range处理，不是的话按eq处理
  date: (props) => {
    return ['datetimerange', 'daterange', 'monthrange'].includes(props.columnFilter.dateType) ? filterByFormatByRange(props) : filterByFormatByType({ ...props, type: 'eq' })
  },
  // filterBy搜索控件为select,判断是否为多选，是的话按in处理，不是的话按eq处理
  select: (props) => {
    return props.columnFilter.filterType === 'in' || props.columnFilter.multiple ? filterByFormatByType({ ...props, type: 'in' }) : filterByFormatByType(({ ...props, type: 'eq' }))
  },
  // filterBy搜索控件为其它的情况
  // 左模糊操作类型使用endWith,右模糊操作类型使用startWith,模糊like，准确（默认）：eq
  default: (props) => {
    const { filterType } = props.columnFilter
    return filterType && validateFilterTypes(filterType) ? filterByFormatByType(({ ...props, type: filterType })) : filterByFormatByType(({ ...props, type: 'eq' }))
  }
}

/**
 * @name filterByFormat
 * @description 将filterBy数据格式化为Get接口需要的格式
 * @param {Object} filterValues 转换格式的数据
 * @param {Object} columnsList 所有检索字段的columns解释，必须设置column[key].form对象
 */
export const filterByFormat = (filterValues, columnsList = {}) => filterByArray(filterValues, columnsList).map(filterToString).join(';')

// 将filterBy数据格式化成String形式
const filterToString = ({ name, type, value }) => `${name}|${type}|${value}`

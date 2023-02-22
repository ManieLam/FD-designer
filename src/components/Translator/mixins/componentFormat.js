// import dayjs from 'dayjs'
import { presetOptions } from '@/model/defaultConfig'

const getCurTime = (flag) => {
  const range = presetOptions[0]?.options || []
  if (flag) {
    return range.find(e => e.value === flag)?.valFunc
  }
  return null
}
export default {
  methods: {
    formatFormItem ({ tag }) {
      const resAttrs = this[`format${tag}Attrs`](...arguments)
      // 请返回对象，不返回则阻断
      return typeof resAttrs === 'object' ? resAttrs : {}
    },
    formatdateAttrs ({ disabledDate }) {
      const pickerOptions = {}
      // 禁止选择范围
      const { min, max } = disabledDate || {}
      if (min.length || max.length) {
        // 只有1位；或者3位都有值才会执行
        pickerOptions.disabledDate = (time) => this.transDateDisable(min, max).call(this, time)
      }

      return pickerOptions
    },
    /* @retrun function pickerOptions.disabledDate取值
      [0]: year = 当年 | month = 当月 | day = 当日
      [1]: add | sub
      [2]: 跨度，最小单位：天
    */
    transDateDisable (min = [], max = []) {
      // 只有1位；或者3位都有值才会执行; 必须有第一位基准日期
      if (!min[0] || min.length === 2) return null
      if (!max[0] || max.length === 2) return null
      // let minFuncs = [], maxFuncs = [];
      // // for(let state in min) {}
      if (min && min.length && min[0]) {
        const aTimeFunc = getCurTime(min[0])
        console.log('aTimeFunc:', aTimeFunc)
      }
      // return function (time) {}
    }
  }
}

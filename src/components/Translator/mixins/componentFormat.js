/* 所有录入组件私有属性的格式化转换 */

// import dayjs from 'dayjs'
// import { presetOptions } from '@/model/defaultConfig'

import { upperFirst } from 'lodash'

// const getCurTime = (flag) => {
//   const range = presetOptions[0]?.options || []
//   if (flag) {
//     return range.find(e => e.value === flag)?.valFunc
//   }
//   return null
// }
export default {
  methods: {
    /* @return 最终将配置的属性内容返回成引用组件接受的对象类型 */
    formatFormItem ({ tag, suffixSlotRender, preSlotRender }) {
      // console.info('tag是：', tag)
      // 对字段tag类型的方法处理
      const func = this[`format${upperFirst(tag)}Attrs`]
      // 对字段辅助配置的格式化
      const suffixRenderFunc = suffixSlotRender && suffixSlotRender.tag ? this.formatFormItem(suffixSlotRender) : {}
      const preSlotRenderFunc = preSlotRender && preSlotRender.tag ? this.formatFormItem(preSlotRender) : {}
      const formatRes = Object.assign({}, suffixRenderFunc, preSlotRenderFunc)
      if (func) {
        const resAttrs = func(...arguments)
        // console.log('格式化字段后结果:', resAttrs)
        // 请返回对象([属性key]: 属性value)，不返回则阻断
        return typeof resAttrs === 'object' ? { ...formatRes, ...resAttrs } : formatRes
      } else {
        return formatRes
      }
    },
    /* TODO 转换日期组件属性 */
    formatDateAttrs ({ disabledDate }) {
      const pickerOptions = {}
      // 禁止选择范围
      const { min, max } = disabledDate || {}
      if (min.length || max.length) {
        // 只有1位；或者3位都有值才会执行
        pickerOptions.disabledDate = (time) => this.transDateDisable(min, max).call(this, time)
      }

      return pickerOptions
    },
    /* TODO
    @retrun function pickerOptions.disabledDate取值
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
      // if (min && min.length && min[0]) {
      //   const aTimeFunc = getCurTime(min[0])
      //   // console.log('aTimeFunc:', aTimeFunc)
      // }
      // return function (time) {}
    },
    /** 转换按钮属性/行为
     * @param buttonList 按钮属性列表
     */
    formatButtonAttrs ({ buttonList }) {
      // console.log('转换Button:', buttonList)
      this.$nextTick(() => {
        buttonList.forEach(conf => {
          const el = this.customButtons.find(domEl => {
            // 获取按钮名称 btn_<随机100内数字>, 不可修改
            return domEl.getAttribute('id').match(/(btn_\d+)/ig)?.[0] === conf.name
          })
          // console.log('btnName:', conf.name)
          // console.log('el:', el)
          // console.log('btnConf:', conf)
          // 每个按钮存在多个行为
          for (const a of (conf?.actions || [])) {
            el.addEventListener(a.on, this.handleEvent.bind(this, a))
            // btn.addEventListener(a.on, (e) => this.handleEvent(btnConf, e))
          }
        })
        this.$forceUpdate()
      })
      return {
        // buttonList: newBtns
      }
    },
    handleEvent: function (action) {
      console.log('点击到了:', action)
      if (action?.eventName === 'notifyWindowEvent') {
        console.info('触发通知')
        // console.info('formData:', this.fullData, this.formDataCollect)
        window.parent.postMessage({
          [action.channelName]: {
            on: action.on,
            action,
            formData: this.fullData
          }
        }, '*')
      }
    }
  }
}

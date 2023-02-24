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
    formatFormItem ({ tag }) {
      const func = this[`format${upperFirst(tag)}Attrs`]
      if (func) {
        const resAttrs = func(...arguments)
        // console.log('执行后结果:', resAttrs)
        // 请返回对象([属性key]: 属性value)，不返回则阻断
        return typeof resAttrs === 'object' ? resAttrs : {}
      } else {
        return {}
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
    /* 转换按钮属性/行为 */
    formatButtonAttrs ({ buttonList }) {
      // console.log('转换Button:', buttonList)
      const ref = this.$refs.form
      this.$nextTick(() => {
        const btnEls = ref?.$el.getElementsByTagName('button')
        // console.log('isArray:', btnEls)
        // .test(/^ansoBtns/)
        const tBtnEls = Array.from(btnEls).filter(btn => /^ansoBtns/.test(btn?.getAttribute('id')))
        // console.log('find:', tBtnEls)
        tBtnEls.forEach(btn => {
          const btnName = btn?.getAttribute('id').match(/(btn_\d)/ig)?.[0]
          const btnConf = buttonList.find(item => item.name === btnName)
          // console.log('btnConf:', btnConf)
          if (btnConf?.actions) {
            // btnConf?.actions?.forEach(a => {
            //   btn.addEventListener(a.on, () => this.handleEvent(btnConf))
            // })
            // console.log('action---:', btnConf.actions)
            for (const a of btnConf.actions) {
              btn.addEventListener(a.on, this.handleEvent.bind(this, a))
              // console.info(btn)
              // btn.addEventListener(a.on, (e) => this.handleEvent(btnConf, e))
            }
          }
        })
        this.$forceUpdate()
      })
      return {
        // buttonList: newBtns
      }
    },
    handleEvent: function (action) {
      // console.log('点击到了:', action)
      // let eventName = ''
      if (action?.eventName === 'notifyWindowEvent') {
        console.info('触发通知')
        window.parent.postMessage({ [action.channelName]: action.on }, '*')
      }
    }
  }
}

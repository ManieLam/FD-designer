<template>
  <AnsoDataform
    ref="form"
    id="customForm"
    v-model="fullData"
    v-bind="formAttrs"
    :class="{'form-withFixed': formAttrs.buttonFixed}"
    :formFields="formFields"
    :buttonList="actButtons"
  ></AnsoDataform>
</template>
<script>
import { isEqual, cloneDeep, keyBy, pick, isEmpty } from 'lodash'
import { formatFormRules } from '@/utils/format.js'
import { channelEvent, validPostMesgToParent } from '../utils/eventBus'
// import button from '../mixins/button'
import relationMixin from '../mixins/relation'
import requireMixin from '../mixins/require'
import componentFormat from '../mixins/componentFormat'

// import { MessageBox } from 'element-ui'
// import { useEval } from '@/utils/request.js'
// MessageBox.zIndex = 2000
export default {
  name: 'FormTemp',
  mixins: [relationMixin, requireMixin, componentFormat],
  props: {
    config: {
      type: Object,
      default: () => ({})
    },
    isTest: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      formDataCollect: new Map(), // 存放所有数据集合 [key('methods_url'), data:<Object>]
      fullDataTemp: {},
      fullData: {}, // 当前选用的数据集
      formFields: [],
      relations: {}
    }
  },
  computed: {
    formItems () {
      return this.config?.body || []
    },
    // formFields (),
    formAttrs () {
      const { attrs } = this.config || {}
      return {
        ...attrs,
        labelWidth: `${attrs.labelWidth}px`,
        type: attrs.layout,
        disabled: attrs.readOnly,
        ...(attrs.layoutAttrs || {})
      }
    },
    // 需要发起异步搜索的字段
    remoteSearch () {
      return this.formItems.filter(field => field.filterAbleType === 'filterApi')
    },
    hasChangeData () {
      return !isEqual(this.fullData, this.fullDataTemp)
    },
    actButtons () {
      const buttons = cloneDeep(this.config?.buttons)
      return buttons.map(btn => {
        if (btn.name === 'reset') { btn.func = () => this.onFormReset(btn) }
        if (btn.name === 'cancel') { btn.func = () => this.onFormCancel(btn) }
        if (btn.name === 'submit') { btn.func = () => this.onFormSubmit(btn) }
        if (this.config?.attrs?.readOnly) { btn.disabled = true }
        return btn
      })
    },
    /* 所有自定义按钮 */
    customButtons () {
      if (this.$refs.form) {
        const btnEls = this.$refs.form?.$el.getElementsByTagName('button')
        return Array.from(btnEls).filter(btn => /^.*(ansoBtns|ansoForm)(?=.*(btn_\d+)).*$/ig.test(btn?.getAttribute('id')))
      } else {
        return []
      }
    },
    fieldObj () {
      return keyBy(this.formFields, 'name')
    },
    // 表单录入数据
    formData () {
      return pick(this.fullData, Object.keys(this.fieldObj))
    // },
    // fieldActions () {
    //   return this.config?.body.
    },
    fieldSpan () {
      const spanList = this.config.attrs?.layoutAttrs?.fieldSpan
      if (!spanList) return {}
      return keyBy(spanList, 'fieldKey')
    }
  },
  methods: {
    onFormChange () {
      // console.info(arguments)
      this.$emit('')
    },
    onFormValidate () {
      this.$refs.form.validate()
    },
    onClearValidate () {
      this.$refs.form.$refs.dataform.clearValidate()
    },
    onDestory () {},
    // 发起异步请求
    requireImmediateRemote () {
      const { actions } = this.config || {}
      if (actions?.immediateRemoteApi?.list?.length) {
        // TODO 设置规则后，根据规则发起请求
        /**
         * 并发：promise.all
         * 串行：队列 next
        */
        this.formatMultiRequire({
          requires: actions.immediateRemoteApi.list,
          rules: actions.immediateRemoteApi.rule
        })
      } else {
        this.setDefaultValue()
      }
    },
    // 内置的按钮重置函数
    doReset () {
      const { immediateRemoteApi } = this.config?.actions || {}
      if (immediateRemoteApi && !isEmpty(immediateRemoteApi?.list)) {
        this.requireImmediateRemote()
      } else {
        // 清空
        this.$refs.form.resetForm()
      }
    },
    onFormReset (btn) {
      //  && this.hasChangeData
      if (btn.tipBeforeAction) {
        // MessageBox.confirm
        this.$confirm(
          '检测到未保存的内容，是否确定当前操作？',
          `${btn.label}提醒`,
          {
            distinguishCancelAndClose: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            customClass: ['cancelMessageBox']
            // style: { zIndex: 9999 }
          })
          .then(confirm => {
            if (confirm) {
              this.doReset()
              window.parent.postMessage('onResetForm')
            }
          })
      } else {
        this.doReset()
      }
    },
    doCancel (btn) {
      this.$refs.form.resetForm()
      try {
        if (btn.returnBack) {
          if (this.$router) {
            this.$router.go(-1)
          } else {
            window.history.go(-1)
          }
        } else if (btn.closeDialog) {
          this.$emit('onCloseDialog')
          window.parent.postMessage('onCancelForm')
        }
      } catch (err) {
        console.warn('取消功能异常:', err)
      }
    },
    // 内置的按钮取消函数
    onFormCancel (btn) {
      if (btn.tipBeforeAction) {
        // MessageBox.confirm
        this.$confirm(
          '检测到未保存的内容，是否确定当前操作？',
          `${btn.label}提醒`,
          {
            distinguishCancelAndClose: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            customClass: 'checkCancelBox'
          })
          .then(confirm => {
            if (confirm) {
              console.info('confirm:', confirm, btn)
              this.doCancel(btn)
            }
          })
      } else {
        this.doCancel(btn)
        window.parent.postMessage('onResetForm')
      }
    },
    // 内置的按钮提交事件
    onFormSubmit (btn) {
      window.parent.postMessage('onSubmitForm', { data: this.fullData })
      if (btn.validate) {
        this.$refs.form.$refs.dataform.validate(valid => {
          if (valid && btn.funcApi) {
            // 修改为多数据源操作
            this.formatMultiRequire({
              requires: btn.funcApi.list,
              rules: btn.funcApi.rule
            })
          }
        })
      } else if (btn.funcApi) {
        // console.info('提交：', btn.funcApi)
        // this.$require(btn.funcApi).then(res => {
        //   // console.info('on after submit', res)
        //   this.$emit('onAfterSubmit', res)
        // })
        this.formatMultiRequire({
          requires: btn.funcApi.list,
          rules: btn.funcApi.rule
        })
      }
    },
    // 格式化透传属性: { [attr.attrKey]: {a: [value], b: [value]} }
    formatPassthroughAttrs (attrList, config) {
      return attrList.reduce((res, key) => {
        const curConfig = config[key] || {}
        const preRes = res[curConfig.attrKey] // 是否存在相同透传关键key
        res[curConfig?.attrKey] = Object.assign(preRes || {}, { [key]: curConfig.value })
        return res
      }, {})
    },
    formatFields () {
      return this.config?.body.map(config => {
        const hasPassthrough = config._passthroughAttrs && config._passthroughAttrs.length
        const privateAttrs = this.formatFormItem(config) || {}
        return {
          name: config.name,
          label: config.label,
          relation: config.optionRelationKey || null,
          form: Object.assign(
            config,
            {
              rules: formatFormRules(config.validate) || []
            },
            hasPassthrough ? this.formatPassthroughAttrs(config._passthroughAttrs, config) : {},
            // 进行该组件私有属性转换
            privateAttrs instanceof Object ? privateAttrs : {},
            // 对字段自定义占比格式化
            this.fieldSpan[config.key] ? pick(this.fieldSpan[config.key], ['colSpan', 'rowSpan']) : { colSpan: null, rowSpan: null }
          )
        }
      })
    },
    initPostMesgWithParent () {
      window.addEventListener('message', ({ data, origin }) => {
        // 只接受允许范围通道消息， TODO 允许指定域数据
        // 剔除非允许的通道消息
        const validChannels = Object.keys(data).filter(name => validPostMesgToParent.includes(name))
        validChannels.forEach(channel => {
          const cfunc = channelEvent[channel]
          // console.info('cfunc:', cfunc)
          if (cfunc && typeof cfunc === 'function') {
            // console.info('通道事件:', channel)
            cfunc.call(this, data[channel])
          }
        })
      }, false)
    },
    /* 对按钮类的事件绑定，按钮范围：表单/插槽辅助等 */
    initCustomButton () {
      // 非内定的按钮：bindEventListener===true
      const buttonList = this.actButtons.filter(btn => btn.bindEventListener)
      // console.info('buttonList:', buttonList)
      if (buttonList) {
        this.formatButtonAttrs({ buttonList })
      }
    }
  },
  created () {
    // 获取relation
    // this.getRelation()
  },
  mounted () {
    // 格式化字段
    this.formFields = this.formatFields()
    // 清除验证
    this.onClearValidate()
    // 获取relation
    this.getRelation()
    // 获取初次加载数据源
    this.requireImmediateRemote()
    // 初始化窗口通道
    this.initPostMesgWithParent()
    this.$nextTick(() => {
      // computed中读取ref具有延迟性，使用$nextTick
      this.initCustomButton()
    })
  }
}
</script>
<style lang="sass" scoped>
.form-withFixed
  transform: translate(0)
  height: 100vh
  ::v-deep .form-body_buttonlist > .button-align__fixed
    width: 100%
</style>

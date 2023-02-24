<template>
  <AnsoDataform
    ref="form"
    id="customForm"
    v-model="fullData"
    v-bind="formAttrs"
    :formFields="formFields"
    :buttonList="actButtons"
  ></AnsoDataform>
</template>
<script>
import { isEqual, cloneDeep, keyBy, pick } from 'lodash'
import { formatFormRules } from '@/utils/format.js'
import { validPostMesgToParent } from '../utils/tools'
// import button from '../mixins/button'
import relationMixin from '../mixins/relation'
import requireMixin from '../mixins/require'
import componentFormat from '../mixins/componentFormat'

import { MessageBox } from 'element-ui'
// import { useEval } from '@/utils/request.js'
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
      formDataCollect: new Map(), // [key('methods_url'), data:<Object>]
      fullDataTemp: {},
      fullData: {},
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
        disabled: attrs.readOnly
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
        if (this.config?.attrs?.readOnly) {
          btn.disabled = true
        }
        return btn
      })
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
      if (actions?.immediateRemoteApi) {
        // TODO 设置规则后，根据规则发起请求
        /**
         * 并发：promise.all
         * 串行：队列 next
        */
        this.formatMultiRequire({
          requires: actions.immediateRemoteApi.list,
          rules: actions.immediateRemoteApi.rule
        })
      }
    },
    // 内置的按钮重置函数
    doReset () {
      this.$refs.form.resetForm()
    },
    onFormReset (btn) {
      //  && this.hasChangeData
      if (btn.tipBeforeAction) {
        MessageBox.confirm(
          '检测到未保存的内容，是否确定当前操作？',
          `${btn.label}提醒`,
          {
            distinguishCancelAndClose: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          })
          .then(confirm => {
            if (confirm) {
              this.doReset()
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
        }
      } catch (err) {
        console.warn('取消功能异常:', err)
      }
    },
    // 内置的按钮取消函数
    onFormCancel (btn) {
      if (btn.tipBeforeAction) {
        MessageBox.confirm(
          '检测到未保存的内容，是否确定当前操作？',
          `${btn.label}提醒`,
          {
            distinguishCancelAndClose: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          })
          .then(confirm => {
            if (confirm) {
              console.info('confirm:', btn)
              this.doCancel(btn)
            }
          })
      } else {
        this.doCancel(btn)
      }
    },
    // 内置的按钮提交事件
    onFormSubmit (btn) {
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
            privateAttrs instanceof Object ? privateAttrs : {}
          )
        }
      })
    },
    initPostMesgFromParent () {
      window.addEventListener('message', ({ data, origin }) => {
        // 只接受允许范围通道消息， TODO 允许指定域数据
        // 剔除非允许的通道消息
        const validChannels = Object.keys(data).filter(name => validPostMesgToParent.includes(name))
        if (validChannels.length) {
          console.info('获取到其他窗口信息', data, origin)
        }
      }, false)
    }
  },
  created () {
    this.getRelation()
  },
  mounted () {
    this.formFields = this.formatFields()
    this.onClearValidate()
    this.requireImmediateRemote()
    this.initPostMesgFromParent()
  }
}
</script>

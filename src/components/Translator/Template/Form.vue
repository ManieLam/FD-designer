<template>
  <AnsoDataform
    ref="form"
    id="customForm"
    v-model="fullData"
    v-bind="formAttrs"
    :formFields="formFieds"
    :buttonList="actButtons"
  ></AnsoDataform>
</template>
<script>
import { isEqual, cloneDeep, keyBy, pick } from 'lodash'
import { formatFormRules, formatDefValFunc, getURLAll } from '@/utils/format.js'
// import button from '../mixins/button'
import relation from '../mixins/relation'
import { MessageBox } from 'element-ui'
// import { useEval } from '@/utils/request.js'
export default {
  name: 'FormTemp',
  mixins: [relation],
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
      fullDataTemp: {},
      fullData: {},
      relations: {}
    }
  },
  computed: {
    formItems () {
      return this.config?.fields || []
    },
    formFieds () {
      return this.config?.fields.map(config => {
        return {
          name: config.name,
          label: config.label,
          relation: config.optionRelationKey || null,
          form: Object.assign(
            config,
            {
              rules: formatFormRules(config.validate) || []
            }
          )
        }
      })
    },
    formAttrs () {
      const { attrs } = this.config?.form || {}
      return {
        ...attrs,
        labelWidth: `${attrs.labelWidth}px`,
        type: attrs.layout,
        disabled: attrs.readOnly
      }
    },
    // 需要发起异步搜索的字段
    remoteSearch () {
      return this.formItems.filter(field => field.filterAbleType === 'filterAbleAsyncFunc')
    },
    hasChangeData () {
      return !isEqual(this.fullData, this.fullDataTemp)
    },
    actButtons () {
      const buttons = cloneDeep(this.config?.form.buttons)
      return buttons.map(btn => {
        if (btn.name === 'reset') { btn.func = () => this.onFormReset(btn) }
        if (btn.name === 'cancel') { btn.func = () => this.onFormCancel(btn) }
        if (btn.name === 'submit') { btn.func = () => this.onFormSubmit(btn) }
        if (this.config?.form?.attrs?.readOnly) {
          btn.disabled = true
        }
        return btn
      })
    },
    fieldObj () {
      return keyBy(this.formFieds, 'name')
    },
    // 表单录入数据
    formData () {
      return pick(this.fullData, Object.keys(this.fieldObj))
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
    // 设置默认值
    setDefaultValue () {
      // this.fullData
      const keys = Object.keys(this.fieldObj)
      for (const field of keys) {
        // console.info('field:', field)
        const value = formatDefValFunc.call(this, this.fullData, this.formFieds, this.fieldObj[field]?.form)
        this.$set(this.fullData, field, value)
      }
    },
    // 发起异步请求
    getRemoteResource () {
      const { actions } = this.config?.form || {}
      if (actions?.immediateRemoteRequire) {
        this.$require({
          ...actions.immediateRemoteRequire,
          body: this.formatSubmitParams(actions.immediateRemoteRequire)
        })
          .then(res => {
            // console.info('初始化请求发起后:', res)
            this.fullDataTemp = res || {}
            this.fullData = res || {}
            // 受anso-ui，表单在赋值后触发校验
            this.$nextTick(() => {
              this.onClearValidate()
            })
            return res
          })
          .then(res => {
            this.setDefaultValue()
            // this.formatDefValFunc()
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
    formatBodyParams ({ body: bodyParams, datas = {} } = {}) {
      return Array.from(bodyParams).reduce((res, item) => {
        let value = null
        switch (item.varType) {
          case 'const':
            value = item.value; break
          case 'formData':
            value = this.formData[item.value]; break
          case 'fullData':
            value = this.fullData[item.value]; break
          case 'router':
            value = getURLAll.call(this, item.value); break
          case 'localstorage':
            // const storageData = localStorage.getItem(item.value)
            // console.log(typeof storageData)
            // value = JSON.parse(storageData)
            value = localStorage.getItem(item.value); break
        }
        res[item.key] = value
        return res
      }, {})
    },
    /**
     * @return body 数据 <Object>
     * TODO 多数据源转换
     * */
    formatSubmitParams ({ isFullDose, body = [] }) {
      const range = isFullDose ? this.fullData : this.formData
      const bodyParams = body && body.length ? this.formatBodyParams({ body, datas: range }) : {}
      return Object.assign({}, range, bodyParams)
    },
    // 内置的按钮提交事件
    onFormSubmit (btn) {
      console.log('on submit', btn)
      if (btn.validate) {
        this.$refs.form.$refs.dataform.validate(valid => {
          if (valid && btn.funcRemote) {
            this.$require({
              ...btn.funcRemote,
              body: this.formatSubmitParams(btn.funcRemote)
            }).then(res => {
              // console.info('on after submit', res)
              this.$emit('onAfterSubmit', res)
            })
          }
        })
      } else if (btn.funcRemote) {
        this.$require(btn.funcRemote).then(res => {
          // console.info('on after submit', res)
          this.$emit('onAfterSubmit', res)
        })
      }
    }
  },
  created () {
    this.getRelation()
  },
  mounted () {
    this.onClearValidate()
    this.getRemoteResource()
  }
}
</script>

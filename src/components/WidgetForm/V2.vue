<template lang="pug">
AnsoDataform(
  ref="form"
  id="customForm"
  v-model="fullData"
  v-bind="formAttrs"
  :formFields="formFields"
  :buttonList="actButtons")
  template(v-for="item in fieldList", v-slot:[item.name]="scoped")
    draggable.dragger-item.w-100(
      :key="item.name"
      v-model="fieldList"
      :group="{name: 'form', pull: true, put: true}"
      animation="150"
      :move="onMove"
      @add="handleWidgetAdd"
      @end="handleDragEnd")
      //- div.list-group-item(v-for="item in rows",:key="item.id") {{item.name}}
      //- AnsoDataform(v-bind="formSetting", :formFields="fields", :buttonList="buttonList")
      transition-group.widget-form-list.h-100(name="fade", tag="div", :key="item.name")
        component(:is="item.compTag", :key="item.name")
</template>
<script>
import { isEqual, cloneDeep, keyBy, pick } from 'lodash'
import { formatFormRules } from '@/utils/format.js'
import draggable from 'vuedraggable'
// import button from '../mixins/button'
// import relationMixin from '../mixins/relation'
// import requireMixin from '../mixins/require'

// import { MessageBox } from 'element-ui'
// import { useEval } from '@/utils/request.js'
export default {
  name: 'WidgetForm',
  // mixins: [relationMixin, requireMixin],
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
  components: {
    draggable
  },
  data () {
    return {
      formDataCollect: new Map(), // [key('methods_url'), data:<Object>]
      fullDataTemp: {},
      fullData: {},
      relations: {}
    }
  },
  computed: {
    fieldList: {
      get () {
        return this.config?.body
      },
      set (list) {
        this.$nextTick(() => {
          this.$emit('update', list)
        })
      }
    },
    // formItems () {
    //   return this.config?.body || []
    // },
    formFields () {
      return this.config?.body.map(config => {
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
      return this.fieldList.filter(field => field.filterAbleType === 'filterApi')
    },
    hasChangeData () {
      return !isEqual(this.fullData, this.fullDataTemp)
    },
    actButtons () {
      const buttons = cloneDeep(this.config?.buttons)
      return buttons.map(btn => {
        // if (btn.name === 'reset') { btn.func = () => this.onFormReset(btn) }
        // if (btn.name === 'cancel') { btn.func = () => this.onFormCancel(btn) }
        // if (btn.name === 'submit') { btn.func = () => this.onFormSubmit(btn) }
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
    }
  },
  methods: {
    onFormChange () {
      // console.info(arguments)
      this.$emit('')
    },
    // 拖拽到表单内部区域时候，需要通知外部转换field格式添加
    handleWidgetAdd (evt) {
      console.info('add:', evt)
      this.$emit('add', evt)
    },
    // onFormValidate () {
    //   this.$refs.form.validate()
    // },
    // onClearValidate () {
    //   this.$refs.form.$refs.dataform.clearValidate()
    // },
    onDestory () {},
    // 调整表单内顺序
    handleDragEnd (evt) {
      console.info('handleDragEnd', evt)
      const { newIndex, oldIndex } = evt
      if (newIndex !== oldIndex) {
        const temp = this.fieldList[newIndex]
        const origin = this.fieldList[oldIndex]
        this.fieldList.splice(newIndex, 1, origin)
        this.fieldList.splice(oldIndex, 1, temp)
      }
    },
    onMove (evt) {
      console.log('onMove:', evt)
    }
  },
  created () {
    // this.getRelation()
  },
  mounted () {
    // this.onClearValidate()
    // this.requireImmediateRemote()
  }
}
</script>

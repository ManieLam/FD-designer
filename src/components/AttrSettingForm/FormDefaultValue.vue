<template lang='pug'>
.box-content__inside
  //- 选择数据源
  el-select(v-model="dataForm", placeholder="请选择数据源")
    el-option(v-for="resource in resourceList", :key="resource", :label="resource.name") {{ resource.label }}
  el-radio-group(v-model="settingValue.valueType")
    el-radio(v-for="radio in valueTypeGroups", :key="radio.name", :label="radio.name") {{ radio.label }}
  //- 预设数据配置
  .content-item(v-if="settingValue.valueType==='isPreset'")
    el-select(v-model="settingValue.presetType", placeholder="请选择关联的数据类型")
      el-option-group(
        v-for="opt in presetOptions"
        :label="opt.label"
        :key="opt.label")
        el-option(v-for="item in opt.options", :key="item.value", v-bind="item")
          span(style="float: left") {{item.label}}
          span.m-l-8.color-text-secondary(style="float: right") {{item.meta}}
    //- 指定获取localstorage数据
    .additional-input.m-t-8(v-if="settingValue.presetType==='localStorage'")
      el-input(v-model="settingValue[settingValue.presetType]", placeholder="请填写localStorage指定的name, 只允许String类型")

    //- 指定获取地址栏数据
    .additional-input.d-flex-row-between.m-t-8(v-if="settingValue.presetType==='routerParams' || settingValue.presetType==='routerQuery'")
      el-input(v-model="settingValue[settingValue.presetType]", placeholder="请填写参数指定的名称")

    //- 指定表单内数据自定义运算
    .additional-input.m-t-8(v-if="settingValue.presetType==='customFunc'")
      CodeEditor(
        v-if="settingValue.presetType==='customFunc'"
        :value="String(settingValue.customFunc)"
        key="setValueByCustom"
        @change="formatFuncByStr")
        //- pre.code-editor-desc__pre(slot="code-pre") (data, fields, field) => {
        //- pre.code-editor-desc__suffix(slot="code-suffix") }
    //- 指定表单关联字段及指定关联字段行为影响，并在关联字段那边配置相应的行为
    .additional-input.m-t-8(v-if="settingValue.presetType==='customChainsField'")
      el-input(v-model="settingValue[settingValue.presetType]", placeholder="请填写指定的表单字段")
      span.color-secondary.font-size-small
        i.el-icon-info
        span 请在指定字段行为中配置处理事件
</template>

<script>
/** 默认值 */
import CodeEditor from '@/components/CodeEditor'
import { debounce } from 'lodash'
import { presetOptions } from '@/utils/defaultConfig.js'
// import { formatDefaultValueFunc } from '@/utils/format.js'
export default {
  name: 'FormDefaultValue',
  components: {
    CodeEditor
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    fullSetting: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      valueTypeGroups: [
        { label: '默认同名填值', name: 'isDefault', components: '' },
        { label: '关联数据', name: 'isPreset', components: '' }
      ],
      /* 预设数据可选项 */
      presetOptions,
      presetInputVal: {
        valueType: 'isDefault',
        presetType: '',
        // 本地缓存取值
        localStorage: '',
        // 时间类型
        localDate: '',
        localTime: '',
        localDay: '',
        localNextDay: '',
        localMonth: '',
        localYear: '',
        // 地址栏取值
        routerParams: '',
        routerQuery: '',
        // 自定义表单默认值方法
        customFunc: '',
        customChainsField: ''
        // customFuncPlaceholder: '\n return data[field.name]'
      },
      presetCustomFunc: '(data, fields, field) => {\n return data[field.name] \n}',
      // 数据源
      dataForm: '', // 默认值指定的数据源
      resourceList: [] // 数据源列表
    }
  },
  // filters: {
  //   filterPlaceholder (str) {
  //     const regexp = /\{[^}]+\}/g
  //     console.info(str)
  //     console.info(regexp.test(str))
  //     return str
  //   }
  // },
  computed: {
    settingValue: {
      get () {
        return this.presetInputVal
      },
      set (values) {
        // console.info('set value', values)
        this.presetInputVal = values
      }
    }
  },
  watch: {
    'fullSetting.name': {
      immediate: true,
      handler (name, oldName) {
        if (name !== oldName) {
          // console.info('set default')
          const reDef = this.value.presetType === 'customFunc' && !this.value.customFunc ? this.presetCustomFunc : null
          this.presetInputVal = this.value
          if (reDef) {
            this.presetInputVal.customFunc = reDef
          }
          // console.info('--', this.presetInputVal)
          // this.value.presetType === 'customFunc' && !this.value.customFunc ? { customFunc: this.presetOptions?.[3]?.options?.[0]?.valFunc } : {}
        }
      }
    },
    settingValue: {
      deep: true,
      handler: debounce(function (value) {
        this.$emit('input', value)
      }, 800)
    }
  },
  methods: {
    formatFuncByStr: debounce(function (str) {
      // console.info('formatFunByStr', str)
      this.settingValue.customFunc = str
      // this.settingValue.customFunc = function (data, fields, field) {
      //   // const ruleStr = `(data, fields, field) => {\n ${str} \n}`
      //   useEval(str, (func) => func(data, fields, field))
      // }
    }, 800)
  // },
  // mounted () {
  //   this.presetInputVal = this.value
  }

}
</script>

<style lang='sass' scoped>

</style>

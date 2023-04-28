<template lang='pug'>
.form-button-wrap
  AttrSettingForm.attr-wrap(
    :value="currentConfig"
    :attrs="formButtonAttr"
    @update="update"
    @updateAnAttr="updateAnAttr")

  .button-list
    .secondary-text.p-b-8(style="color:#606266;") 按钮列表
    FormButtonList(
      v-bind="$attrs"
      @change="$emit('change', $event)")

    //- 考虑步骤性质的表单，提交不一定是异步提交
    .footer-wrap.w-100.text-center.m-t-8

</template>

<script>
/** 表单按钮配置
 * 是根据ansoDataform指定的关于按钮属性配置: buttonList， buttonAlign，buttonFixed
 * */
// import { button as buttonConfig } from '@/model/componentAttrs.js'
import { formButtonAttr } from '@/model/formAttrs.js'
// import { formButtons } from '@/model/defaultConfig'
// import { keyBy, isEqual, cloneDeep } from 'lodash'
import FormButtonList from './ButtonList'
import AttrSettingForm from '@/components/AttrSettingForm'
export default {
  name: 'FormButtonSetting',
  components: {
    FormButtonList,
    AttrSettingForm
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      formButtonAttr
    }
  },
  watch: {
  },
  computed: {
    currentConfig: {
      get () {
        return this.value
      },
      set (config) {
        this.$emit('input', config)
      }
    }
  },
  methods: {
    update () {
      console.log('update:', arguments)
    },
    updateAnAttr () {
      console.log('1', arguments)
    }
  },
  mounted () {
  }
}
</script>

<style lang='sass' scoped>
// .list-item + .list-item
//   margin-top: 8px
.button-list-item
  margin-top: 4px

// .list-item-comp
//   flex: 1

</style>

<template lang='pug'>
//- AnsoDataform(v-bind="formSetting", :formFields="fields", :buttonList="buttonList", key="form")
.widget-form-container
  .empty-wrap.color-secondary.text-center(v-if="!fieldList.length") 支持拖拽元素进入
  el-form.widget-form-wrap(
    v-else
    ref="form"
    v-bind="formConfig"
    :class="{'is-active-form': selectItem === 'form'}"
    :rules="rules"
    :model="formData"
    :label-width="`${formAttrs.labelWidth}px`"
    :label-position="formAttrs.labelPosition"
    :disabled="formAttrs.readOnly"
    @click.native="onClick({ type: 'form', data: formAttrs })")
    Draggable.list-group.drag-page-container(
      v-model="fieldList"
      animation="150")
      transition-group(name="fade" tag="div" class="widget-form-list")
        .widget-form-item-wrap(v-for="(ele, index) in fieldList", :key="ele.key")
          WidgetFormItem.widget-form-item(
            v-if="ele && ele.compTag"
            v-on="$listeners"
            v-model="formData[ele.name]"
            :class="{'is-active': formItemConfig.name === ele.key}"
            :keyName="ele.key"
            :name="ele.key"
            :compTag="ele.compTag"
            :index="index"
            :config="ele"
            @click.native.stop="onClick({ type: 'component', data: ele })")
          .tool-wrap
            .cursor-pointer.el-icon-delete(@click="$emit('remove', ele, index)")

    el-form-item.m-t-16.widget-form-item(@click.native.stop="onClick({ type: 'button', data: buttonList })")
      el-button(
        v-for="button in buttonList"
        v-bind="button"
        :key="button.name"
        @click="onButtonClick(button)") {{ button.label }}

</template>

<script>
/**
 * 默认只支持常规表单
 * TODO 支持表单多种布局
 */
import { isEmpty } from 'lodash'
import { formatFormRules } from '@/utils/format.js'
import Draggable from 'vuedraggable'
import WidgetFormItem from './WidgetFormItem'
export default {
  name: 'WidgetForm',
  props: {
    fields: {
      type: Array,
      default: () => ([])
    },
    added: {
      type: Object,
      default: () => ({})
    },
    formConfig: {
      type: Object,
      default: () => ({})
    },
    formItemConfig: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    Draggable,
    WidgetFormItem
  },
  data () {
    return {
      // formAttrs: {},
      // fieldList: this.fields,
      // fields: [],
      selectItem: '',
      formData: {}
    }
  },
  computed: {
    buttonList () {
      return this.formConfig.buttons || []
    },
    fieldList: {
      get () {
        return this.fields
      },
      set (list) {
        this.$nextTick(() => {
          this.$emit('update', list)
        })
      }
    },
    formAttrs () {
      return this.formConfig?.attrs || {}
    },
    rules () {
      /* 如果做要同步视图的校验，计算比较多, 这里采用手动点击预览 或 保存后刷新查看结果 */
      return this.fieldList.reduce((obj, field) => {
        const rules = field.validate
        if (!!rules && (!isEmpty(rules.isRequired) || !isEmpty(rules.isRegexp) || !!rules.isValidator)) {
          return {
            ...obj,
            [field.name]: formatFormRules(rules)
          }
        } else {
          return obj
        }
      }, {})
    }
  },
  // filters: {
  //   setFormitemConfig (set, fset) {
  //     // 表单子元素的属性配置在vuex中已经读取
  //     // const customSet = omit(fset, ['labelWidth', 'keepAliveData', 'layout', 'title'])
  //     // return merge(set, {
  //     //   readOnly: fset.readOnly
  //     // })
  //     return set
  //   }
  // },
  methods: {
    onButtonClick (button) {
      if (button.func) {
        button.func()
      }
    },
    onClick ({ type, data }) {
      this.selectItem = type === 'component' ? data.key : type
      this.$emit('onSelect', { type, data })
    },
    setFormitemAttrs () {},
    setFormAttrs () {}
  },
  mounted () {
    // this.formData = this.fieldList.reduce((res, field) => {
    //   return { ...res, [field.name]: field.defaultValue || null }
    // }, {})
  }
}
</script>

<style lang='sass' scoped>
.widget-form-container
  position: relative
  .empty-wrap
    position: absolute
    top: 50%
    left: 50%
    transform: translate3d(-50%, -50%, 0)
.widget-form-wrap
  padding: 8px
  border: 1px dashed #f5f5f5
  &:hover
    border: 1px dashed #0A4078
.widget-form-item-wrap
  padding-bottom: 0
  position: relative
  &:hover
    .tool-wrap
      display: block
      color: #0A4078
  .tool-wrap
    position: absolute
    right: 0
    bottom: 0
    z-index: 2
    display: none
    background: rgba(255,255,255,0.8)
    padding: 2px

.widget-form-item
  border: 1px solid #f5f5f5
  padding: 8px
  &:hover
    border: 1px dashed #0A4078
    background: rgb(87, 168, 206, 0.2)
.is-active
  border: 1px dashed #0A4078
  background: rgb(87, 168, 206, 0.2)
.is-active-form
  border: 1px dashed #0A4078
</style>

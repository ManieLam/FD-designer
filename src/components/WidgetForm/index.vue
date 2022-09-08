<template lang='pug'>
//- AnsoDataform(v-bind="formSetting", :formFields="fields", :buttonList="buttonList", key="form")
.widget-form-container
  .empty-wrap.color-secondary.text-center(v-if="!fieldList.length") 支持拖拽元素进入
  el-form(
    v-else
    v-bind="formConfig"
    :label-width="`${formAttrs.labelWidth}px`"
    :label-position="formAttrs.labelPosition"
    :disabled="formAttrs.readOnly")
    Draggable.list-group.drag-page-container(
      v-model="fieldList"
      animation="150")
      transition-group(name="fade" tag="div" class="widget-form-list")
        .widget-form-item-wrap(v-for="(ele, index) in fieldList", :key="ele.name")
          WidgetFormItem.widget-form-item(
            v-if="ele && ele.compTag"
            :class="{'is-active': formItemConfig.name === ele.name}"
            :name="ele.name"
            :compTag="ele.compTag"
            :index="index"
            :config="ele|setFormitemConfig(formConfig.attrs)"
            @click.native="$emit('onSelect', ele)")
          .tool-wrap
            .cursor-pointer.el-icon-delete(@click="$emit('remove', ele, index)")

    el-form-item.m-t-16.widget-form-item
      el-button(
        v-for="button in buttonList"
        v-bind="button"
        :key="button.name"
        @click="button.func") {{ button.label }}

</template>

<script>
/**
 * 默认只支持常规表单
 * TODO 支持表单多种布局
 */
import { merge, omit } from 'lodash'
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
      buttonList: [
        { label: '取消', name: 'cancel', func: () => {} },
        { label: '提交', name: 'submit', type: 'primary', func: () => {} }
      ]
    }
  },
  computed: {
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
    }
  },
  filters: {
    setFormitemConfig (set, fset) {
      // 表单子元素的属性配置在vuex中已经读取
      const customSet = {
        form: {
          ...omit(fset, ['labelWidth'])
        }
      }
      // labelHidden， labelWidth， errorToptip
      // return mergeWith(set, customSet, (objValue, srcValue) => {
      // })
      return merge(set, customSet)
    }
  },
  methods: {
    setFormitemAttrs () {},
    setFormAttrs () {}
  }
}
</script>

<style lang='sass' scoped>
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
</style>

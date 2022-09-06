<template lang='pug'>
//- AnsoDataform(v-bind="formSetting", :formFields="fields", :buttonList="buttonList", key="form")
.widget-form-container
  .empty-wrap(v-if="!fieldList.length") 支持拖拽元素进入
  el-form(v-else, v-bind="formConfig")
    Draggable.list-group.drag-page-container(
      v-model="fieldList"
      group="form-inside")
      transition-group(name="fade" tag="div" class="widget-form-list")
        template(v-for="(ele, index) in fieldList")
          WidgetFormItem.widget-form-item(
            v-if="ele && ele.compTag"
            :key="ele.name"
            :name="ele.name"
            :compTag="ele.compTag"
            :index="index"
            :config="ele"
            @click.native="$emit('onSelect', ele)")
    el-form-item
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
// import { isEqual, difference } from 'lodash'
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
    }
  },
  components: {
    Draggable,
    WidgetFormItem
  },
  data () {
    return {
      formSetting: {},
      fieldList: this.fields,
      // fields: [],
      buttonList: [
        { label: '取消', name: 'cancel', func: () => {} },
        { label: '提交', name: 'submit', type: 'primary', func: () => {} }
      ]
      // formItemTags: {
      //   AnsoDataformText: 'text',
      //   AnsoDataformInput: 'input',
      //   AnsoDataformTextRange: 'textRange',
      //   AnsoDataformNumber: 'number',
      //   AnsoDataformNumRange: 'numberRange',
      //   AnsoDataformSelect: 'select',
      //   AnsoDataformSwitch: 'switch',
      //   AnsoDataformSlider: 'slider',
      //   AnsoDataformCheckbox: 'checkbox',
      //   AnsoDataformRadio: 'radio',
      //   AnsoDataformCascader: 'cascader',
      //   AnsoDataformTime: 'time',
      //   AnsoDataformTimeRange: 'timeRange',
      //   AnsoDataformDate: 'date',
      //   AnsoDataformUpload: 'file',
      //   // AnsoDataformIcon: 'icon',
      //   InfoRender: 'render',
      //   AnsoButtonGroup: 'button',
      //   AnsoLink: 'link',
      //   AnsoDataformTransfer: 'transfer',
      //   AnsoDataformTree: 'tree'
      // }
    }
  },
  watch: {
    fields: {
      deep: true,
      handler (list) {
        this.fieldList = list
      }
    }
  }
}
</script>

<style lang='sass' scoped>
.widget-form-item
  border: 1px solid #f5f5f5
  padding: 8px
  &:hover
    border: 1px dashed #0A4078
    background: rgb(87, 168, 206, 0.2)
</style>

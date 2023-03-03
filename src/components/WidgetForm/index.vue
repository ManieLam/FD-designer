<template lang='pug'>
//- AnsoDataform(v-bind="formSetting", :formFields="fields", :buttonList="buttonList", key="form")
.widget-form-container
  .empty-wrap.color-secondary.text-center(v-if="!fieldList.length") 支持拖拽元素进入
  el-form.widget-form-wrap(
    v-else
    ref="form"
    v-bind="formConfig"
    :class="[{'is-active-form': selectItem === 'form'}, `form-layout-${formAttrs.layout}`]"
    :rules="rules"
    :model="formData"
    :label-width="`${formAttrs.labelWidth}px`"
    :label-position="formAttrs.labelPosition"
    :disabled="formAttrs.readOnly"
    @click.native="onClick({ type: 'form', data: formAttrs })")
    Draggable.list-group.drag-page-container(
      :value="fieldList"
      group="form"
      animation="150"
      @add="handleWidgetAdd"
      @end="handleDragEnd")
      //- AnsoFormBody(
      //-   class="widget-form-list"
      //-   v-bind="formAttrs"
      //-   v-on="$listeners"
      //-   :type="formAttrs.layout"
      //-   :formProps="_props"
      //-   :formFields="fieldListFormat"
      //-   :formData="formData")
      transition-group(
        name="fade"
        tag="div"
        class="widget-form-list"
        :label-position="formAttrs.labelPosition")
        .widget-form-item-wrap(
          v-for="(ele, index) in fieldList"
          :key="ele.key"
          :is-border="formAttrs.border !== false"
          :class="{'is-active': selectItem === ele.key || (!selectItem && formItemConfig.key === ele.key) }"
          @click.stop.prevent="onClick({ type: 'component', data: ele })")
          WidgetFormItem.widget-form-item(
            v-if="ele && ele.compTag"
            v-on="$listeners"
            :key="ele.key"
            :value="ele"
            :keyName="ele.key"
            :name="ele.key"
            :compTag="ele.compTag"
            :index="index"
            :scopedSlots="$scopedSlots"
            @input="changeItem($event, index)")
          .tool-wrap(v-if="!(ele.preSlotRender || ele.suffixSlotRender)")
            .cursor-pointer.el-icon-delete(@click.prevent.stop="$emit('remove', ele, index)")

    el-form-item.m-t-16.widget-form-item(
      :class="{'is-active': selectItem === 'button'}"
      @click.native.stop="onClick({ type: 'button', data: formConfig.buttons })")
      el-button(
        v-for="button in formConfig.buttons"
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
      selectItem: this.formItemConfig?.key,
      // buttonList: [],
      formData: {}
    }
  },
  computed: {
    // 暂失效
    buttonList () {
      // console.log('widgetForm 改变button')
      return this.formConfig?.buttons || []
      // return this.$store.state.canvas.canvas[this.canvasName]
    },
    fieldList: {
      get () {
        return this.fields
      },
      set (list) {
        this.$nextTick(() => {
          console.info('isupdate')
          this.$emit('update', list)
        })
      }
    },
    // 暂失效
    formAttrs () {
      return this.formConfig?.attrs || {}
    },
    rules () {
      /* 如果做要同步视图的校验，计算比较多, 这里采用手动点击预览 或 保存后刷新查看结果 */
      return this.fieldList.reduce((obj, field) => {
        const rules = field?.validate
        if (!!rules && (!isEmpty(rules.isRequired) || !isEmpty(rules.isRegexp) || !!rules.isValidator)) {
          return {
            ...obj,
            [field.name]: formatFormRules(rules)
          }
        } else {
          return obj
        }
      }, {})
    },
    fieldListFormat () {
      return this.fields.map(config => {
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
      if (button.func && typeof button.func === 'function') {
        button.func()
      }
    },
    onClick ({ type, data }) {
      this.selectItem = type === 'component' ? data.key : type
      this.$emit('onSelect', { type, data })
    },
    // 拖拽到表单内部区域时候，需要通知外部转换field格式添加
    handleWidgetAdd (evt) {
      this.$emit('add', evt)
    },
    // 调整表单内顺序
    handleDragEnd (evt) {
      // console.info('handleDragEnd', evt)
      const { newIndex, oldIndex } = evt
      if (newIndex !== oldIndex) {
        const temp = this.fieldList[newIndex]
        const origin = this.fieldList[oldIndex]
        this.fieldList.splice(newIndex, 1, origin)
        this.fieldList.splice(oldIndex, 1, temp)
      }
    },
    setFormitemAttrs () {},
    setFormAttrs () {},
    changeItem (conf, index) {
      // console.info('改变元素')
      this.$set(this.fieldList, index, conf)
      // this.$emit('update', this.fieldList)
    }
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
  border: 1px dashed $--form-divider-border-color
  &:hover
    border: 1px dashed #0A4078
.widget-form-item-wrap
  padding-bottom: 0
  position: relative
  border: 1px dashed $--form-divider-border-color // TODO 修改为isBorder
  // padding: 1px
  &:hover
    border: 1px dashed #0A4078 !important
    background: rgb(87, 168, 206, 0.2)
    .tool-wrap
      display: block
      color: #0A4078
  &.is-active
    border: 1px dashed #0A4078
    background: rgb(87, 168, 206, 0.2)
  .tool-wrap
    position: absolute
    right: 0
    bottom: 0
    z-index: 2
    display: none
    background: rgba(255,255,255,0.8)
    padding: 2px
    // display: block
// .widget-form-item
//   border: 1px solid $--form-divider-border-color // TODO 修改为isBorder
//   padding: 8px
//   &:hover
//     border: 1px dashed #0A4078
//     background: rgb(87, 168, 206, 0.2)

.is-active-form
  border: 1px dashed #0A4078

</style>

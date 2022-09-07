<template lang='pug'>
.setting-form-wrap
  el-collapse.setting-wrap(v-model="activeNames")
    el-collapse-item.label.m-b-8.primary-text(title="属性配置", name="attr")
      AttrSettingForm(
        v-bind="$attrs"
        v-on="$listeners"
        v-model="attrsData"
        :attrs="attrs"
        :actions="actions")
    el-collapse-item.label.m-b-8.primary-text(title="行为配置", name="action")

</template>

<script>
/** */
import AttrSettingForm from './AttrSettingForm.vue'
import { debounce } from 'lodash'
export default {
  name: 'FormSetting',
  props: {
    canvas: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    AttrSettingForm
  },
  data () {
    return {
      activeNames: ['attr', 'action'],
      // 表单的默认属性设置
      data: {
        layout: 'default',
        labelHidden: false,
        labelWidth: 80,
        labelPosition: 'right',
        readonly: false,
        keepAliveData: true
      },
      attrsData: {},
      attrs: [
        {
          label: '是否只读',
          key: 'readonly',
          tag: 'el-switch'
        },
        {
          label: '表单标题',
          key: 'title',
          tag: 'el-input',
          placeholder: '请输入'
        },
        {
          label: '布局类型',
          readonly: true,
          key: 'layout',
          tag: 'AnsoDataformSelect',
          options: [{
            value: 'default',
            label: '默认'
          }, {
            value: 'grid',
            label: '网格',
            disabled: true
          }]
        },
        {
          label: '标签',
          key: 'label',
          group: [
            {
              label: '是否隐藏文本标签',
              key: 'labelHidden',
              tag: 'el-switch'
            },
            {
              label: '文本标签宽度',
              key: 'labelWidth',
              placeholder: '请输入数值',
              tag: 'el-input'
            },
            {
              label: '文本显示位置',
              key: 'labelPosition',
              tag: 'AnsoDataformSelect',
              options: [
                { label: '顶部对齐', value: 'top' },
                { label: '居左', value: 'left' },
                { label: '居右', value: 'right' },
                { label: '居中', value: 'center' }
              ]
            },
            {
              label: '辅助性提示',
              key: 'labelTip',
              tip: '带提示辅助性标签, 小图标在标签盘显示，hover显示辅助内容',
              tag: 'el-input'
            }
          ]
        },
        {
          label: '保留数据输入',
          key: 'keepAliveData',
          tag: 'el-switch'
        }
      ],
      actions: []
    }
  },
  watch: {
    canvas: {
      immediate: true,
      // deep: true,
      handler (canvas, oldData) {
        if (canvas) {
          const { form } = canvas
          this.attrsData = form?.attrs || this.data
          // this.data = form?.attrs || {}
        }
        // debounce(() => {
        //   this.$emit('change', 'form', data)
        // }, 1000)
      }
    },
    attrsData: {
      immediate: true,
      deep: true,
      handler: debounce(function (value, oldValue) {
        console.info('attrs watch:', value)
        this.$emit('change', 'form', value)
      // console.info('attrs watch:', value, oldValue)
      // if (!isEqual(value, oldValue)) {
      //   console.info('changeAttrs')
      //   debounce(() => {
      //     this.$emit('change', 'form', value)
      //   }, 1000)
      // }
      }, 1000)
    }
  }
  // computed: {
  //   attrsData: {
  //     get () {
  //       console.info('get attrsData--- ')
  //       return this.data
  //     },
  //     set () {

  //     }
  //   }
  // // },
  // // updated () {
  // //   console.info('表单设置区 更新')
  // }
}
</script>

<style lang='sass' scoped>
.setting-wrap
  border: 0
</style>

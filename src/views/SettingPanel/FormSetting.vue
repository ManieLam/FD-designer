<template lang='pug'>
.setting-form-wrap
  el-collapse.setting-wrap(v-model="activeNames")
    el-collapse-item.collapse-item(title="属性配置", name="attr")
      AttrSettingForm(
        v-bind="$attrs"
        v-on="$listeners"
        :value="attrsData"
        :attrs="attrs"
        @input="getAttrs")
    el-collapse-item.collapse-item(title="行为配置", name="action")
      //- el-button(@click="toggleSource") 配置表单数据源
      //- .column-name
      .action-setting-wrap
        .row-item
          el-checkbox(v-model="isRelationAction") 配置表单通用字典
          form-list.box-content__inside(
            v-model="relationList"
            :draggable="false"
            :columnProps="relationProps")
</template>

<script>
/** */
import AttrSettingForm from '@/components/AttrSettingForm'
import { isEmpty } from 'lodash'
export default {
  name: 'FormSetting',
  props: {
    canvas: {
      type: Object,
      default: () => ({})
    },
    canvasName: {
      type: String
    }
  },
  components: {
    AttrSettingForm
  },
  data () {
    return {
      activeNames: ['attr', 'action'],
      attrsData: {},
      attrs: [
        {
          label: '是否只读',
          key: 'readOnly',
          tag: 'el-switch'
        },
        {
          // Anso-ui没有支持表单标题展示
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
            // {
            //   label: '是否隐藏文本标签',
            //   key: 'labelHidden',
            //   tag: 'el-switch'
            // },
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
            // },
            // {
            //   label: '辅助性提示',
            //   key: 'labelTip',
            //   tip: '带提示辅助性标签, 小图标在标签盘显示，hover显示辅助内容',
            //   tag: 'el-input'
            }
          ]
        },
        {
          label: '保留数据输入',
          key: 'keepAliveData',
          tag: 'el-switch'
        }
      ],
      /* 配置字典 */
      isRelationAction: false, // 是否开启配置字典
      relationList: [],
      relationProps: [
        { label: '字典关键值', prop: 'name' },
        { label: '字典名', prop: 'label' }
      ], // 字典选项
      actions: [],
      actionsData: {}
    }
  },
  watch: {
    'canvas.form': {
      immediate: true,
      // deep: true,
      handler (form, oldData) {
        if (form) {
          // console.info('form change--', form)
          this.attrsData = !form?.attrs || isEmpty(form.attrs) ? { ...this.$defVal?.formAttrs } : form?.attrs
          this.actionsData = !form.actions || isEmpty(form.actions) ? {} : form.actions
        }
      }
    },
    relationList (list) {
      this.changeRelation(list)
    }
  },
  methods: {
    getAttrs (attrs) {
      this.setFormState({ attrs: attrs })
    },
    setFormState ({ attrs, actions }) {
      this.$store.commit('canvas/updateConfig', {
        name: this.canvasName,
        attrs,
        actions
      })
    },
    changeRelation (list = []) {
      // this.$set(this.actionsData, 'relationList', list)
      this.actionsData.relationList = list
      // this.setFormState({ actions: this.actionsData })
      this.$store.commit('canvas/updateActions', {
        name: this.canvasName,
        actions: this.actionsData
      })
    }
  }
}
</script>

<style lang='sass' scoped>
.setting-wrap
  border: 0
.collapse-item
  ::v-deep >div:first-child > .el-collapse-item__header
    color: $--color-primary
  &.is-active ::v-deep >div:first-child > .el-collapse-item__header
    border-bottom: 1px dotted $--border-active
    // &.is-active
      // box-shadow: 0 0 1px 5px #ddd
  ::v-deep .el-collapse-item__content
    padding-bottom: 0
</style>

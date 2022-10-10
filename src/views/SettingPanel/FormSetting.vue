<template lang='pug'>
.setting-form-wrap
  .secondary-text(v-if="!canvas || !canvas.form") 请先拖拽组件, 再做操作
  el-collapse.setting-wrap(v-model="activeNames", v-else)
    el-collapse-item.collapse-item(title="属性配置", name="attr")
      AttrSettingForm(
        v-bind="$attrs"
        v-on="$listeners"
        :value="attrsData"
        :attrs="attrs"
        @update="update")
    el-collapse-item.collapse-item(title="行为配置", name="action")
      //- el-button(@click="toggleSource") 配置表单数据源
      //- .column-name
      .action-setting-wrap.m-t-8
        .color-text-primary.font-size-base 表单初始化时
        .row-item
          el-checkbox(v-model="actionsData.getRelationImmediate") 是否加载字段字典
        .row-item
          el-checkbox(v-model="actionsData.getResourceImmediate") 是否发起请求
          .list-async.box-content__inside(
            v-if="actionsData.getResourceImmediate")
            //- 动态配置数据源
            el-button(@click="setRemoteVisable = !setRemoteVisable") {{ immediateRemoteRequire.name ? '重新选择数据源' : '配置数据源' }}
            .list-column__default.m-t-4(v-show="immediateRemoteRequire.name")
              .left-wrap
                .d-flex-v-center
                  i.el-icon-check.color-primary.m-r-8
                  .color-warning {{immediateRemoteRequire.method}}
                  .secondary-text.m-l-8 {{immediateRemoteRequire.url}}
                .color-text-secondary.font-size-small.m-l-8 {{ immediateRemoteRequire.demo || ''}}
              .right-wrap
            RemoteSettingRequire(
              key="formRequire"
              title="配置表单首次加载数据源"
              v-model="setRemoteVisable"
              :chosenData="immediateRemoteRequire"
              @chosen="getAsyncSeting")
</template>

<script>
/** 表单配置区 */
import AttrSettingForm from '@/components/AttrSettingForm'
import RemoteSettingRequire from '@/components/RemoteSetting/Require'
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
    AttrSettingForm,
    RemoteSettingRequire
  },
  data () {
    return {
      activeNames: ['attr', 'action'],
      attrsData: {},
      attrs: [
        {
          label: '是否只读',
          key: 'readOnly',
          tag: 'el-checkbox',
          options: [{
            value: true,
            label: '开启'
          }]
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
          tag: 'el-checkbox',
          options: [{
            value: true,
            label: '开启'
          }]
        }
      ],
      /* 配置字典 */
      // isRelationAction: true, // 是否开启配置字典
      // relationList: [],
      relationProps: [
        { label: '字典关键值', prop: 'name' },
        { label: '字典名', prop: 'label' }
      ], // 字典选项
      actions: [],
      actionsData: {},
      setRemoteVisable: false
    }
  },
  watch: {
    canvas (obj) {
      // console.info('canvas change---', obj)
    },
    'canvas.form': {
      immediate: true,
      // deep: true,
      handler (form, oldData) {
        // console.info('form change--', form)
        if (form) {
          this.attrsData = !form?.attrs || isEmpty(form.attrs) ? { ...this.$defVal?.formAttrs } : form?.attrs
          this.actionsData = !form.actions || isEmpty(form.actions) ? {} : form.actions
          this.relationList = form?.actions?.relationList || []
        } else {
          this.actionsData = {}
          this.attrsData = { ...this.$defVal?.formAttrs }
          this.relationList = []
        }
      }
    }
    // isRelationAction (flag) {
    //   if (!flag) this.relationList = []
    // },
    // relationList (list) {
    //   this.changeRelation(list)
    // }
  },
  computed: {
    immediateRemoteRequire: {
      get () {
        return this.actionsData.immediateRemoteRequire || {}
      },
      set (datas) {
        // this.actionsData.immediateRemoteRequire = datas
        this.$set(this.actionsData, 'immediateRemoteRequire', datas)
        this.setFormState({ actions: this.actionsData })
      }
    }
  },
  methods: {
    update (attrs) {
      this.setFormState({ attrs: this.attrsData })
    },
    setFormState ({ attrs = null, actions = null }) {
      this.$store.commit('canvas/updateConfig', {
        name: this.canvasName,
        attrs,
        actions
      })
    // },
    // changeRelation (list = []) {
    //   console.info('更改relation:', list)
    //   // this.$set(this.actionsData, 'relationList', list)
    //   // this.actionsData.relationList = list
    //   // this.setFormState({ actions: this.actionsData })
    //   this.$store.commit('canvas/updateActions', {
    //     name: this.canvasName,
    //     actions: this.actionsData
    //   })
    },
    getAsyncSeting (data) {
      this.immediateRemoteRequire = data
    },
    getAttrUpdate (data) {
      console.info('getAttrUpdate:', data)
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

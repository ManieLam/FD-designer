<template lang='pug'>
.setting-form-wrap
  .secondary-text(v-if="!canvas || !canvas.form") 请先拖拽组件, 再做操作
  .setting-wrap(v-else)
    el-tabs.setting-tab(v-model="activeName", :stretch="true")
      el-tab-pane.tab-component(
        v-for="tab in tabList"
        :key="tab.name"
        :name="tab.name"
        :label="tab.label")
        //- 设置表单属性
        AttrSettingForm(
          v-show="activeName==='attr'"
          v-bind="$attrs"
          v-on="$listeners"
          :value="attrsData"
          :attrs="attrs"
          @update="update")
        //- 设置表单行为
        .action-setting-wrap.m-t-8(v-show="activeName==='action'")
          //- 表单初始化时
          .setting-block
            .color-text-primary.font-size-base.m-b-8 表单初始化时
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
          //- 配置表单按钮操作
          .setting-block
            .color-text-primary.font-size-base.m-b-8 操作按钮
            .row-item
              ButtonSetting(:key="canvasName", :list="buttonList", @change="updateButtons")

</template>

<script>
/** 表单配置区 */
import AttrSettingForm from '@/components/AttrSettingForm'
import ButtonSetting from './ButtonSetting'
import RemoteSettingRequire from '@/components/RemoteSetting/Require'
import formAttrs from '@/utils/formAttrs.js'
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
    ButtonSetting,
    RemoteSettingRequire
  },
  data () {
    return {
      tabList: [
        { label: '属性', name: 'attr' },
        { label: '行为', name: 'action' }
        // { label: '样式', name: 'style' }
      ],
      // activeNames: ['attr', 'action'],
      activeName: 'attr',
      // activeNames: ['attr', 'action'],
      attrsData: {},
      attrs: formAttrs,
      /* 配置字典 */
      // isRelationAction: true, // 是否开启配置字典
      // relationList: [],
      relationProps: [
        { label: '字典关键值', prop: 'name' },
        { label: '字典名', prop: 'label' }
      ], // 字典选项
      actions: [],
      actionsData: {},
      setRemoteVisable: false,
      buttonList: []
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
          this.buttonList = form?.buttons || []
        } else {
          this.actionsData = {}
          this.attrsData = { ...this.$defVal?.formAttrs }
          this.relationList = []
          this.buttonList = []
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
    togggleTab (name) {
      this.activeName = name
    },
    update (attrs) {
      this.setFormState({ attrs: this.attrsData })
    },
    updateButtons (buttons) {
      this.setFormState({ buttons })
    },
    setFormState ({ attrs = null, actions = null, buttons = null }) {
      this.$store.commit('canvas/updateConfig', {
        name: this.canvasName,
        attrs,
        actions,
        buttons
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

.setting-block + .setting-block
  margin-top: 10px
</style>

<template lang='pug'>
.setting-form-wrap
  .secondary-text.empty-text(v-if="!canvas || !canvas.form") 请先拖拽组件, 再做操作
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
          el-collapse(v-model="activeCollapse")
            //- 表单初始化时
            el-collapse-item.setting-block(title="表单初始化时", name="mounted")
              .row-item
                el-checkbox(v-model="actionsData.getRelationImmediate") 是否加载字段字典
                .row-item__input.box-content__inside
                  //- el-input(v-if="actionsData.getRelationImmediate", v-model="actionsData.relationApi", placeholder="输入字典接口")
                  form-remote(v-if="actionsData.getRelationImmediate", v-model="actionsData.relationApi")
                  .tip-text.m-l-8.secondary-text.m-t-8
                    i.icon.el-icon-info 请在对应的字段配置【属性/选项/动态字典】,否则不生效。

              .row-item.p-t-16
                el-checkbox(v-model="actionsData.getResourceImmediate") 获取初始化数据
                .row-item__remote.box-content__inside(v-if="actionsData.getResourceImmediate")
                  //- 前置触发条件：路由带参数（跳转进入）
                  .box-content
                    el-dropdown(split-button) 前置触发条件(TODO)
                      el-dropdown-menu.dropdown-item(name="byRoute", @click="getResourceWhen(byRoute)") 根据页面路由参数

                  //- 动态配置数据源
                  .box-content.m-t-8
                    form-remote-list(
                      v-if="!!actionsData.immediateRemoteApi"
                      v-model="actionsData.immediateRemoteApi"
                      key="immediateRemoteApi"
                      title="配置表单首次加载数据源")
            //- 配置表单按钮操作
            el-collapse-item.setting-block(title="操作按钮", name="button")
              ButtonSetting.row-item(:key="canvasName", :list="buttonList", @change="updateButtons")

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
      activeName: 'attr',
      attrsData: {},
      attrs: formAttrs,
      /* 配置字典 */
      relationProps: [
        { label: '字典关键值', prop: 'name' },
        { label: '字典名', prop: 'label' }
      ], // 字典选项
      actions: [],
      actionsData: {},
      setRemoteVisable: false,
      immediateRemotePrecondition: {},
      // immediateRemotePrecondition: {
      //   route
      // },
      activeCollapse: ['mounted'],
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
    immediateRemoteApi: {
      get () {
        return this.actionsData.immediateRemoteApi || []
      },
      set (datas) {
        // this.actionsData.immediateRemoteApi = datas
        this.$set(this.actionsData, 'immediateRemoteApi', datas)
        this.setFormState({ actions: this.actionsData })
      }
    }
  },
  methods: {
    togggleTab (name) {
      this.activeName = name
    },
    update (attrs) {
      console.info('修改表单属性：', this.attrsData)
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
      this.immediateRemoteApi = data
    },
    getAttrUpdate (data) {
      console.info('getAttrUpdate:', data)
    },
    getResourceWhen (type) {
      this.$set(this.actionsData, 'immediateRemotePrecondition', this.immediateRemotePrecondition)
    }
  }
}
</script>

<style lang='sass' scoped>
.setting-wrap
  border: 0

.setting-block
  // & + .setting-block
  //   margin-top: 16px
  > .label
    color: $--color-text-primary
    // font-size: 16px
    font-size: $--font-size-base
    margin-bottom: 8px
  // .color-text-primary.font-size-base.m-b-8
    &::after

.row-item + .row-item
  margin-top: 4px

.dropdown-item
  font-size: $--font-size-base
  color: $--color-text-primary
  padding-left: 16px
  padding-right: 16px
  cursor: pointer
  &:hover
    // background: $--bgcolor-secondary
    color: $--color-primary
.action-setting-wrap
  ::v-deep .el-collapse-item__content
    padding-bottom: 16px
</style>

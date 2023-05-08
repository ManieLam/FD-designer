<template lang='pug'>
.setting-form-wrap
  .secondary-text.empty-text(v-if="!canvas") 请先拖拽组件, 再做操作
  .setting-wrap(v-else)
    el-tabs.setting-tab(v-model="activeName", :stretch="true")
      el-tab-pane.tab-component(
        v-for="tab in tabList"
        :key="tab.name"
        :name="tab.name"
        :label="tab.label")
        //- 设置表单属性
      AttrSettingForm(v-show="activeName==='attr'"
        v-bind="$attrs"
        v-on="$listeners"
        :value="attrsData"
        :attrs="attrs"
        :canvas="canvas"
        @update="update")
      //- 设置表单行为
      .action-setting-wrap.m-t-8(v-show="activeName==='action'")
        el-collapse(v-model="activeCollapse")
          //- 表单初始化时
          el-collapse-item.setting-block(title="表单初始化时", name="mounted")
            .row-item
              el-checkbox(v-model="actionsData.getRelationImmediate") 是否加载字段字典
                el-tooltip(class="item", effect="dark", content="- 必须在需要匹配字典的字段属性中配置对应的字典名，位置【属性/选项/动态字典】。", placement="top-start")
                  i.icon.el-icon-info.m-l-4
              .row-item__input.box-content__inside
                //- el-input(v-if="actionsData.getRelationImmediate", v-model="actionsData.relationApi", placeholder="输入字典接口")
                form-remote(v-if="actionsData.getRelationImmediate", v-model="actionsData.relationApi")

            .row-item.p-t-16
              el-checkbox(v-model="actionsData.getResourceImmediate") 获取初始化数据
                el-tooltip(class="item", effect="dark", placement="top-start")
                  div(slot="content")
                    p - 支持多个接口。
                    p - 默认数据集：存在多个数据集合时，默认第一个请求数据为默认数据集，可修改默认指定。
                    p - 字段取值：非默认数据集的字段取值，请在字段属性中，指定数据集合。
                  i.icon.el-icon-info.m-l-4

              .row-item__remote.box-content__inside(v-if="actionsData.getResourceImmediate")
                //- 前置触发条件：路由带参数（跳转进入）
                .box-content
                  el-dropdown(split-button) 前置触发条件(TODO)
                    el-dropdown-menu.dropdown-item(name="byRoute", @click="getResourceTransBy(byRoute)") 根据页面路由参数

                //- 动态配置数据源
                .box-content.m-t-8
                  form-remote-list(
                    v-if="!!actionsData.immediateRemoteApi"
                    v-model="actionsData.immediateRemoteApi"
                    key="immediateRemoteApi"
                    title="配置表单首次加载数据源")
      //- 设置按钮配置
      FormButtonSetting.row-item(v-if="activeName==='button'"
        :key="`${canvasName}-button-setting`"
        :list="buttonList"
        :value="attrsData"
        @change="updateButtons")
</template>

<script>
/** 表单配置区 */
import AttrSettingForm from '@/components/AttrSettingForm'
import FormButtonSetting from './FormButtonSetting'
import RemoteSettingRequire from '@/components/RemoteSetting/Require'
import formAttrs from '@/model/formAttrs.js'
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
    FormButtonSetting,
    RemoteSettingRequire
  },
  data () {
    return {
      tabList: [
        { label: '属性', name: 'attr' },
        { label: '行为', name: 'action' },
        { label: '按钮', name: 'button' }
        // { label: '样式', name: 'style' }
      ],
      activeName: 'attr',
      // attrsData: {},
      attrs: formAttrs, // 目前只做表单，后续根据template类型选择
      /* 配置字典 */
      relationProps: [
        { label: '字典关键值', prop: 'name' },
        { label: '字典名', prop: 'label' }
      ], // 字典选项
      actions: [],
      actionsData: {},
      setRemoteVisable: false,
      immediateRemotePrecondition: {},
      activeCollapse: ['mounted', 'button']
    }
  },
  watch: {
    canvas: {
      immediate: true,
      deep: true,
      handler (canvas, oldData) {
        // const canvas = page?.[0] // 目前先做一个，TODO 修改为多个
        // console.log('改变canvas表单属性')
        if (canvas) {
          this.attrsData = !canvas?.attrs || isEmpty(canvas.attrs) ? { ...this.$defVal?.formAttrs } : canvas?.attrs
          this.actionsData = !canvas.actions || isEmpty(canvas.actions) ? {} : canvas.actions
          this.relationList = canvas?.actions?.relationList || []
          this.buttonList = canvas?.buttons || []
        } else {
          this.actionsData = {}
          this.attrsData = { ...this.$defVal?.formAttrs }
          this.relationList = []
          this.buttonList = []
        }
      }
    }
  },
  computed: {
    immediateRemoteApi: {
      get () {
        return this.actionsData.immediateRemoteApi || {}
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
      // console.log('updateform:', attrs)
      this.$emit('update', 'formAttrs', attrs)
      // this.setFormState({ attrs: this.attrsData })
      // this.$emit('update', 'attrs', this.attrsData)
    },
    updateButtons (buttons) {
      // console.log('更新按钮列表')
      this.buttonList = buttons
      this.setFormState({ buttons })
      // this.$emit('updateButtons', buttons)
      // this.$emit('update', 'buttons', buttons)
    },
    /* 部分配置无法双向修改到，需要更新store/canvas */
    setFormState ({ attrs = null, actions = null, buttons = null }) {
      // 由内部更新到store assignConfig
      // console.info('formSetting 更新', attrs)
      this.$store.commit('canvas/ASSIGN_CONFIG', {
        name: this.canvasName,
        attrs,
        actions,
        buttons
      })
      this.$emit('update') // 防止vuex数据更新延误
    },
    getAttrUpdate (data) {
      console.info('getAttrUpdate:', data)
    },
    getResourceTransBy (type) {
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

<template lang='pug'>
.setting-form-wrap
  .secondary-text.empty-text(v-if="!formItemConfig.key")
    .secondary-text(v-show="!formItemConfig.key")  请先拖拽组件, 再做操作
    .secondary-text(v-show="formItemConfig.key")  当前组件不可配置
    .secondary-text {{formItemConfig.key}}
  .setting-wrap(v-else)
    el-tabs.setting-tab(v-model="activeName", :stretch="true")
      el-tab-pane.tab-component(
        v-for="tab in tabList"
        :key="tab.name"
        :name="tab.name"
        :label="tab.label")
      ButtonGroupSetting(
        v-show="activeName === 'button'"
        v-bind="$attrs"
        v-on="$listeners"
        :value="attrsData.buttonList"
        :attrs="attrs"
        :actions="actions"
        :key="`button_${formItemConfig.key}`"
        @input="updateButton")
      AttrSettingForm(
        v-show="activeName === 'attr'"
        v-bind="$attrs"
        v-on="$listeners"
        :key="`attr_${formItemConfig.key}`"
        :value="attrsData"
        :attrs="attrs"
        @update="update"
        @updateAnAttr="updateAnAttr")
      CompActionSetting(
        v-show="activeName === 'action'"
        v-bind="$attrs"
        v-on="$listeners"
        :key="`action_${formItemConfig.key}`"
        :value="attrsData"
        :attrs="actions"
        @input="updateAction")

</template>

<script>
/** 组件配置区 */
import AttrSettingForm from '@/components/AttrSettingForm'
import CompActionSetting from './CompActionSetting'
import ButtonGroupSetting from './ButtonGroupSetting/index.vue'
import componentAttrs from '@/model/componentAttrs'
import { cloneDeep, isNil } from 'lodash'
export default {
  name: 'CompSetting',
  props: ['formItemConfig', 'canvasName', 'compType'],
  components: {
    AttrSettingForm,
    CompActionSetting,
    ButtonGroupSetting
  },
  data () {
    return {
      // tabList: [
      //   { label: '属性', name: 'attr' },
      //   { label: '行为', name: 'action' }
      // ],
      activeName: '',
      tempAttrsData: {}
      // attrsData: {}
    }
  },
  watch: {
    'formItemConfig.key': {
      immediate: true,
      handler (fname, oldfname) {
        if (fname !== oldfname) {
          // this.attrsData = cloneDeep(this.formItemConfig)
          this.activeName = this.formItemConfig.tag === 'button' ? 'button' : 'attr'
          this.attrsData = cloneDeep(this.formItemConfig)
        }
      }
    },
    passthourghAttrs (list) {
      // console.log('透传属性改变:', list)
      this.$set(this.attrsData, '_passthroughAttrs', list)
    }
  },
  computed: {
    tag () {
      return this.formItemConfig?.tag
    },
    attrs () {
      const attrs = componentAttrs[this.tag]?.attrs || []
      // 阻断某些属性在卡槽时不支持配置
      return this.compType && this.compType === 'assist' ? attrs.filter(attr => !attr.preventInSlot) : attrs
    },
    actions () {
      return componentAttrs[this.tag]?.actions || []
    },
    /* 记录透传属性： 属于透传属性，并且存在修改该属性 */
    passthourghAttrs () {
      return this.attrs.filter(attr => attr.passthroughAttr && !isNil(this.attrsData[attr.key])).map(attr => attr.key)
    },
    /* 纯属性 */
    attrsData: {
      get () {
        return this.tempAttrsData
      },
      set (data) {
        // console.log('设置compSetting:', data)
        this.tempAttrsData = data
        this.update()
      }
    },
    tabList () {
      return this.formItemConfig?.tag === 'button' ? [{ label: '按钮组', name: 'button' }] : [
        { label: '属性', name: 'attr' },
        { label: '行为', name: 'action' }
      ]
    }
  },
  methods: {
    update (type) {
      // this.updateFieldStorage(this.attrsData)
      this.$emit('update', 'comp', this.attrsData)
    },
    updateAnAttr ({ name, value }) {
      this.$set(this.attrsData, name, value)
      // this.updateFieldStorage(this.attrsData)
      this.$emit('update', 'comp', this.attrsData)
    },
    updateAction (actions) {
      // console.log('更新外部数据:', actions)
      this.updateAnAttr({ name: 'actions', value: actions })
    },
    updateButton (buttons) {
      console.log('更新按钮')
    // },
    // updateFieldStorage (attrs) {
    //   // 由内部更新到store
    //   if (!this.formItemConfig) return
    //   const curView = this.$store.getters.getCurView
    //   // console.log('此刻:', curView)
    //   const eindex = curView?.body?.findIndex(field => field.key === this.formItemConfig.key)
    //   if (eindex !== -1) {
    //     this.$store.commit('canvas/updateTheWidget', {
    //       name: this.canvasName,
    //       // fname,
    //       eindex,
    //       attrs
    //     })
    //     // this.formItemConfig = attrs
    //     this.$nextTick(() => this.$forceUpdate())
    //   }
    }
  }
}
</script>

<style lang='sass' scoped>
.setting-wrap
  border: 0
</style>

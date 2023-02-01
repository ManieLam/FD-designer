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
import componentAttrs from '@/model/componentAttrs'
import { cloneDeep } from 'lodash'
export default {
  name: 'CompSetting',
  props: ['formItemConfig', 'canvasName'],
  components: {
    AttrSettingForm,
    CompActionSetting
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
      tempAttrsData: {}
      // attrsData: {}
    }
  },
  watch: {
    'formItemConfig.key': {
      immediate: true,
      handler (fname, oldfname) {
        if (fname !== oldfname) {
          this.attrsData = cloneDeep(this.formItemConfig)
        }
      }
    }
  },
  computed: {
    tag () {
      return this.formItemConfig?.tag
    },
    attrs () {
      return componentAttrs[this.tag]?.attrs || []
    },
    actions () {
      return componentAttrs[this.tag]?.actions || []
    },
    /* 纯属性 */
    attrsData: {
      get () {
        return this.tempAttrsData
      },
      set (data) {
        this.tempAttrsData = data
        this.update()
      }
    }
  },
  methods: {
    update (type) {
      this.updateFieldStorage(this.attrsData)
      this.$emit('update', 'comp', this.attrsData)
    },
    updateAnAttr ({ name, value }) {
      this.$set(this.attrsData, name, value)
      this.updateFieldStorage(this.attrsData)
      this.$emit('update', 'comp', this.attrsData)
    },
    updateAction (actions) {
      console.log('更新外部数据:', actions)
      this.updateAnAttr({ name: 'actions', value: actions })
    },
    updateFieldStorage (attrs) {
      // 由内部更新到store
      if (!this.formItemConfig) return
      const curView = this.$store.getters.getCurView
      // console.log('此刻:', curView)
      const findex = curView?.body?.findIndex(field => field.key === this.formItemConfig.key)
      if (findex !== -1) {
        this.$store.commit('canvas/updateField', {
          name: this.canvasName,
          // fname,
          findex,
          attrs
        })
        // this.formItemConfig = attrs
        this.$nextTick(() => this.$forceUpdate())
      }
    }
  }
}
</script>

<style lang='sass' scoped>
.setting-wrap
  border: 0
</style>

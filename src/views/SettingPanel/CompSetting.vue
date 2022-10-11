<template lang='pug'>
.setting-form-wrap
  .secondary-text(v-if="!formItemConfig.name || !attrs.length") 组件配置区
    .secondary-text {{formItemConfig.name}}
  .setting-wrap(v-else)
    el-tabs.setting-tab(v-model="activeName", :stretch="true")
      el-tab-pane.tab-component(
        v-for="tab in tabList"
        :key="tab.name"
        :name="tab.name"
        :label="tab.label")
        AttrSettingForm(
          v-show="activeName==='attr'"
          v-bind="$attrs"
          v-on="$listeners"
          :value="attrsData"
          :attrs="attrs"
          @update="update"
          @updateAnAttr="updateAnAttr")
      //- el-radio-button(label="attr") 属性
      //- el-radio-button(label="action") 行为
  //- el-collapse.setting-wrap(v-model="activeNames", v-else)
  //-   el-collapse-item.collapse-item(title="属性配置", name="attr")
      AttrSettingForm(
        v-bind="$attrs"
        v-on="$listeners"
        :value="attrsData"
        :attrs="attrs"
        @update="update"
        @updateAnAttr="updateAnAttr")
    el-collapse-item.collapse-item(title="行为配置", name="action")

</template>

<script>
/** 组件配置区 */
import componentAttrs from './componentAttrs'
import AttrSettingForm from '@/components/AttrSettingForm'
import { cloneDeep } from 'lodash'
export default {
  name: 'CompSetting',
  props: ['formItemConfig', 'canvasName'],
  components: {
    AttrSettingForm
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
    update () {
      this.$emit('update', 'comp', this.attrsData)
    },
    updateAnAttr ({ name, value }) {
      // console.info('updateAnAttr:', name, value)
      this.$set(this.attrsData, name, value)
      this.$emit('update', 'comp', this.attrsData)
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

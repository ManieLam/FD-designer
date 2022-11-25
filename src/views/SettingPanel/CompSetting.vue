<template lang='pug'>
.setting-form-wrap
  .secondary-text.empty-text(v-if="!formItemConfig.key || !attrs.length")
    .secondary-text(v-show="!formItemConfig.key")  请先拖拽组件, 再做操作
    .secondary-text(v-show="formItemConfig.key && !attrs.length")  当前组件不可配置
    .secondary-text {{formItemConfig.key}}
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
import componentAttrs from '@/utils/componentAttrs'
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
</style>

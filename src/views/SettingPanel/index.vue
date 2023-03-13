<template lang='pug'>
.setting-panel
  el-tabs.setting-tab(v-model="activeName", type="card")
    el-tab-pane.tab-component(
      v-for="tab in tabList"
      :key="tab.name"
      :name="tab.name"
      :label="tab.label"
      :disabled="tab.disabled|filterDisabled")
      component(
        :ref="tab.name"
        :is="tab.components"
        :key="formItemConfig.key"
        :formItemConfig="formItemConfig"
        v-bind="{...$attrs, ...(tab.props||{})}"
        v-on="$listeners")
</template>

<script>
/** 属性、行为配置区 */
export default {
  name: 'SettingPanel',
  props: {
    formItemConfig: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      activeName: 'component',
      tabList: [{
        label: '组件配置',
        name: 'component',
        components: () => import('./CompSetting')
      }, {
        label: '表单配置',
        name: 'form',
        components: () => import('./FormSetting')
      }, {
        label: '卡槽配置',
        name: 'assist',
        disabled: this.assistTabDisabled,
        props: {},
        components: () => import('./AssistSetting')
      }]
    }
  },
  filters: {
    filterDisabled (disabled) {
      if (!disabled) return false
      if (disabled && typeof disabled === 'function') {
        const res = disabled()
        // console.info('是否禁用', res)
        return res
      }
    }
  },
  methods: {
    clear () {
      this.$forceUpdate()
    },
    assistTabDisabled () {
      // console.log('formItemConfig:', this.formItemConfig)
      if (this.formItemConfig) {
        const attrsKeys = Object.keys(this.formItemConfig)
        return !attrsKeys.some(key => ['preSlotRender', 'suffixSlotRender'].includes(key))
      }
      return true
    }
  }
}
</script>

<style lang='sass' scoped>
.setting-panel
  display: flex
  flex-direction: column
  height: 100%
  position: relative
  .setting-tab
    height: 100%
    flex: 1
    display: flex
    flex-direction: column
    ::v-deep > .el-tabs__header
      margin-bottom: 0px
    ::v-deep .el-tabs__content
      height: 100%
      overflow-y: auto
  ::v-deep .empty-text
    position: absolute
    left: 50%
    top: 50%
    transform: translate3d(-50%, -50%, 0)

.tab-component
  padding-right: 4px
  padding-left: 4px
</style>

<template lang='pug'>
.setting-panel
  el-tabs.setting-tab(v-model="activeName", type="card")
    el-tab-pane.tab-component(
      v-for="tab in tabList"
      :key="tab.name"
      :name="tab.name"
      :label="tab.label")
      component(
        :ref="tab.name"
        :is="tab.components"
        v-bind="$attrs"
        v-on="$listeners")
</template>

<script>
/** 属性、行为配置区 */
export default {
  name: 'SettingPanel',
  data () {
    return {
      activeName: 'component',
      tabList: [{
        label: '组件配置区',
        name: 'component',
        components: () => import('./CompSetting')
      }, {
        label: '表单配置区',
        name: 'form',
        components: () => import('./FormSetting')
      }]
    }
  },
  methods: {
    clear () {
      this.$forceUpdate()
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

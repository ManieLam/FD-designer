<template lang='pug'>
.setting-panel
  el-tabs.setting-tab(v-model="activeName")
    el-tab-pane.tab-component(
      v-for="tab in tabList"
      :key="tab.name"
      :name="tab.name"
      :label="tab.label")
      component(
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
      activeName: 'form',
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
  .setting-tab
    height: 100%
    flex: 1
    display: flex
    flex-direction: column
    ::v-deep .el-tabs__content
      height: 100%
      overflow-y: auto
</style>

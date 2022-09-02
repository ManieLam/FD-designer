<template lang='pug'>
.setting-panel
  el-tabs
    el-tab-pane(
      v-for="tab in tabList"
      :key="tab.name"
      :label="tab.label")
      component(:is="tab.components")
</template>

<script>
/** 属性、行为配置区 */
export default {
  name: 'SettingPanel',
  data () {
    return {
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
  }
}
</script>

<style lang='sass' scoped>

</style>

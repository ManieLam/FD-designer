<template lang='pug'>
.designer-content
  .app-header
    .header-icon.font-size-medium
      p Form Designer
    .header-tools
      el-button-group
        el-button(
          v-for="btn in tools"
          v-bind="btn"
          :key="btn.name"
          @click="btn.func") {{btn.label}}
  AppContainer.app-content
</template>

<script>
import AppContainer from './Container'
export default {
  name: 'AppDesigner',
  components: {
    AppContainer
  },
  data () {
    return {
      tools: [
        {
          label: '全局配置',
          name: 'globalSetting',
          func: this.globalSetting
        // },
        // {
        //   label: '导出全部画布',
        //   name: 'export',
        //   func: this.export
        }
      ]
    }
  },
  computed: {},
  methods: {
    export () {},
    globalSetting () {}
  },
  mounted () {}
}
</script>

<style scoped lang=scss>

</style>

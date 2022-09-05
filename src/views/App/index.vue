<template lang="pug">
.app#app
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
        },
        {
          label: '导出全部画布',
          name: 'export',
          func: this.export
        }
      ]
    }
  },
  methods: {
    export () {},
    globalSetting () {}
  }
}
</script>

<style lang="sass">
#app
  font-family: Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  // text-align: center
  color: #2c3e50
  background: #DFDEDD
  .app-header
    color: #2c3e50
    background-image: url('~@/assets/imgs/cool-background.png')
    background-size: cover
    background-position: 80% 70%
    padding: $--padding-primary
    display: flex
    justify-content: space-between
    align-items: center
    font-weight: bold
</style>

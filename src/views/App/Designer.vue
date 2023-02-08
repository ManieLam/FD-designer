<template lang='pug'>
.designer-content
  .app-header
    .header-icon.font-size-medium
      p Form Designer
    .header-tools
      el-dropdown(trigger="click", :split-button="true", @command="handleCommand")
        span.el-dropdown-link 全局配置
        el-dropdown-menu(slot="dropdown")
          el-dropdown-item(command="handleWebserver") 环境配置
  AppContainer.app-content
  WebserverSetter(ref="webserverSetter", v-model="webserverSetting")
</template>

<script>
import AppContainer from './Container'
import WebserverSetter from '@/components/ConfigSetter/WebserverSetter'
export default {
  name: 'AppDesigner',
  components: {
    AppContainer,
    WebserverSetter
  },
  data () {
    return {
      webserverSetting: false // 是否设置环境变量
      // tools: [
      //   {
      //     label: '全局配置',
      //     name: 'globalSetting',
      //     func: this.globalSetting
      //   // },
      //   // {
      //   //   label: '导出全部画布',
      //   //   name: 'export',
      //   //   func: this.export
      //   }
      // ]
    }
  },
  computed: {},
  methods: {
    export () {},
    handleWebserver () {
      this.webserverSetting = !this.webserverSetting
    },
    handleCommand (command) {
      this[command].call()
    }
  },
  mounted () {}
}
</script>

<style scoped lang=scss>

</style>

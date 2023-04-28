<template lang='pug'>
.designer-content
  .app-header
    .header-icon.font-size-medium
      p Form Designer
    .header-tools
      el-dropdown.m-r-8(trigger="click", :split-button="true", @command="handleCommand")
        span.el-dropdown-link 全局配置
        el-dropdown-menu(slot="dropdown")
          el-dropdown-item(command="handleWebserver") 环境配置
      el-dropdown(trigger="click", :split-button="true", @command="handleNavigtor")
        span.el-dropdown-link 示例查看
        el-dropdown-menu(slot="dropdown")
          el-dropdown-item(v-for="(expText, expName) in exampleList", :key="expName", :command="expName") {{ expText }}
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
      webserverSetting: false, // 是否设置环境变量
      // 示例
      exampleList: {
        TestPostmessage: 'h5嵌入'
      }
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
    },
    handleNavigtor (expName) {
      this.$router.push({ name: expName })
    }
  },
  mounted () {}
}
</script>

<style scoped lang=sass>
.designer-content
  background: #DFDEDD
</style>

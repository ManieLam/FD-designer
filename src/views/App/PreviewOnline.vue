<template lang='pug'>
.preview-content
  .app-header(v-if="isPCChannel")
    .header-icon.font-size-medium
      p Form Designer 在线预览
    .header-tool
      el-button(type="primary", @click="handleEdit") 切换编辑
  .app-content.bgcolor-fff
    component(
      v-if="onReady"
      :is="componentVM"
      :config="canvasConfig"
      @onCloseDialog="onCloseDialog")
    el-empty(v-else, description="查找不到配置信息")
</template>

<script>
/** 在线预览 */
export default {
  name: 'PreviewOnline',
  data () {
    return {
      onReady: false,
      isPCChannel: false,
      routeName: '',
      canvasConfig: {},
      // 目前只支持表单，先写死, TODO 配置
      componentVM: 'FormTemp'
    }
  },
  computed: {},
  methods: {
    onCloseDialog () {
      window.parent.postMessage('onCloseDialog', '*')
    },
    checkMobile () {
      return navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      )
    },
    handleEdit () {
      const { hash, href } = window.location
      const { name, id } = this.$route.params || {}
      // 编辑页面跳转
      const newPath = href.replace(hash, `#/edit/${name}/${id}`)
      window.location.href = newPath
    }
  },
  mounted () {
    const { name, id } = this.$route.params || {}
    const { mode } = this.$route.query || {}
    this.isPCChannel = !this.checkMobile() && !!mode // 从配置平台跳转进入，非移动端
    this.routeName = name
    // console.info('查找路由名称', this.routeName)
    this.onReady = false
    if (name && id) {
      this.$normalRequire({
        // url: `/fileserver/ui/config/get/${id}`
        url: this.$api.canvas.getDetail(id)
      }).then(res => {
        // console.log('res:', res)
        if (res?.data) {
          this.onReady = true
          this.canvasConfig = JSON.parse(res.data.config)
          // console.log('获取到data:', this.canvasConfig)
        } else {
          this.canvasConfig = {}
        }
      })
    }
  }
}
</script>

<style scoped lang=scss>

</style>

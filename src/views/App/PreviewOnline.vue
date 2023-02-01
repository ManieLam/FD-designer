<template lang='pug'>
.preview-content
  .app-header(v-if="showHeader")
    .header-icon.font-size-medium
      p Form Designer 在线预览
  .app-content.bgcolor-fff
    component(
      v-if="onReady"
      :is="componentVM"
      :config="canvasConfig"
      @onCloseDialog="onCloseDialog")
    el-empty(v-else, description="查找不到配置信息")
</template>

<script>
/** 在线预览
 * TODO 增加emit事件, postMessage通知外部
*/
export default {
  name: 'PreviewOnline',
  data () {
    return {
      onReady: false,
      showHeader: false,
      routeName: '',
      canvasConfig: {},
      // 目前只支持表单，先写死
      componentVM: 'FormTemp'
    }
  },
  computed: {},
  methods: {
    onCloseDialog () {
      window.parent.postMessage('onCloseDialog', '*')
    }
  },
  mounted () {
    console.log('route:', this.$route)
    const { name, id } = this.$route.params || {}
    const { mode } = this.$route.query || {}
    this.showHeader = mode === '1' // 从配置平台跳转进入
    this.routeName = name
    // console.info('查找路由名称', this.routeName)
    this.onReady = false
    if (name && id) {
      this.$normalRequire({
        url: `/fileserver/ui/config/get/${id}`
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

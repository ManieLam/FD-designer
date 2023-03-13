<template lang='pug'>
.test-content.p-16
  .input
    label(for="frame-input__src") 输入页面在线预览地址
    el-input#frame-input__src(style="width: 150px; margin: 8px", v-model="frameSrc", placeholder="输入页面在线预览地址")
  iframe#theFrame(:src="frameSrc", frameborder="1", height="600px")
</template>

<script>
export default {
  name: 'TestPostmessage',
  data () {
    return {
      frameSrc: '#/online/cfb/28', // 请不要带?model=1
      // frameSrc: '#/online/q2/21', // 请不要带?model=1
      // frameSrc: '#/online/fixed/27', // 请不要带?model=1
      // frameSrc: '#/online/button/24', // 请不要带?model=1
      // frameSrc: '#/online/25/25', // 请不要带?model=1
      iframeDom: null
    }
  },
  computed: {
    // 记录frame中的数据
    frameData () {
      return this.$refs.theFrame?.fullData || {}
    }
  },
  methods: {
    getChildMessage () {
      window.addEventListener('message', e => {
        // 对消息来源暂不做过滤
        // 示例信息通道为aabb
        // console.info('测试获取到消息:', e.data)
        if (Object.hasOwn(e.data, 'aabb')) {
          // console.log('iframeDom:', this.iframeDom)
          if (this.iframeDom) {
            // 向iframe传递数据，数据通道名称“changeData”。
            this.iframeDom.contentWindow.postMessage({ changeData: { name: 11, bb: 22 } }, '*')
          }
        }
        if (Object.hasOwn(e.data, 'onMultiRequireEnd')) {
          // 模拟【初次获取当前登录人信息作为默认值填入】，在初始化数据后追加赋值，使用“changeData”通道覆盖原默认数据集, “assignData” 则是追加
          this.iframeDom.contentWindow.postMessage({ assignData: { loginUser: '张三' } }, '*')
        }
      }, false)
    }
  },
  mounted () {
    // this.getIframe()
    this.$nextTick(() => {
      // 等加载完再赋值
      this.iframeDom = document.getElementById('theFrame')
      // 模拟【初次获取当前登录人信息作为默认值填入】，如果设置了初始化异步请求数据，则会受初始化赋值影响，此次填入失败，建议在初始化请求完数据再赋值
      // console.info('模拟')
      this.iframeDom.contentWindow.postMessage({ changeData: { loginUser: '张三' } }, '*')
    })
    this.getChildMessage()
  }
}
</script>

<style scoped lang=sass>

</style>

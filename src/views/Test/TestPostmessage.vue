<template lang='pug'>
.test-content
  iframe#theFrame(:src="frameSrc", frameborder="1", height="600px")
</template>

<script>
export default {
  name: 'TestPostmessage',
  data () {
    return {
      frameSrc: '#/online/button/24', // 请不要带?model=1
      // frameSrc: '#/online/25/25', // 请不要带?model=1
      iframeDom: null
    }
  },
  computed: {},
  methods: {
    getIframe () {
      this.iframeDom = document.getElementById('iframe')
      // 需要等到iframe中的子页面加载完成后才发送消息，否则子页面接收不到消息
    },
    getChildMessage () {
      window.addEventListener('message', e => {
        // 对消息来源暂不做过滤
        // 示例信息通道为aabb
        if (Object.hasOwn(e.data, 'aabb')) {
          console.log(e.data, Object.hasOwn(e.data, 'aabb')) // 子页面发送的消息
          // console.log('iframeDom:', this.iframeDom)
          if (this.iframeDom) {
            console.log('向子窗口传递{aa: 11, bb: 22}')
            // 获取到iframe的window对象
            this.iframeDom.contentWindow.postMessage({ changeData: { aa: 11, bb: 22 } }, '*')
          }
        }
      }, false)
    }
  },
  mounted () {
    // this.getIframe()
    this.$nextTick(() => {
      this.iframeDom = document.getElementById('theFrame')
    })
    this.getChildMessage()
  }
}
</script>

<style scoped lang=sass>

</style>

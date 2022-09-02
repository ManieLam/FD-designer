<template lang='pug'>
.canvas-panel
  router-view
</template>

<script>
/** 画布控制区 */
import draggable from 'vuedraggable'
export default {
  name: 'CanvasPanel',
  components: {
    draggable
  },
  data () {
    return {}
  }
}
</script>

<style lang='sass' scoped>

</style>

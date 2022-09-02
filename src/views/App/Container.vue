<template lang='pug'>
.container-wrap
  .left-panel
    WidgetPanel
  .center-panel
    CanvasPanel
  .right-panel
    SettingPanel
</template>

<script>
/** */
import WidgetPanel from '../WidgetPanel'
import CanvasPanel from '../CanvasPanel'
import SettingPanel from '../SettingPanel'
import draggable from 'vuedraggable'
export default {
  name: 'AppContainer',
  components: {
    draggable,
    WidgetPanel,
    CanvasPanel,
    SettingPanel
  },
  data () {
    return {}
  }
}
</script>

<style lang='sass' scoped>
.container-wrap
  display: flex
  justify-content: space-between
  margin-top: 8px
  margin-bottom: 8px
  height: calc(100vh - 90px)
  > div
    background: #fff
    padding: 8px
    & + div
      border-left: 1px solid $--border-color-base
      padding-left: $--padding-primary
      // margin-left: 8px
  .left-panel,.right-panel
    flex: 10%
    max-width: 300px
  .center-panel
    flex: 4 0 auto
  // padding: $--padding-size-medium

</style>

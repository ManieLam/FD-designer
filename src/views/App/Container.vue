<template lang='pug'>
.container-wrap
  .left-panel
    WidgetPanel(@onDragged="onDragged")
  .center-panel
    //- TODO 支持多个画布
    router-view
  .right-panel
    SettingPanel
</template>

<script>
/** */
import WidgetPanel from './WidgetPanel'
// import CanvasPanel from '../CanvasPanel'
import SettingPanel from '../SettingPanel'
import draggable from 'vuedraggable'
import { debounce } from 'lodash'
export default {
  name: 'AppContainer',
  components: {
    draggable,
    WidgetPanel,
    SettingPanel
  },
  data () {
    return {
    }
  },
  methods: {
    onDragged: debounce(({ from, to }) => {
      // console.info('on Dragged', from, to)
    }, 800)
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
    // .tool-panel
    //   background: #ff

</style>

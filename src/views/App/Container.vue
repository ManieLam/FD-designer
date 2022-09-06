<template lang='pug'>
.container-wrap
  .left-panel
    WidgetPanel(@onDragged="onDragged")
  .center-panel
    //- TODO 支持多个画布
    //- router-view
    DragPage(
      :formConfig="formConfig"
      :formItemConfig="formItemConfig"
      @onSelect="selectFormitem")
  .right-panel(v-if="toggleSettingOpen")
    SettingPanel(
      :formItemConfig="formItemConfig"
      :formConfig="formConfig"
      @change="change")
</template>

<script>
/** */
import WidgetPanel from './WidgetPanel'
import DragPage from '../DragPage'
// import CanvasPanel from '../CanvasPanel'
import SettingPanel from '../SettingPanel'
// import Draggable from 'vuedraggable'
import { debounce } from 'lodash'
export default {
  name: 'AppContainer',
  components: {
    // Draggable,
    DragPage,
    WidgetPanel,
    SettingPanel
  },
  data () {
    return {
      formItemConfig: {},
      formConfig: {},
      toggleSettingOpen: false // 切换配置区
    }
  },
  methods: {
    onDragged: debounce(({ from, to }) => {
      // console.info('on Dragged', from, to)
    }, 800),
    selectFormitem (ele) {
      console.info('某个子元素点击了：', ele)
      this.toggleSettingOpen = true
      this.formItemConfig = ele
    },
    change (type, attrs) {
      if (type === 'form') {
        console.info('更改表单数值')
        this.formConfig = attrs
      } else if (type === 'formitem') {
        this.formItemConfig = attrs
      }
    }
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

<template lang='pug'>
.container-wrap
  .left-panel
    WidgetPanel(@onDragged="onDragged")
  .center-panel
    //- TODO 支持多个画布
    //- router-view
    .tool-panel.d-flex-row-between
      el-button-group.tool-wrap__left
        el-button() 切换画布
        el-button(@click="toggleSettingJson=!toggleSettingJson") 查看配置文件
      el-button-group.tool-wrap__right
        el-button() 导出
        el-button(@click="onClear") 清空
        el-button() 预览
        el-button(type="primary", @click="onSave") 保存
    DragPage(
      ref="dragPage"
      :formItemConfig="formItemConfig"
      :actIndex="actIndex"
      :canvasName="canvasName"
      :canvas="actCanvas"
      @onSelect="selectFormitem")
  .right-panel(v-if="toggleSettingOpen")
    SettingPanel(
      :canvas="actCanvas"
      :actIndex="actIndex"
      :canvasName="canvasName"
      :formItemConfig="formItemConfig"
      @change="change")
  //- 查看配置文件的弹窗
  el-dialog(
    title="查看配置文件"
    width="60%"
    :visible.sync="toggleSettingJson")
    .setting-json-wrap {{ allCanvas }}
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
      actIndex: 0, // 活动的画布index
      actCanvas: {},
      formItemConfig: {},
      formConfig: {},
      toggleSettingJson: false, // 查看json数据
      toggleSettingOpen: true // 切换配置区
    }
  },
  computed: {
    canvasName () {
      return `canvas_${this.actIndex}`
    },
    allCanvas () {
      return this.$store.state.canvas.collects
    }
  },
  methods: {
    onDragged: debounce(({ from, to }) => {
      // console.info('on Dragged', from, to)
    }, 800),
    selectFormitem (ele) {
      this.toggleSettingOpen = true
      this.formItemConfig = ele
    },
    change (type, attrs) {
      if (type === 'form') {
        // this.formConfig = attrs
        this.updateFormConfig({ attrs })
      } else if (type === 'formitem') {
        this.formItemConfig = attrs
      }
    },
    updateFormConfig ({ attrs, actions }) {
      this.$store.commit('canvas/updateConfig', {
        name: this.canvasName,
        attrs,
        actions
      })
    },
    onClear () {
      this.$refs.dragPage.clear()
    },
    onSave () {
      // this.$refs.dragPage.save()
      localStorage.setItem('Canvas-all', JSON.stringify(this.allCanvas))
      localStorage.setItem('Canvas-editing', this.canvasName)
    },
    initCanvas () {
      this.$store.commit('canvas/init')
      const editingName = this.$store.state.canvas.editingName || ''
      this.actIndex = editingName ? Number(editingName.split('_')[1]) : 0
      // this.fieldList = this.allCanvas[editingName]?.fields || []
      this.actCanvas = this.allCanvas[editingName]
    }
  },
  mounted () {
    this.initCanvas()
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
  .left-panel,.right-panel,.center-panel
    background: #fff
    padding: 8px
    & + div
      border-left: 1px solid $--border-color-base
      padding-left: $--padding-primary
      // margin-left: 8px
  // .left-panel,.right-panel
  .left-panel
    flex: 10%
    max-width: 300px
  .right-panel
    flex: 15%
  .center-panel
    flex: 4 0 auto
    height: 100%
    display: flex
    flex-direction: column
    // .tool-panel
    //   background: #ff

</style>

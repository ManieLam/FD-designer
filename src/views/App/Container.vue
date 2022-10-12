<template lang='pug'>
.container-wrap
  .left-panel
    WidgetPanel(@onDragged="onDragged")
  .center-panel
    //- TODO 支持多个画布
    //- router-view
    .tool-panel.d-flex-row-between
      el-button-group.tool-wrap__left
        //- el-button() 切换画布
        el-button(@click="toggleSettingJson") 查看配置文件
      el-button-group.tool-wrap__right
        el-button() 导出
        el-button(@click="onClear") 清空
        el-button() 预览
        el-button(type="primary", :disabled="allCanvas[canvasName]|saveable", @click="onSave") 保存
    DragPage(
      ref="dragPanel"
      :key="actIndex"
      :formItemConfig="formItemConfig"
      :actIndex="actIndex"
      :canvasName="canvasName"
      :canvas="allCanvas[canvasName]"
      @onSelect="selectFormitem")
  .right-panel(v-if="toggleSettingOpen")
    SettingPanel(
      ref="settingPanel"
      :key="actIndex"
      :canvas="allCanvas[canvasName]"
      :actIndex="actIndex"
      :canvasName="canvasName"
      :formItemConfig="formItemConfig"
      @update="updateConfig")
  //- 查看配置文件的弹窗
  el-dialog(
    title="查看配置文件"
    width="60%"
    :visible.sync="settingJsonVisable")
    //- .setting-json-wrap {{ allCanvas }}
    CodeEditor.json-codeEditor(:value="allCanvas|filterCanvasStr", mode="ace/mode/json", :readOnly="true")
</template>

<script>
/** */
import WidgetPanel from './WidgetPanel'
import DragPage from '../DragPage'
// import CanvasPanel from '../CanvasPanel'
import SettingPanel from '../SettingPanel'
// import Draggable from 'vuedraggable'
import { debounce } from 'lodash'
import CodeEditor from '@/components/CodeEditor'
export default {
  name: 'AppContainer',
  components: {
    // Draggable,
    DragPage,
    WidgetPanel,
    SettingPanel,
    CodeEditor
  },
  data () {
    return {
      actIndex: 0, // 活动的画布index
      formItemConfig: {},
      settingJsonVisable: false, // 查看json数据
      toggleSettingOpen: true // 切换配置区
    }
  },
  filters: {
    saveable (actCanvas) {
      return !(!!actCanvas && actCanvas?.fields?.length)
    },
    filterCanvasStr (obj) {
      return JSON.stringify(obj, null, '\t')
    }
  },
  computed: {
    canvasName () {
      return this.$store.state.canvas.editingName || `canvas_${this.actIndex}`
    },
    allCanvas () {
      return this.$store.state.canvas.collects
    // },
    // ---有缓存，出现置后性
    // actCanvas () {
    //   // return this.allCanvas[this.canvasName]
    //   return this.$store.state.canvas.collects[this.canvasName]
    },
    allCanvasStr () {
      return JSON.stringify(this.allCanvas, null, '\t')
    }
  },
  methods: {
    toggleSettingJson () {
      this.$forceUpdate()
      this.$nextTick(() => {
        this.settingJsonVisable = !this.settingJsonVisable
      })
    },
    updateConfig (type, attrs) {
      if (type === 'comp') {
        this.updateFieldStorage({ fkey: attrs.key, attrs })
      }
    },
    updateFieldStorage ({ fkey, attrs, actions }) {
      const findex = this.allCanvas[this.canvasName]?.fields?.findIndex(field => field.key === fkey)
      if (findex !== -1) {
        this.$store.commit('canvas/updateField', {
          name: this.canvasName,
          // fname,
          findex,
          attrs,
          actions
        })
        this.formItemConfig = attrs
        this.$nextTick(() => {
          this.$forceUpdate()
        })
      }
    },
    onDragged: debounce(({ from, to }) => {
      // console.info('on Dragged', from, to)
    }, 800),
    selectFormitem (ele) {
      this.toggleSettingOpen = true
      this.formItemConfig = ele
      this.$nextTick(() => {
        this.$forceUpdate()
      })
    },
    onClear () {
      this.$refs.dragPanel.clear()
      this.$refs.settingPanel.clear()
      this.formItemConfig = {}
      this.$store.commit('canvas/clear', this.canvasName)
      this.onSave()
      // console.info('清空后:', this.actCanvas)
      this.$forceUpdate()
    },
    onSave () {
      // this.$refs.dragPage.save()
      localStorage.setItem('Canvas-all', JSON.stringify(this.allCanvas))
      localStorage.setItem('Canvas-editing', this.canvasName)
    },
    async initCanvas () {
      await this.$store.commit('canvas/init')
      const editingName = this.$store.state.canvas.editingName
      this.actIndex = editingName ? Number(editingName.split('_')[1]) : 0
    },
    async initResource () {
      await this.$store.commit('resources/init')
    }
  },
  created () {
    this.initCanvas()
    this.initResource()
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
    min-width: 300px
  .center-panel
    flex: 4 0 auto
    height: 100%
    display: flex
    flex-direction: column
    // .tool-panel
    //   background: #ff

.json-codeEditor
  max-height: 100vh
  min-height: 80vh
  ::v-deep .code-editor
    height: 100%
    max-height: 100vh
    min-height: 80vh
</style>

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
        el-button(@click="toExportProps.visable=true") 导出
        el-button(@click="onClear") 清空
        el-button(@click="onPreview") 预览
        el-button(type="primary", :disabled="allCanvas[canvasName]|saveable", @click="onSave") 保存
    DragPage(
      ref="dragPanel"
      :key="actIndex"
      :formItemConfig="formItemConfig"
      :actIndex="actIndex"
      :canvasName="canvasName"
      :canvas="allCanvas[canvasName]"
      @onSelect="onSelectElement")
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
  //- 查看预览的
  el-dialog(
    title="查看预览效果"
    width="80%"
    :visible.sync="previewProps.visable")
    //- FromTemp(v-if="previewProps.visable", :config="previewProps.data")
    component(v-if="previewProps.visable && componentVM", :is="componentVM", :config="previewProps.data")
    //- form-component(v-if="previewProps.visable", :config="previewProps.data")
  //- 导出.vue或.html
  el-dialog(
    title="选择导出的类型"
    width="50%"
    :visible.sync="toExportProps.visable")
    .toexport-radio-block
      .block-item(id="export-json", @click="exportJson") 配置文件
      //- .block-item(id="export-vue", @click="exportVue") vue文件
      .block-item(id="export-html", @click="onExport('html')") html+js+css文件
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
import { templateRegister, getVueComp } from '@/components/Translator/index.js'
import Vue from 'vue'
// import FromTemp from '@/components/Translator/Template/Form'
// console.info(FromTemp)
export default {
  name: 'AppContainer',
  components: {
    // Draggable,
    DragPage,
    WidgetPanel,
    SettingPanel,
    CodeEditor
    // FromTemp
  },
  data () {
    return {
      actIndex: 0, // 活动的画布index
      formItemConfig: {},
      settingJsonVisable: false, // 查看json数据
      toggleSettingOpen: true, // 切换配置区
      /* 预览 */
      previewProps: {
        visable: false,
        data: {}
      },
      /* 导出 */
      toExportProps: {
        visable: false,
        data: {}
      },
      componentVM: 'FormTemp'
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
    onSelectElement ({ type, data }) {
      const firTab = type === 'component'
      if (firTab) {
        this.formItemConfig = data
        this.$nextTick(() => {
          this.$forceUpdate()
        })
      }
      this.$refs.settingPanel.activeName = firTab ? 'component' : 'form'
      this.$nextTick(() => {
        if (!firTab) {
          const tabEL = this.$refs.settingPanel.$refs?.form?.[0]
          if (tabEL) {
            type === 'button' ? tabEL.togggleTab('action') : tabEL.togggleTab('attr')
          }
        }
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
      this.formItemConfig = this.allCanvas[this.canvasName]?.fields?.[0] || {}
    },
    async initResource () {
      await this.$store.commit('resources/init')
    },
    async onPreview () {
      this.previewProps.data = this.allCanvas[this.canvasName]
      this.componentVM = templateRegister[this.previewProps.data?.template]
      this.previewProps.visable = !this.previewProps.visable
      // console.info('previewProps:', this.previewProps)
    },
    onExport (type) {
    //   if (type === 'json') {
    //     this.exportJson()
      // }
    },
    exportJson () {
      const blob = new Blob([JSON.stringify(this.allCanvas[this.canvasName])], { type: 'application/json' })
      const alink = document.createElement('a')
      alink.download = '表单设计器配置文件'
      alink.href = URL.createObjectURL(blob)
      alink.style.display = 'none'
      document.body.appendChild(alink)
      alink.click()
      URL.revokeObjectURL(alink.href)
    },
    async exportVue () {
      // 获取配置的表单组件
      const comps = await getVueComp(Vue, {
        opt: { router: this.$route, store: this.$store },
        canvas: Object.values(this.allCanvas)
      })
      Object.entries(comps).forEach(([name, func]) => {
        if (name) {
          Vue.component(name, func)
        }
      })
      console.info(comps)
    }
  },
  created () {
    this.initCanvas()
    this.initResource()
  },
  mounted () {}
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

.toexport-radio-block
  display: flex
  align-items: center
  justify-content: center
  .block-item
    border: 1px solid $--border-color-base
    padding: 8px 20px
    text-align: center
    line-height: 2.8
    & + .block-item
      margin-left: 8px
    &:hover
      color: $--color-primary
      cursor: pointer
      background: $--bgcolor-secondary
      border-color: $--border-active

</style>

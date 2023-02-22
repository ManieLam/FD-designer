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
        //- computed中设立saveable无法监听到store的变化
        el-button(:disabled="canvasName|getActCanvas(allCanvas)|saveable", @click="toExportProps.visable=true") 导出
        el-button(:disabled="canvasName|getActCanvas(allCanvas)|saveable", @click="onClear") 清空
        //- el-button(:disabled="canvasName|getActCanvas(allCanvas)|saveable", @click="onPreview") 预览
        el-dropdown(:disabled="canvasName|getActCanvas(allCanvas)|saveable", @command="handlePreview")
          el-button 预览
            i.el-icon-arrow-down.el-icon--right
          el-dropdown-menu(slot="dropdown")
            el-dropdown-item(command="onPreview") 预览
            el-dropdown-item(:disabled="!actCanvas.configId", command="handleOnlinePreview") 在线预览
        el-button(type="primary", :disabled="canvasName|getActCanvas(allCanvas)|saveable", @click="onSave") 保存
        el-button(type="primary", :disabled="canvasName|getActCanvas(allCanvas)|saveable", @click="publishOnline") 发布
    DragPage(
      ref="dragPanel"
      :key="canvasName"
      :formItemConfig="formItemConfig"
      :canvasName="canvasName"
      :canvas="canvasName|getActCanvas(allCanvas)"
      @onSelect="onSelectElement")
  .right-panel(v-if="toggleSettingOpen")
    SettingPanel(
      ref="settingPanel"
      :key="canvasName"
      :canvas="canvasName|getActCanvas(allCanvas)"
      :canvasName="canvasName"
      :formItemConfig="formItemConfig"
      @update="updateConfig")
  //- 查看配置文件的弹窗
  el-dialog(
    title="查看配置文件"
    width="60%"
    :close-on-click-modal="false"
    :visible.sync="settingJsonVisable")
    //- .setting-json-wrap {{ allCanvas }}
    CodeEditor.json-codeEditor(v-if="settingJsonVisable", :value="allCanvas|filterCanvasStr", mode="ace/mode/json", :readOnly="true", @onCloseDialog="settingJsonVisable=false")
  //- 查看预览的
  el-dialog(
    title="查看预览效果"
    width="60%"
    :close-on-click-modal="false"
    :visible.sync="previewProps.visable")
    //- FromTemp(v-if="previewProps.visable", :config="previewProps.data")
    .text-right
      el-button-group
        el-button(type="primary" @click="publishOnline") 一键发布，在线预览
    component(
      v-if="previewProps.visable && componentVM"
      :is="componentVM"
      :config="previewProps.data"
      :isTest="true"
      @onCloseDialog="previewProps.visable=false")
    //- form-component(v-if="previewProps.visable", :config="previewProps.data")
  //- 导出.vue或.html
  el-dialog(
    title="选择导出的类型"
    width="50%"
    :close-on-click-modal="false"
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
      // actName: 0, // 活动的画布index
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
      isEditMode: false, // 编辑模式
      componentVM: 'FormTemp' // 暂且是表单类型，TODO 扩展其他类型
    }
  },
  filters: {
    getActCanvas (name, all) {
      return all[name] || {}
    },
    saveable (actCanvas) {
      return !(!!actCanvas && actCanvas?.body?.length)
    },
    filterCanvasStr (obj) {
      return JSON.stringify(obj, null, '\t')
    }
  },
  computed: {
    canvasName () {
      return this.$store.state.canvas.editingName || 'canvas_0'
    },
    allCanvas () {
      return this.$store.state.canvas.canvas
    },
    actCanvas () {
      // return this.allCanvas[this.canvasName] || {} // 无效
      // TODO 下个版本迭代成多个
      // ---有缓存，出现置后性
      return this.$store.getters.getCurView
    // },
    },
    allCanvasStr () {
      return JSON.stringify(this.allCanvas, null, '\t')
    // },
    // // 画布内已选的异步请求链接
    // hadRemoteResource () {
    //   return this.getResourceCurSetting()
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
        this.formItemConfig = attrs
      }
    },
    onDragged: debounce(({ from, to }) => {
      // console.info('on Dragged', from, to)
    }, 800),
    onSelectElement ({ type, data }) {
      console.info('选中数据:', data)
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
      localStorage.removeItem('Canvas-all')
      sessionStorage.removeItem('Canvas-editing')
    },
    onSave (alert = true) {
      // this.$refs.dragPage.save()
      localStorage.setItem('Canvas-all', JSON.stringify(this.allCanvas))
      sessionStorage.setItem('Canvas-editing', this.canvasName)
      if (alert) this.$message.success('保存成功')
    },
    async getEditCanvas (rName, id) {
      let resData = {}
      if (rName && id) {
        await this.$normalRequire({
          url: `/fileserver/ui/config/get/${id}`
        }).then(res => {
          console.log('res:', res.data)
          if (res?.data) {
            resData = JSON.parse(res.data.config)
          }
        })
      }
      return resData
    },
    async initCanvas () {
      const { name: routerName, id } = this.$route.params || {}
      console.info('路由参数:', routerName, id)
      if (!routerName) {
        // 初始化
        await this.$store.dispatch('canvas/init')
      } else {
        // 更新本地化
        const editData = await this.getEditCanvas(routerName, id)
        await this.$store.dispatch('canvas/init', { routerName, data: editData })
      }
      this.$nextTick(() => {
        this.formItemConfig = this.allCanvas[this.canvasName]?.body?.[0] || {}
      })
    },
    async initResource () {
      await this.$store.commit('resources/init')
      // await this.$store.commit('resources/initGroup')
    },
    handlePreview (command) {
      // console.info('点击预览:', command)
      this[command].call()
    },
    // 普通预览
    async onPreview () {
      this.previewProps.data = this.allCanvas[this.canvasName]
      this.componentVM = templateRegister[this.previewProps.data?.template]
      this.previewProps.visable = !this.previewProps.visable
      // console.info('previewProps:', this.previewProps)
    },
    // 在线预览
    async handleOnlinePreview () {
      const curCanvas = this.allCanvas[this.canvasName] || {}
      const { configId, routerName } = curCanvas
      if (configId) {
        const { hash, href } = window.location
        const newPath = href.replace(hash, `#/online/${routerName}/${configId}`)
        // 在线预览属于可能频繁打开，带窗口命名跳转
        window.open(newPath + '?mode=1', routerName)
      }
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
    },
    afterPublish ({ name, configId, isUpdate }) {
      // 新窗口打开在线预览页面
      const { hash, href } = window.location
      const newPath = href.replace(hash, `#/online/${name}/${configId}`)
      const h = this.$createElement
      const text = isUpdate ? '编辑' : '发布'
      this.$msgbox({
        title: text + '成功',
        message: h('p', null, [
          h('span', null, text + '在线预览成功, 查看地址:'),
          h('i', { style: { color: '#3171F2' } }, newPath)
        ]),
        confirmButtonText: '跳转查看'
      }).then(action => {
        window.open(newPath + '?mode=1', name)
      })
    },
    // 发布在线预览，数据上传服务端（TODO）
    publishOnline () {
      /* :is="componentVM", :config="previewProps.data", :isTest="true", @onCloseDialog="previewProps.visable=false" */
      const curCanvas = this.allCanvas[this.canvasName]
      const hasPublic = curCanvas?.configId
      // console.log('是否已经发布:', hasPublic)
      if (!hasPublic) {
        this.$prompt('请赐予页面名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[A-Za-z0-9]+$/,
          inputErrorMessage: '请输入英文或数字',
          closeOnClickModal: false,
          closeOnPressEscape: false,
          closeOnHashChange: false
        }).then(({ value }) => {
          // 上传服务端
          this.$normalRequire({
            url: '/fileserver/ui/config/save',
            method: 'post',
            data: {
              config: JSON.stringify({
                ...this.previewProps.data,
                routerName: value
              })
            }
          }).then(res => {
            // console.log('配置数据上传服务端后:', res)
            if (res && res.data) {
              // 更新画布信息
              this.$store.commit('canvas/assignConfig', {
                name: this.canvasName,
                assignObj: {
                  configId: res.data?.id,
                  routerName: value
                }
              })
              this.$nextTick(() => {
                this.onSave(false)
              })
              // 创建新页面
              this.afterPublish({ name: value, configId: res?.data?.id })
            }
          })
        })
      } else {
        this.updateOnline(curCanvas)
      }
    },
    updateOnline (canvas) {
      const { configId, routerName } = canvas
      this.$normalRequire({
        url: `/fileserver/ui/config/edit/${configId}`,
        method: 'POST',
        data: {
          config: JSON.stringify(canvas)
        }
      }).then(res => {
        // console.info('res:', res)
        if (res.code !== -1) {
          this.$nextTick(() => {
            this.onSave(false)
          })
          this.afterPublish({ name: routerName, configId, isUpdate: true })
        } else {
          this.$message.error(res)
        }
      })
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
  height: calc(100vh - 50px)
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
    flex: 4 1 auto
    height: 100%
    display: flex
    flex-direction: column
    overflow: auto
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

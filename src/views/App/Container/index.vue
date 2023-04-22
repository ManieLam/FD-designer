<template lang='pug'>
.container-wrap(v-if="afterLoading")
  .left-panel
    WidgetPanel(@onDragged="onDragged")
  .center-panel
    .tool-panel.d-flex-row-between
      //- 左边工具栏
      el-button-group.tool-wrap__left
        //- el-button() 切换画布
        el-button(@click="toggleSettingJson") 查看配置文件
        //- 切换画布
        el-dropdown(key="canvasToggle", @command="handleChangeCanvas")
          el-button {{ `当前画布：${actCanvas.routerName}(${actCanvas.canvasTitle})` || '切换画布'}}
            i.el-icon-arrow-down.el-icon--right
          el-dropdown-menu.dropdown-menu__canvas(style="width: 300px;text-align:right", slot="dropdown")
            el-dropdown-item.dropdown-item(v-for="canvas in canvasKeysInLimit", :command="canvas.name", :key="canvas.name")
              .left-text
                i.m-r-4.color-primary(:class="actCanvas.id ? canvas.id === actCanvas.configId : canvas.name === canvasName ? 'el-icon-check' : ''")
                span {{canvas.name || ''}}
                span {{canvas.title ? `（ ${canvas.title} ）` : ''}}
              .right-text.btn-icon.el-icon-close.color-primary(
                style="z-index: 2;"
                title="丢弃修改的数据，并关闭"
                @click.prevent.stop="() => onCloseCanvas(canvas.name, canvas.id)")
            el-dropdown-item(divided)
            el-dropdown-item(icon="el-icon-position") 批量发布（TODO）
            el-dropdown-item(icon="el-icon-close") 批量关闭（TODO）
            //- el-dropdown-item(icon="el-icon-plus") 快捷打开（TODO）
            el-dropdown-item(icon="el-icon-search", command="more") 查看更多画布
        //- TODO 快捷打开
      //- 右边工具栏
      el-button-group.tool-wrap__right
        //- 打开
        el-button(@click="onCreate") 新建
        el-button(:disabled="!canvasKeysInLimit.length", @click="toExportProps.visable=true") 导出
        el-button(:disabled="preventSingleSaved", @click="onCopied") 复制
        el-button(:disabled="preventSingleSaved", @click="onClear") 清空
        //- el-button(:disabled="actCanvas|saveable", @click="onPreview") 预览
        el-button(type="primary", :disabled="preventSingleSaved", @click="onSave") 暂存
        el-button(type="primary", :disabled="preventSingleSaved", @click="publishOnline") 发布
        el-dropdown(key="preview", :disabled="preventSingleSaved", @command="handlePreview")
          el-button 预览
            i.el-icon-arrow-down.el-icon--right
          el-dropdown-menu(slot="dropdown")
            el-dropdown-item
              //- 环境
              span.secondary-text 当前画布服务环境：
              span.color-primary.font-secondary {{actCanvas && actCanvas.env ? (actCanvas.env.inuse.title) : '无环境'}}
                i.m-l-8.el-icon-edit.cursor-pointer(key="canvasENV", title="切换环境", @click="handleCheckEnv")
            el-dropdown-item(command="onPreview") 预览
            el-dropdown-item(:disabled="!actCanvas.configId", command="handleOnlinePreview") 在线预览
    //- :canvas="canvasName|getActCanvas(allCanvas)"
    //- .tool-panel.d-flex-v-center.m-t-8
    //-   //- 环境
    //-   span.secondary-text 当前api请求环境：
    //-   span.color-primary.font-secondary {{actCanvas && actCanvas.env ? (actCanvas.env.inuse.title) : '无环境'}}
    //-     i.m-l-8.el-icon-edit.cursor-pointer(key="canvasENV", title="切换环境", @click="handleCheckEnv")
    DragPage.drag-page-container(
      ref="dragPanel"
      :key="canvasName"
      :formItemConfig="formItemConfig"
      :canvasName="canvasName"
      :canvas="actCanvas"
      v-model="canvasBody"
      @onSelectItem="onSelectElement"
      @update="updateFieldList")
  .right-panel(v-if="toggleSettingOpen")
    SettingPanel(
      ref="settingPanel"
      :key="canvasName"
      :canvas="actCanvas"
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
  //- 画布
  SmartDialog(
    title="已发布的画布列表"
    width="95%"
    size="lg"
    v-model="moreCanvas.visable")
    CanvasTable(@close="openCanvasByConfig")
  //- 查看环境配置
  WebserverSetter(
    ref="webserverSetter"
    :canvas="actCanvas"
    :actions="webServiceActions"
    @onSave="onSaveWebService"
    v-model="webserverSetting")
</template>

<script>
/** */
import WidgetPanel from '../WidgetPanel'
import DragPage from '@/views/DragPage'
// import CanvasPanel from '../CanvasPanel'
import SettingPanel from '@/views/SettingPanel'
import CodeEditor from '@/components/CodeEditor'
import CanvasTable from '@/views/CanvasTable'
import WebserverSetter from '@/components/ConfigSetter/WebserverSetter'

// import Draggable from 'vuedraggable'
import { debounce, isNil } from 'lodash'

import headerMethods from './methods/header'
import requireMethods from './methods/require'
import exportMethods from './methods/export'
// import FromTemp from '@/components/Translator/Template/Form'
// console.info(FromTemp)
export default {
  name: 'AppContainer',
  mixins: [
    headerMethods, // 头部的相关操作
    requireMethods, // 请求发送的相关操作
    exportMethods // 导出的相关操作
  ],
  components: {
    // Draggable,
    DragPage,
    WidgetPanel,
    SettingPanel,
    CodeEditor,
    CanvasTable,
    WebserverSetter
    // FromTemp
  },
  data () {
    return {
      // actName: 0, // 活动的画布index
      formItemConfig: {},
      /* 预览 */
      previewProps: {
        visable: false,
        data: {}
      },
      /* 展示更多已发布画布 */
      moreCanvas: {
        visable: false
      },
      formLabelHidden: false, // 表单字段是否隐藏
      afterLoading: false,
      isEditMode: false, // 编辑模式
      componentVM: 'FormTemp', // 暂且是表单类型，TODO 扩展其他类型
      computedBody: [],
      CANVASMAX: 8 // 一次性可以打开画布的数量
    }
  },
  filters: {
    getActCanvas (name, all) {
      return all[name] || {}
    },
    prevent (body) {
      // console.info('prevent:', !body, !body.length)
      return !body || !body.length
    },
    filterCanvasStr (obj) {
      return JSON.stringify(obj, null, 4)
    }
  },
  computed: {
    canvasName () {
      return this.$store.state.canvas.editingName || 'canvas_0'
    },
    allCanvas () {
      return this.$store.state.canvas.canvas
    },
    canvasKeysInLimit () {
      // .slice(0, this.CANVASMAX) 限制
      return Object.entries(this.allCanvas).map(([key, r]) => {
        return {
          id: r.configId,
          name: key,
          title: r.canvasTitle
        }
      })
    },
    actCanvas () {
      // return this.allCanvas[this.canvasName] || {} // 无效
      // TODO 下个版本迭代成多个
      // ---有缓存，出现置后性
      return this.afterLoading ? this.$store.getters.getCurView : {}
    // },
    },
    canvasBody: {
      get () {
        // return this.actCanvas?.body || []
        return this.computedBody || []
      },
      set (list) {
        this.computedBody = list
        // updateHoldWidget
        this.$store.commit('canvas/UPDATE_HOLD_WIDGET', {
          name: this.canvasName,
          elements: list
        })
      }
    },
    preventSingleSaved () {
      return !this.canvasBody || !this.canvasBody.length
    },
    allCanvasStr () {
      return JSON.stringify(this.allCanvas, null, '\t')
    // },
    // // 画布内已选的异步请求链接
    // hadRemoteResource () {
    //   return this.getResourceCurSetting()
    },
    isEdit () {
      const { name, id } = this.$route.params
      return name && id
    // },
    // 获取actCanvas会有延迟，不生效
    // formLabelHidden () {
    //   return this.afterLoading ? this.actCanvas?.attrs?.labelHidden : false
    }
  },
  watch: {
    formLabelHidden: {
      handler (flag, oldFlag) {
        // console.info('改变画布标签:', flag, oldFlag)
        if (!isNil(flag) && flag !== oldFlag && this.actCanvas.body) {
          const checkList = []
          this.actCanvas.body.forEach(f => {
            if (isNil(f.labelHidden) || f.__labelHiddenByForm) {
              this.$set(f, 'labelHidden', flag)
              this.$set(f, '__labelHiddenByForm', true)
            } else {
              checkList.push(f)
            }
          })
        }
      }
    },
    actCanvas: {
      deep: true,
      immediate: true,
      handler (canvas, oldCanvas) {
        // console.log('actCanvas:', canvas)
        this.computedBody = canvas?.body
        // this.formLabelHidden = canvas?.attrs?.labelHidden
      }
    }
  },
  /* 对画布的操作methods */
  methods: {
    toggleMoreCanvas () {
      this.moreCanvas.visable = !this.moreCanvas.visable
    },
    updateFieldList (list) {
      // console.log('更新整个body:', list)
      this.canvasBody = list
    },
    updateConfig (type, newData) {
      // console.log('更新', type, newData)
      if (type === 'comp') {
        if (newData.labelHidden !== this.formLabelHidden) {
          newData.__labelHiddenByForm = false
        }
        this.formItemConfig = newData
        this.updateFieldConfig(newData)
      }
      if (type === 'assist') {
        // 卡槽设计
        this.formItemConfig = { ...this.formItemConfig, ...newData }
        // 更新主字段属性（卡槽属性包含在主字段属性内）
        this.updateFieldConfig(this.formItemConfig)
      }
      if (type === 'formAttrs') {
        // 表单标签隐藏的属性，影响全局字段
        this.formLabelHidden = newData.labelHidden
      }
      this.$forceUpdate()
      // console.log('containers 更新', this.actCanvas)
      // this.formItemConfig = attrs
    },
    // 更新字段属性
    updateFieldConfig (attrs) {
      if (!this.formItemConfig || !attrs) return
      const eindex = this.canvasBody.findIndex(field => field.key === this.formItemConfig.key)
      if (eindex !== -1) {
        this.$set(this.canvasBody, eindex, attrs)
      }
    },
    // 废弃
    onDragged: debounce(({ from, to }) => {
      // console.info('on Dragged', from, to)
    }, 800),
    // onChangeItem (item) {
    //   console.log('onChangeItem:', item)
    // },
    /** type: form/component/assist
     * 根据type切换tab */
    onSelectElement ({ type, data, assistType }) {
      // console.info('选中数据:', type, data)
      const compTab = type === 'component' || type === 'assist'
      if (compTab) {
        this.formItemConfig = data
        this.$nextTick(() => { this.$forceUpdate() })
      }
      // 设置第一层tab(组件/行为/辅助)
      let actName = ''
      switch (type) {
        case 'button':
        case 'form': actName = 'form'; break
        default: actName = type; break
      }

      this.$refs.settingPanel.activeName = actName
      // 切换tab到辅助区
      this.$refs.settingPanel.tabList[2].props = assistType ? { type: assistType } : {}
      // 切换表单/a按钮配置
      this.$nextTick(() => {
        if (!compTab) {
          const tabEL = this.$refs.settingPanel.$refs?.form?.[0]
          if (tabEL) {
            // 表单的按钮组切换到表单按钮设置的tab
            type === 'button' ? tabEL.togggleTab('button') : tabEL.togggleTab('attr')
          }
        }
      })
    },
    async initCanvas () {
      const { name: routerName, id } = this.$route.params || {}
      // console.info('路由参数:', routerName, id)
      if (id == null) {
        // 初始化
        await this.$store.dispatch('canvas/init')
      } else {
        // 更新本地化
        const editData = await this.getEditCanvas(routerName, id)
        // console.log('编辑在线预览数据:', editData)
        if (editData) {
          const { routerName: newRName } = editData
          // 以最终数据返回的routerName名称为准, 地址栏不可信
          await this.$store.dispatch('canvas/init', { routerName: newRName, data: editData })
        } else {
          await this.$store.dispatch('canvas/init')
        }
      }
      this.$nextTick(() => {
        // console.info('当前canvas', this.actCanvas)
        this.formItemConfig = this.actCanvas?.body?.[0] || {}
        this.formLabelHidden = this.actCanvas?.attrs?.labelHidden
        // this.toggleRouter(this.actCanvas?.routerName)
      })
    },
    async initResource () {
      await this.$store.commit('resources/INIT')
      // await this.$store.commit('resources/initGroup')
    },
    toggleRouter (name = this.actCanvas.routerName) {
      // console.log('this.actCanvas:', name, this.actCanvas)
      if (this.actCanvas.configId && this.$route.params.name !== name) {
        this.$router.push({ name: 'DesignerEdit', params: { name: this.canvasName, id: this.actCanvas.configId } })
      } else if (this.$route.name !== 'Designer') {
        this.$router.push({ name: 'Designer' })
      }
    },
    copyOnlinePath (path) {
      navigator.clipboard.writeText(path).then(() => {
        this.$message.success('复制地址成功')
      })
    },
    // 关闭选择更多画布弹窗(单个)/快捷搜索打开某个画布
    async openCanvasByConfig (canvas = {}, multiEditing) {
      if (!multiEditing) this.moreCanvas.visable = false
      // console.log('canvas:', canvas)
      const name = canvas.canvasName
      // 更新本地化
      const editData = await this.getEditCanvas(name, canvas.id)
      // console.log('编辑在线预览数据:', editData)
      if (editData) {
        const { routerName: newRName } = editData
        // 以最终数据返回的routerName名称为准, 地址栏不可信
        await this.$store.dispatch('canvas/init', { routerName: newRName, data: editData })
      } else {
        await this.$store.dispatch('canvas/init')
      }
      this.$nextTick(() => {
        // console.info('当前canvas', this.actCanvas)
        this.formItemConfig = this.actCanvas?.body?.[0] || {}
        this.formLabelHidden = this.actCanvas?.attrs?.labelHidden
        // this.toggleRouter(this.actCanvas?.routerName)
      })
    },
    // 保存画布环境的修改
    onSaveWebService (envList = []) {
      this.$store.commit('canvas/UPDATE_SERVER', {
        name: this.canvasName,
        data: envList,
        type: 'list'
      })
    }
  },
  created () {
    this.afterLoading = false
    this.initCanvas()
    this.initResource()
    this.$nextTick(() => {
      this.$store.commit('canvas/INIT_SERVER', { name: this.canvasName })
    })
  },
  mounted () {
    this.afterLoading = true
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

// .drag-page-container
//   position: relative
//   &::before
//     content: 'aaa'
//     position: absolute
//     top: 0
//     left: 0
//     border: 1px dotted $--border-color-light
//     padding: 4px
//     width: 100%
//     height: 26px

.dropdown-menu__canvas
  width: 200px
  text-align: right
  max-height: 400px
  overflow-y: auto
.dropdown-item
  line-height: 2.6
  display: flex
  justify-content: space-between
  align-items: center
  .right-text:hover
    border: 1px solid
    padding: 2px
    border-radius: 50%
</style>

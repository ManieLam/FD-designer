<template lang='pug'>
.container-wrap(v-if="afterLoading")
  .left-panel
    WidgetPanel(@onDragged="onDragged")
  .center-panel
    //- TODO 支持多个画布
    //- router-view
    .tool-panel.d-flex-row-between
      //- 左边工具栏
      el-button-group.tool-wrap__left
        //- el-button() 切换画布
        el-button(@click="toggleSettingJson") 查看配置文件
        el-dropdown(key="canvasToggle", @command="handleChangeCanvas")
          el-button {{ `当前画布：${canvasName}` || '切换画布'}}
            i.el-icon-arrow-down.el-icon--right
          el-dropdown-menu(style="width: 150px;text-align:right", slot="dropdown")
            el-dropdown-item.dropdown-item(v-for="cName in canvasKeysInLimit", :command="cName", :key="cName", :icon="cName === canvasName ? 'el-icon-check' : ''")
              .left-text  {{cName || ''}}
              .right-text.btn-icon.el-icon-close.color-primary(
                style="z-index: 2;"
                title="丢弃修改的数据，并关闭"
                @click.prevent.stop="() => onCloseCanvas(cName)")
            el-dropdown-item(divided, command="more", style="margin-left: 20px", icon="el-icon-position") 查看更多画布
      //- 右边工具栏
      el-button-group.tool-wrap__right
        //- computed中设立saveable无法监听到store的变化
        el-button(:disabled="!canvasKeysInLimit.length", @click="toExportProps.visable=true") 导出
        el-button(@click="onCreate") 新建
        el-button(:disabled="preventSingleSaved", @click="onClear") 清空
        //- el-button(:disabled="actCanvas|saveable", @click="onPreview") 预览
        el-dropdown(key="preview", :disabled="preventSingleSaved", @command="handlePreview")
          el-button 预览
            i.el-icon-arrow-down.el-icon--right
          el-dropdown-menu(slot="dropdown")
            el-dropdown-item(command="onPreview") 预览
            el-dropdown-item(:disabled="!actCanvas.configId", command="handleOnlinePreview") 在线预览
        el-button(type="primary", :disabled="preventSingleSaved", @click="onSave") 暂存
        el-button(type="primary", :disabled="preventSingleSaved", @click="publishOnline") 发布
    //- :canvas="canvasName|getActCanvas(allCanvas)"
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
</template>

<script>
/** */
import WidgetPanel from './WidgetPanel'
import DragPage from '../DragPage'
// import CanvasPanel from '../CanvasPanel'
import SettingPanel from '../SettingPanel'
// import Draggable from 'vuedraggable'
import { debounce, isNil, max } from 'lodash'
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
    canvasKeysInLimit () {
      // .slice(0, this.CANVASMAX) 限制
      return Object.keys(this.allCanvas)
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
        this.$store.commit('canvas/updateHoldWidget', {
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
  methods: {
    toggleSettingJson () {
      this.$forceUpdate()
      this.$nextTick(() => {
        this.settingJsonVisable = !this.settingJsonVisable
      })
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
    onCreate () {
      const nameList = Object.keys(this.allCanvas).map(n => n.replace(/canvas_(\d+)/, '$1')).filter(name => !isNaN(name))
      let newName = 0
      if (nameList.length) {
        let maxNum = max(nameList)
        newName = ++maxNum
        // console.log('newName:', newName)
      }
      this.$store.commit('canvas/add', { name: `canvas_${newName}` })
      this.$forceUpdate()
    },
    onClear () {
      this.$refs.dragPanel.clear()
      this.$refs.settingPanel.clear()
      this.formItemConfig = {}
      this.$store.commit('canvas/clear', this.canvasName)
      if (!this.isEdit) {
        // 非编辑状态才清除本地缓存
        sessionStorage.removeItem('Canvas-all')
        sessionStorage.removeItem('Canvas-editing')
      }
    },
    onSave (alert = true) {
      // this.$refs.dragPage.save()
      // if (!this.isEdit) {
      //   // 非编辑状态保存数据
      //   sessionStorage.setItem('Canvas-all', JSON.stringify(this.allCanvas))
      //   sessionStorage.setItem('Canvas-editing', this.canvasName)
      //   if (alert) this.$message.success('保存成功')
      // }
      // 非编辑状态保存数据
      sessionStorage.setItem('Canvas-all', JSON.stringify(this.allCanvas))
      sessionStorage.setItem('Canvas-editing', this.canvasName)
      if (alert) this.$message.success('暂存成功')
    },
    onCloseCanvas (cName) {
      this.$store.dispatch('canvas/closeCanvas', cName)
      this.$nextTick(() => {
        this.formItemConfig = this.actCanvas?.body?.[0] || {}
        this.formLabelHidden = this.actCanvas?.attrs?.labelHidden
        this.toggleRouter(this.actCanvas?.routerName)
      })
    },
    async getEditCanvas (rName, id) {
      let resData = {}
      if (rName && id) {
        await this.$normalRequire({
          url: `/fileserver/ui/config/get/${id}`
        }).then(res => {
          if (res?.data) {
            resData = {
              ...JSON.parse(res.data.config),
              configId: res.data.id
            }
          } else {
            // console.log('不存在id')
            resData = null
            this.$confirm(
              '当前查看的画布不存在，是否需要新增一个的画布',
              '提醒',
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }
            ).then(confirm => {
              if (confirm) {
                this.onCreate()
                this.toggleRouter()
              }
            })
          }
        })
      }
      return resData
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
    toggleRouter (name = this.actCanvas.routerName) {
      // console.log('this.actCanvas:', name, this.actCanvas)
      if (this.actCanvas.configId && this.$route.params.name !== name) {
        this.$router.push({ name: 'DesignerEdit', params: { name: this.canvasName, id: this.actCanvas.configId } })
      } else if (this.$route.name !== 'Designer') {
        this.$router.push({ name: 'Designer' })
      }
    },
    // 切换画布
    handleChangeCanvas (command) {
      // console.log('command:', command)
      this.formItemConfig = {}
      if (command === this.canvasName) return // 防重复点击
      if (command !== 'more') {
        this.$store.commit('canvas/toggle', command)
        // 切换字段元素
        this.formItemConfig = this.actCanvas?.body?.[0]
        // 修改路由
        this.toggleRouter(command)
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
          // this.$nextTick(() => {
          //   this.onSave(false)
          // })
          this.afterPublish({ name: routerName, configId, isUpdate: true })
          this.$message.success('发布成功')
        } else {
          this.$message.error(res)
        }
      })
    }
  },
  created () {
    this.afterLoading = false
    this.initCanvas()
    this.initResource()
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

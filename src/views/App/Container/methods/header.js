import { max } from 'lodash'
import { templateRegister } from '@/components/Translator/index.js'
import { getDefaultService } from '@/model/service.js'
export default {
  data () {
    return {
      settingJsonVisable: false, // 查看json数据
      toggleSettingOpen: true, // 切换配置区
      webserverSettingVisable: false, // 查看环境
      webServiceActions: [
        {
          label: '应用当前画布',
          name: 'apply',
          type: 'primary',
          func: this.changeEnvInuse
        }
      ]
    }
  },
  methods: {
    // 查看环境
    handleCheckEnv () {
      this.webserverSettingVisable = !this.webserverSettingVisable
    },
    // 切换正在使用的环境
    changeEnvInuse ({ envs, selected }) {
      if (!selected.urls.length) {
        this.$confirm(
          '当前没有配置服务，不能应用到当前环境',
          '错误',
          {
            confirmButtonText: '重新设置'
          }
        )
        return
      }
      // 不用在这里更新所有画布中的接口前缀，只更新画布中的env.inuse数据，在所有显示的地址，写了相对地址的替换即可。在渲染预览中，一次性格式化
      this.$store.commit('canvas/ASSIGN_CONFIG', {
        name: this.canvasName,
        assignObj: {
          env: {
            inuse: getDefaultService(selected), // 只需要记住环境，都是默认服务，服务是不需要保存切换的，只有到具体接口才需要切换服务
            list: envs
          }
        }
      })
      // 关闭弹窗
      this.webserverSettingVisable = false
    },
    // 查看配置文件
    toggleSettingJson () {
      // this.$forceUpdate()
      this.$nextTick(() => {
        this.settingJsonVisable = !this.settingJsonVisable
        console.log('toggleSettingJson', this.settingJsonVisable)
      })
    },
    // 切换画布
    handleChangeCanvas (command) {
      // console.log('command:', command)
      this.formItemConfig = {}
      if (command === this.canvasName) return // 防重复点击
      if (command !== 'more') {
        this.$store.commit('canvas/TOGGLE', command)
        // 切换字段元素
        this.formItemConfig = this.actCanvas?.body?.[0]
        // 修改路由
        this.toggleRouter(command)
      } else if (command === 'more') {
        this.toggleMoreCanvas()
      }
    },
    // 新建
    onCreate () {
      const nameList = Object.keys(this.allCanvas).map(n => n.replace(/^canvas_(\d+)/, '$1')).filter(name => !isNaN(name))
      let newName = 0
      if (nameList.length) {
        let maxNum = max(nameList)
        newName = ++maxNum
        // console.log('newName:', newName)
      }
      this.$store.commit('canvas/ADD', { name: `canvas_${newName}` })
      this.$forceUpdate()
    },
    // 复制
    onCopied () {
      this.$store.dispatch('canvas/copyCanvas', this.actCanvas)
    },
    // 清空
    onClear () {
      this.$refs.dragPanel.clear()
      this.$refs.settingPanel.clear()
      this.formItemConfig = {}
      this.$store.commit('canvas/CLEAR', this.canvasName)
    },
    // 暂存
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
    // 发布
    // publishOnline () {},
    // 预览
    handlePreview (command) {
      // console.info('点击预览:', command)
      if (!command) return
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
    // 关闭画布
    onCloseCanvas (name, id) {
      this.$store.dispatch('canvas/closeCanvas', { name, id })
      this.$nextTick(() => {
        this.formItemConfig = this.actCanvas?.body?.[0] || {}
        this.formLabelHidden = this.actCanvas?.attrs?.labelHidden
        this.toggleRouter(this.actCanvas?.routerName)
      })
    }
  }
}

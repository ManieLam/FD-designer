export default {
  methods: {
    async getEditCanvas (rName, id) {
      let resData = {}
      if (rName && id) {
        await this.$normalRequire({
          url: `/fileserver/ui/config/get/${id}`
        }).then(res => {
          if (res?.data) {
            resData = {
              ...JSON.parse(res.data.config),
              configId: res.data.id,
              canvasTitle: res.data.canvasTitle,
              canvasName: res.data.canvasName
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
    // 发布在线预览，数据上传服务端
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
                ...curCanvas,
                canvasTitle: '',
                routerName: value,
                canvasName: value // 用于计算未发布前copeied次数
              }),
              canvasName: value,
              canvasTitle: ''
            }
          }).then(res => {
            // console.log('配置数据上传服务端后:', res)
            if (res && res.data) {
              // 创建新页面
              this.afterPublish({ name: value, configId: res?.data?.id })
            }
          })
        })
        // console.log('curCanvas:', curCanvas)
      } else {
        this.updateOnline(curCanvas)
      }
    },
    afterPublish ({ name, configId, isUpdate }) {
      // 更新画布信息 assignConfig
      this.$store.commit('canvas/ASSIGN_CONFIG', {
        name: this.canvasName,
        assignObj: {
          configId: configId, // 首次发布前没有configId，需要补充
          routerName: name
        }
      })
      this.$nextTick(() => {
        this.onSave(false)
        this.$store.commit('canvas/TOGGLE', name)
        this.$forceUpdate()
      })
      // 新窗口打开在线预览页面
      const { hash, href } = window.location
      const newPath = href.replace(hash, `#/online/${name}/${configId}`)
      const h = this.$createElement
      const text = isUpdate ? '编辑' : '发布'
      this.$msgbox({
        title: text + '成功',
        message: h('p', null, [
          h('span', null, text + '在线预览成功, 查看地址:'),
          h('i', { style: { color: '#3171F2' } }, newPath),
          h('span', {
            style: { color: '#3171F2', padding: '8px', cursor: 'pointer' },
            on: {
              click: () => this.copyOnlinePath(newPath)
            }
          },
          '复制')
        ]),
        confirmButtonText: '跳转查看'
      }).then(action => {
        window.open(newPath + '?mode=1', name)
      })
    },
    updateOnline (canvas) {
      // console.log('更新发布:', canvas)
      const { configId, routerName, canvasTitle } = canvas
      this.$normalRequire({
        url: `/fileserver/ui/config/edit/${configId}`,
        method: 'POST',
        data: {
          config: JSON.stringify(canvas),
          canvasName: routerName,
          canvasTitle
        }
      }).then(res => {
        // console.info('res:', res)
        if (res.code !== -1) {
          // this.$nextTick(() => {
          //   this.onSave(false)
          // })
          this.afterPublish({ name: routerName, configId, isUpdate: true })
          // this.$message.success('发布成功')
        } else {
          this.$message.error(res)
        }
      })
    }
  }
}

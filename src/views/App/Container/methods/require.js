export default {
  methods: {
    async getEditCanvas (rName, id) {
      let resData = {}
      if (rName && id) {
        await this.$normalRequire({
          url: this.$api.canvas.getDetail(id)
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
      const hasPublic = !!curCanvas?.configId
      // console.log('是否已经发布:', hasPublic)
      this.publishAttrData = {
        canvasName: curCanvas.routerName,
        keepEnv: curCanvas.env?.keepEnv || 0
      }
      // 已发布则禁用修改发布名称
      this.$set(this.publishAttr.formProp.formFields[0].form, 'disabled', hasPublic)
      this.publishAttr.visable = true
    },
    onSelectPublishEnv (select) {
      // console.log('on select:', select)
      if (select) {
        const { service } = this.$store.getters.getEnvByName(select, 'BASE')
        this.publishAttrData.env = select
        this.publishAttrData.envURL = service.url
      } else {
        this.publishAttrData.env = ''
        this.publishAttrData.envURL = ''
      }
    },
    validateEnvInput (str) {
      this.publishAttrData.envURL = str
      this.$refs.publishAttrForm.$refs.dataform.validateField('env')
    },
    postPublish ({ formData }) {
      // 上传服务端
      // console.log('formData:', formData)
      const { canvasName, keepEnv } = formData
      const curCanvas = this.allCanvas[this.canvasName]
      this.$refs.publishAttrForm.$refs.dataform.validate(valid => {
        if (valid) {
          const configData = {
            ...curCanvas,
            // env: !isNoEnv && envURL ? {
            //   ...curCanvas.env,
            //   inuse: [env, 'BASE', envURL]
            // } : curCanvas.env,
            env: { ...curCanvas.env, inuse: keepEnv ? curCanvas.env?.inuse : ['', '', ''], keepEnv }, // 跟随部署环境请求的inuse采用3位取空的数组
            canvasTitle: '',
            routerName: canvasName,
            canvasName: canvasName // 用于计算未发布前copeied次数
          }
          console.log('提交配置:', configData)
          this.$normalRequire({
            url: this.$api.canvas.save,
            method: 'post',
            data: {
              config: JSON.stringify(configData),
              canvasName: canvasName,
              canvasTitle: ''
            }
          }).then(res => {
            // console.log('配置数据上传服务端后:', res)
            if (res && res.data) {
              // 创建新页面
              this.afterPublish({ name: canvasName, configId: res?.data?.id, data: configData })
            }
          })
        }
      })
    },
    updateOnline (canvas) {
      // console.log('更新发布:', canvas)
      const { configId, routerName, canvasTitle } = canvas
      // const configData = {
      //   ...curCanvas,
      //   // env: !isNoEnv && envURL ? {
      //   //   ...curCanvas.env,
      //   //   inuse: [env, 'BASE', envURL]
      //   // } : curCanvas.env,
      //   env: { ...curCanvas.env, inuse: keepEnv ? curCanvas.env?.inuse : ['', '', ''], keepEnv }, // 跟随部署环境请求的inuse采用3位取空的数组
      //   canvasTitle: '',
      //   routerName: canvasName,
      //   canvasName: canvasName // 用于计算未发布前copeied次数
      // }
      this.$normalRequire({
        url: this.$api.canvas.edit(configId),
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
          this.afterPublish({ name: routerName, configId, isUpdate: true, data: canvas })
          // this.$message.success('发布成功')
        } else {
          this.$message.error(res)
        }
      })
    },
    afterPublish ({ name, configId, isUpdate, data }) {
      // 更新画布信息 assignConfig
      this.$store.commit('canvas/ASSIGN_CONFIG', {
        name: this.canvasName,
        assignObj: {
          configId: configId, // 首次发布前没有configId，需要补充
          routerName: name,
          ...data
        }
      })
      this.$nextTick(() => {
        this.onSave(false)
        this.publishAttr.visable = false
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
    }
  }
}

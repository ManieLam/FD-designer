<template lang='pug'>
el-dialog.webserver-setter-dialog(
  :title="dialogTitle"
  :visible.sync="dialogVisabled"
  width="90%"
  center
  :append-to-body="true"
  :close-on-click-modal="false"
  @close="$emit('refuse')")
  .webserver-setter-container
    .top-wrap.d-flex-row-between.m-b-8
      .left-wrap__top 当前使用环境：
        small.color-primary.left-top__tip {{ lastInuseENV.title }}
    //-       span 【{{envData.method}}】
    //-       span {{envData.url}}
    //-       span(v-show="envData.demo") {{envData.demo}}
      //- el-button-group.right-wrap__top
      //-   el-button(icon="el-icon-plus", @click="addApi") 新增数据源
    .bottom-wrap.d-flex-row-between
      //- 左
      ServerList(
        :selected="envData"
        v-model="envList"
        @onSelect="onSelectEnv")
      //- 右
      .right-wrap.d-flex-column.d-flex-1
        ServerContent(v-model="envData", @syncServer="syncServer")
        //- 下
        .right-bottom__fixed.d-flex-row-between
          el-button-group
            //- el-button(@click="testLink") 测试链接
            //- el-button(:disabled="!envData.name", title="保存至全局，允许下次继续使用", @click="globalSave(envData)") 保存至全局
          .button-group
            el-button-group
              el-button(
                v-for="btn in actionButtons"
                v-bind="btn"
                :key="btn.name"
                @click="() => btn.func(funcProps)") {{ btn.label }}
              //- el-button(@click="onClose") 关闭
              //- el-button(@click="onSave") 保存修改
              //- el-button(type="primary", :disabled="true", title="对分组内所有画布影响", @click="applyToGroup") 应用当前分组环境(TODO)
              //- el-button(type="primary", title="保存至当前画布，不影响全局", @click="applyToCanvas") 应用当前画布环境
</template>

<script>
/* 环境配置 */
import ServerList from './ServerList.vue'
import ServerContent from './ServerContent.vue'
// import { cloneDeep } from 'lodash' // , keyBy, difference
// import { ServiceModel } from '@/model/service'
export default {
  name: 'WebserverSetter',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    // 当前画布配置
    canvas: {
      type: Object,
      default: () => ({})
    },
    // 自定义方法
    actions: {
      type: Array,
      default: () => ([])
    }
  },
  components: {
    ServerContent,
    ServerList
  },
  data () {
    return {
      isChanged: false, // 环境是否有修改
      envList: this.canvas?.env?.list || this.$gbServer || [], // 环境列表，默认取本地环境, 只能删除自定义的环境
      // serviceList: defaultEnvConf, // 环境列表，默认取本地环境, 只能删除自定义的环境
      // envData: {}, // 环境配置数据
      serviceTemp: {},
      // lastInuseENV: {},
      defaultActions: [
        {
          label: '关闭',
          name: 'close',
          func: this.onclose
        },
        {
          label: '保存修改',
          name: 'save',
          func: this.onSave
        }
      ]
    }
  },
  computed: {
    lastInuseENV () {
      // 隔绝envData, 记录上次更改的环境数据
      return this.canvas ? this.$store.getters.getServerInuse?.env || {} : {}
    },
    funcProps () {
      return {
        envs: this.envList,
        selected: this.envData
      }
    },
    actionButtons () {
      return [].concat(
        this.defaultActions,
        this.actions
      )
    },
    // envList () {
    //   return this.canvas?.env?.list || this.$gbServer || []
    // },
    envData: {
      get () {
        return this.serviceTemp
      },
      set (value) {
        this.serviceTemp = value
      }
    },
    dialogTitle () {
      return this.canvas
        ? `${this.canvas?.routerName}(${this.canvas?.canvasTitle || ''})画布环境配置`
        : '环境配置'
    },
    dialogVisabled: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    },
    editingName () {
      return this.$store.state.canvas.editingName || ''
    }
  },
  // watch: {
  //   'this.canvas.env': {
  //     immediate: true,
  //     handler  (env) {
  //       if (env) {
  //         this.envList = env.list || this.$gbServer || []
  //         this.envData = cloneDeep(this.canvas?.env?.inuse)
  //       }
  //     }
  //   }
  // },
  methods: {
    init () {
      if (!this.canvas) {
        this.$store.commit('canvas/INIT_SERVER')
      }
      this.$nextTick(() => {
        console.log('初始化env：', this.canvas?.env?.list)
        this.envList = this.canvas?.env?.list || this.$gbServer || []
        // const inuse = this.canvas?.env?.inuse
        this.envData = this.$store.getters.getServerInuse?.env || {}
      })
      // this.$store.commit('server/syncServices')
      // // this.envData = this.$gbServer?.[0]
      // this.$nextTick(() => {
      //   const [ip] = this.$store.getters.getServerInuse
      //   this.envData = this.$store.getters.getServerByName(ip)
      // })
    },
    // 同步更新画布中的默认服务地址
    syncServer (newUrls = []) {
      this.$set(this.envData, 'urls', newUrls)
      // this.$store.commit('canvas/UPDATE_SERVER', {
      //   name: this.canvas.routerName,
      //   data: newUrls,
      //   type: 'serviceOptions'
      // })
    },
    // 保存环境修改
    onSave ({ selected, envs }) {
      // 只保存当前
      const newList = this.envList
      const index = newList.findIndex(env => env.name === this.envData.name)
      // console.log('保存:', index)
      if (index > -1) {
        this.$set(this.envList, index, this.envData)
      }
      // TODO 同步每个环境中的服务, 只同步类型，不同步url
      /* const newUrlObj = keyBy(this.envData.urls, 'name')
      const urlKeys = Object.keys(newUrlObj)
      // 只对default: true的环境，且非本环境做修改
      const newEnvList = this.envList.list?.map((env) => {
        if (env.default && env.name !== this.envData.name) {
          const curKeys = keyBy(env.urls, 'name')
          const others = difference(urlKeys, Object.keys(curKeys))?.map(key => new ServiceModel(newUrlObj[key]))
          console.log('others:', others)
          // urls = urls.concat(others)
          return {
            ...env,
            urls: env.urls.concat(others)
          }
        } else {
          return this.envData
        }
      })
      console.log('新环境列表:', newEnvList) */
      this.$emit('onSave', newList)
    },
    // 切换选择环境
    onSelectEnv (env) {
      this.envData = env
    },
    onclose () {
      this.dialogVisabled = false
      this.$emit('close')
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped lang="sass">
.webserver-setter-dialog ::v-deep .el-dialog
  margin-top: 2vh !important

.webserver-setter-container
  height: 80vh
  display: flex
  flex-direction: column
  overflow: hidden
  .bottom-wrap
    overflow-y: hidden
    height: 100%

.left-wrap, .right-wrap
  // border: 1px solid $--border-color-base
  padding: 8px

.right-wrap
  flex: 1 0 auto
  // max-width: 70%
  // overflow-y: auto
  position: relative
  transform: translate(0)
  border-left: 1px solid $--border-color-base
  .right-custom-data
    height: 100%
    overflow-y: auto
  .right-bottom__fixed
    width: 100%
    text-align: center
    background: #fff
    padding-top: 8px
    box-shadow: 0px -3px 2px rgb(220 223 230 / 30%)

.left-top__tip
  span + span
    &::before
      content: '-'
      margin-left: 4px
      margin-right: 4px

.left-api-group
  & + .left-api-group
    margin-top: 8px

.label-absolute
  position: absolute
  left: 10px
  top: 0

.form-item-label_w100
  ::v-deep .el-form-item__label
    width: 100%
</style>

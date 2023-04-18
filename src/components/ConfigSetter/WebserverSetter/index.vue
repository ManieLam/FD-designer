<template lang='pug'>
el-dialog.webserver-setter-dialog(
  title="环境服务配置"
  :visible.sync="dialogVisabled"
  width="90%"
  center
  :append-to-body="true"
  :close-on-click-modal="false"
  @close="$emit('refuse')")
  .webserver-setter-container
    //- .top-wrap.d-flex-row-between.m-b-8
    //-   .left-wrap__top 环境
    //-     small.color-primary.left-top__tip(v-show="serviceData.name")
    //-       span 【{{serviceData.method}}】
    //-       span {{serviceData.url}}
    //-       span(v-show="serviceData.demo") {{serviceData.demo}}
      //- el-button-group.right-wrap__top
      //-   el-button(icon="el-icon-plus", @click="addApi") 新增数据源
    .bottom-wrap.d-flex-row-between
      //- 左
      ServerList(:key="serviceData.name", :value="serviceData", @input="onChangeEnv")
      //- 右
      .right-wrap.d-flex-column.d-flex-1
        ServerContent(:key="serviceData.name", v-model="serviceData")
        //- 下
        .right-bottom__fixed.d-flex-row-between
          el-button-group
            //- el-button(@click="testLink") 测试链接
            //- el-button(:disabled="!serviceData.name", title="保存至全局，允许下次继续使用", @click="globalSave(serviceData)") 保存至全局
          .button-group
            el-button-group
              el-button(@click="onClose") 关闭
              el-button(@click="onSave") 保存修改
              el-button(type="primary", :disabled="true", title="对分组内所有画布影响", @click="applyToGroup") 应用当前分组环境(TODO)
              el-button(type="primary", title="保存至当前画布，不影响全局", @click="applyToCanvas") 应用当前画布环境
</template>

<script>
/* 环境配置 */
// import { defaultEnvConf } from '@/model/service'
import ServerList from './ServerList.vue'
import ServerContent from './ServerContent.vue'
import { cloneDeep, isEqual } from 'lodash'
// import { ServiceModel } from '@/model/service'
export default {
  name: 'WebserverSetter',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ServerContent,
    ServerList
  },
  data () {
    return {
      isChanged: false, // 环境是否有修改
      // serviceList: defaultEnvConf, // 环境列表，默认取本地环境, 只能删除自定义的环境
      serviceData: {}, // 环境配置数据
      serviceTemp: {}
    }
  },
  computed: {
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
  watch: {
    serviceData: {
      handler (data, oldData) {
        // const urlKeys = Object.keys(keyBy(this.serviceData.urls, 'name'))
        // const defList = this.$store.state.server.list?.filter(item => item.default) || []
        // const newDef = defList.map(({ urls }) => {
        //   const curKeys = keyBy(urls, 'name')
        //   const others = difference(urlKeys, Object.keys(curKeys))?.map(key => new ServiceModel(curKeys[key]))
        //   urls = urls.concat(others)
        // })
        // console.log('newDef:', newDef)
      }
    }
  },
  methods: {
    onChangeEnv (data) {
      // console.log('onChangeEnv:', data)
      this.serviceTemp = cloneDeep(this.serviceData)
      if (!isEqual(this.serviceTemp, data)) {
        this.syncService()
        this.serviceData = data
      }
    //   this.isChanged = !isEqual(data, this.serviceData)
    //   this.serviceData = data
    },
    syncService () {
    },
    // 保存修改
    onSave () {
      this.$store.commit('server/updateOne', { name: this.serviceData?.name, source: this.serviceData })
      this.$store.dispatch('server/updateService', this.serviceData.urls)
    },
    // 应用画布
    applyToCanvas () {
      // console.log('当前配置的数据:', this.serviceData)
      if (!this.serviceData?.urls?.length) {
        this.$confirm(
          '当前没有配置服务，不能应用到当前环境',
          '错误',
          {
            confirmButtonText: '重新设置'
          }
        )
        return
      }
      this.$store.commit('canvas/assignConfig', {
        name: this.editingName,
        assignObj: {
          server: this.serviceData
        }
      })
      // const newElements
      // this.$store.commit('canvas/updateHoldWidget', {
      //   name: this.editingName,
      //   elements: newElements
      // })
      // 满足条件则不允许被全局修改：主动修改环境或http://或https://起始的url
      // const matchs = [].concat(
      //     url.match(/^https?:\/\/|http?:\/\//ig)
      //     /<(\w+)>\/<(\w+)>/.match(url)?.[0] !== this.$store.getters.getServerInuse
      //   )
      // console.log('获取到的getter:', this.$store.getters.getServerInuse)
      // // 此时<(\w+)>\/<(\w+)>.match(url) !== 全局配置的环境时
      // this.$set(this.apiData, '__preventGlobal', matchs && matchs.length)
    },
    // 应用分组
    applyToGroup () {},
    // onSelectServer (env) {
    //   this.serviceData = env
    // },
    onClose () {
      this.dialogVisabled = false
      this.$emit('onClose')
    },
    init () {
      this.$store.commit('server/init')
      this.$store.commit('server/syncServices')
      // this.serviceData = this.$gbServer?.[0]
      this.$nextTick(() => {
        const [ip] = this.$store.getters.getServerInuse
        this.serviceData = this.$store.getters.getServerByName(ip)
      })
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

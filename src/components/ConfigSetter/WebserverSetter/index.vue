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
      ServerList(v-model="serviceData")
      //- 右
      .right-wrap.d-flex-column.d-flex-1
        ServerContent(v-model="serviceData")
        //- 下
        .right-bottom__fixed.d-flex-row-between
          el-button-group
            //- el-button(@click="testLink") 测试链接
            //- el-button(:disabled="!serviceData.name", title="保存至全局，允许下次继续使用", @click="globalSave(serviceData)") 保存至全局
          .button-group
            el-button-group
              el-button(@click="onClose") 关闭
              el-button(@click="onSave") 保存修改
              el-button(type="primary", title="保存至当前，不影响全局", @click="chooseChange") 应用所有画布
</template>

<script>
/* 环境配置 */
import { defaultEnvConf } from '@/model/service'
import ServerList from './ServerList.vue'
import ServerContent from './ServerContent.vue'
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
      // serviceList: defaultEnvConf, // 环境列表，默认取本地环境, 只能删除自定义的环境
      serviceData: {} // 环境配置数据
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
    }
  },
  methods: {
    // 保存修改
    onSave () {},
    // 确定却换
    chooseChange () {},
    // onSelectServer (env) {
    //   this.serviceData = env
    // },
    onClose () {
      this.dialogVisabled = false
      this.$emit('onClose')
    },
    init () {
      this.serviceData = defaultEnvConf?.[0]
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

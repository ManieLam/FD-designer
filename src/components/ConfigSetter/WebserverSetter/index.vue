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
      .left-wrap.d-flex-column
        .left-wrap-tool
          .d-flex-row-between.d-flex-v-center
            .d-flex-1.text.color-secondary 环境
              //- el-checkbox(v-model="allSelectedVisable") 查看画布内已选的数据源
            el-button-group
              el-button(icon="el-icon-plus", title="新增环境", @click="addService")
        .left-wrap-list.d-flex-1.m-t-8
          //- 左边环境列表
          .left-item.list-row.d-flex-row-between.align-items-center.hover-change-bgColor(
            v-for="(service, index) in serviceList"
            :key="service.name"
            :id="service.name"
            :is-active="serviceData.name === service.name"
            @click="handleService(service)")
            .text-left {{service.label}}
            .text-right(v-show="service.delAble")
              i.iconfont.el-icon-delete(@click="onDeleteEnv(index)", title="删除环境")
      //- 右
      .right-wrap.d-flex-column.d-flex-1
        .right-custom-data.d-flex-1.p-r-8
          //- 环境配置
          el-form(ref="apiForm", :model="serviceData", label-position="left")
            el-form-item(label="环境名称", prop="label")
              el-input(v-model="serviceData.label")
            el-form-item(label="服务配置（前置URL）", prop="urls")
              //- el-input(v-model="serviceData.group", placeholder="请输入分组标题名称")
              form-list(style="width: 90%", :columnProps="urlColumnProps", v-model="serviceData.urls", :draggable="false")
            el-form-item(label="环境变量", prop="vars")
            //- el-form-item(label="头部参数", prop="vars")
            //- el-form-item(label="头部参数", prop="vars")

        .right-bottom__fixed.d-flex-row-between
          el-button-group
            //- el-button(@click="testLink") 测试链接
            //- el-button(:disabled="!serviceData.name", title="保存至全局，允许下次继续使用", @click="globalSave(serviceData)") 保存至全局
          .button-group
            el-button-group
              el-button(@click="onClose") 关闭
              el-button(@click="onSave") 保存修改
              el-button(type="primary", title="保存至当前，不影响全局", @click="chooseChange") 确认切换环境
</template>

<script>
/* 环境配置 */
import { EnvModel, defaultEnvConf } from '@/model/service'
export default {
  name: 'WebserverSetter',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      serviceList: defaultEnvConf, // 环境列表，默认取本地环境, 只能删除自定义的环境
      serviceData: {}, // 环境配置数据
      urlColumnProps: [
        { label: '服务名', prop: 'title' },
        { label: '前置URL', prop: 'url' }
      ]
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
    // 增加环境
    addService () {
      const hasEmpty = this.serviceList.find(item => !item.label)
      // console.info('不存在空白环境:', hasEmpty)
      if (!hasEmpty) {
        // 不存在空白环境才可添加
        // const evnKey = `env_${ New Date().getTime() }`
        this.serviceList.push(new EnvModel({
          name: 'env_' + new Date().getTime(),
          delAble: true
        }))
        this.$nextTick(() => {
          this.serviceData = this.serviceList[this.serviceList.length - 1]
        })
      } else {
        document.getElementById(hasEmpty.name).focus()
      }
    },
    onDeleteEnv (index) {
      this.$delete(this.serviceList, index)
    },
    handleService (env) {
      this.serviceData = env
    },
    onClose () {
      this.dialogVisabled = false
      this.$emit('onClose')
    }

  },
  mounted () {}
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
.left-wrap
  width: 20%
  overflow-y: auto
  background: rgb(243 244 249 / 30%)
  .list-row
    // border: 1px solid $--border-color-base
    padding: 8px
    cursor: pointer
    position: relative
    // &:hover
    //   background: $--bgcolor-secondary
    & + .list-row
      margin-top: 8px
      // border-top: 1px solid $--border-color-base
    &[is-active], &:hover
      background: $--bgcolor-secondary
      border-radius: 4px
      color: $--color-primary
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

.left-wrap, .right-wrap
  // border: 1px solid $--border-color-base
  padding: 8px

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

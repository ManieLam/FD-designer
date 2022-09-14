<template lang='pug'>
el-dialog.async-required-dialog(:title="title", :visible.sync="dialogVisabled", width="70%", center)
  .async-required-container
    .top-wrap.d-flex-row-between.m-b-8
      .left-wrap__top {{apiData.name ? '已选中:' : '请选择一个数据源'}}
        small.color-primary(v-show="apiData.name") 【{{apiData.method}}】 - {{apiData.name}} - {{apiData.demo}}
      el-button-group.right-wrap__top
        el-button(icon="el-icon-plus", @click="addApi") 新增数据源
        el-button(type="primary", @click="testLink") 测试链接
        el-button(type="primary", @click="save") 保存
        el-button(type="primary", @click="chooseChange") 确定选中
    .bottom-wrap.d-flex-row-between
      .left-wrap.m-r-8
        .left-api-list.d-flex-row-between.align-items-center.hover-change-bgColor(v-for="(apiItem, index) in apiList", :key="apiItem.name", @click.stop="editApi(apiItem, index)")
          .left.d-flex-v-center
            i.el-icon-check.color-primary.m-r-8(v-show="apiItem.name === apiData.name && apiData.__index === index")
            .color-warning {{apiItem.method}}
            .secondary-text.m-l-8 {{apiItem.name}}
            .tip.font-size-small.m-l-8 {{ apiItem.demo || ''}}
          .right
            .el-icon-delete.hover-change-scale.hover-change-color__danger(@click.stop.prevent="removeApi(apiItem, index)")
      .right-wrap
        .right-custom-data
          el-form(ref="apiForm", :model="apiData", label-position="right", :rules="rules")
            el-form-item(label="名称", prop="name")
              el-input(v-model="apiData.name")

            el-form-item(label="请求地址", prop="url")
              el-input(v-model="apiData.url")

            el-form-item(label="请求方式", prop="method")
              el-radio-group(v-model="apiData.method" size="mini")
                el-radio-button(v-for="method in apiMethods", :label="method")

            el-form-item(prop="header")
              .d-flex-row-between.align-items-center(slot="label")
                .label-left 请求头部
                .label-right.cursor-pointer.font-size-medium.hover-change-scale(:class="!addHeader ? 'el-icon-circle-plus-outline' : 'el-icon-remove-outline'", @click="addHeader = !addHeader")
              CustomList(v-show="addHeader", v-model="apiData.header", :editAble="true", :isSelection="true")

            el-form-item(prop="body")
              .d-flex-row-between.align-items-center(slot="label")
                .label-left 请求参数
                .label-right.cursor-pointer.font-size-medium.hover-change-scale(:class="!addBody ? 'el-icon-circle-plus-outline' : 'el-icon-remove-outline'", @click="addBody = !addBody")
              CustomList(v-show="addBody", v-model="apiData.body", :editAble="true", :isSelection="true")

            el-form-item(label="是否表单初始化发送请求", prop="immediate")
              el-switch(v-model="apiData.immediate")

            el-form-item(label="数据处理", prop="dataHandle")
              el-collapse.box-content__inside.m-r-8(v-model="apiData.dataHandle")
                el-collapse-item(v-for="handle of dataHandles", :title="handle[0]", :name="handle[0]")

            el-form-item(label="备注", prop="demo")
              el-input(v-model="apiData.demo")
</template>

<script>
import CustomList from '../CustomList'
import { cloneDeep } from 'lodash'
// import axios from 'axios'
/** 数据源名称，请求地址， 请求头、请求链接、请求参数、请求 */
const ApiData = function (config) {
  return {
    method: 'GET',
    header: [],
    body: [],
    ...config
  }
}
export default {
  name: 'AsyncRequired',
  props: {
    title: String,
    value: {
      type: Boolean,
      default: false
    },
    chosenData: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    CustomList
  },
  data () {
    return {
      addHeader: false,
      addBody: false,
      apiData: new ApiData(),
      apiMethods: ['GET', 'POST', 'PATCH', 'SET', 'DELETE'],
      apiList: [
        { name: 'getUser', method: 'GET', url: '/api/getUser', demo: '获取用水户信息' }
      ],
      dataHandles: [
        ['beforeRequired', () => {}],
        ['afterRequired', () => {}],
        ['error', () => {}]
      ],
      rules: {
        name: { required: true, message: '必填', trigger: 'blur' },
        url: { required: true, message: '必填', trigger: 'blur' }
      }
    }
  },
  watch: {
    chosenData (data) {
      this.apiData = data
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
    editApi (api, index) {
      this.apiData = { ...cloneDeep(api), __index: index }
    },
    removeApi (api, index) {
      if (index >= 0) {
        this.$delete(this.apiList, index)
      }
    },
    addApi () {
      this.apiData = new ApiData()
    },
    save () {
      if (this.apiData?.__index == null) {
        this.apiList.push(this.apiData)
      } else {
        const { __index } = this.apiData
        if (__index > -1) {
          this.$set(this.apiList, __index, this.apiData)
        }
      }
      this.$nextTick(() => {
        this.apiData = new ApiData()
      })
    },
    chooseChange () {
      this.$refs.apiForm.validate(valid => {
        if (valid) {
          this.$emit('chosen', this.apiData)
          this.dialogVisabled = false
        } else {
          console.warn('请选择一个数据源')
        }
      })
    },
    testLink () {

    }
  }
}
</script>

<style lang='sass' scoped>
.async-required-dialog ::v-deep .el-dialog
  margin-top: 2vh !important

.async-required-container
  height: 80vh
  display: flex
  flex-direction: column
  overflow: hidden
  .bottom-wrap
    overflow-y: hidden
.left-wrap
  width: 30%
  overflow-y: auto
.right-wrap
  flex: 1 0 auto
  max-width: 70%
  overflow-y: auto

.left-wrap, .right-wrap
  border: 1px solid $--border-color-base
  padding: 8px

.left-api-list
  border: 1px solid $--border-color-base
  padding: 8px
  cursor: pointer
  // &:hover
  //   background: $--bgcolor-secondary
  & + .left-api-list
    margin-top: 8px
  // .el-icon-delete:hover
  //   transform: scale(1.2)
    // border: 1px solid $--border-color-base
    // pading: 4px
    // background: #F5F5F5
    // border-radius: 50%
</style>

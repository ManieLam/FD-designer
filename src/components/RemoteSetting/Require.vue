<template lang='pug'>
el-dialog.async-required-dialog(
  :key="key"
  :title="title"
  :visible.sync="dialogVisabled"
  width="70%"
  center
  :append-to-body="true"
  :close-on-click-modal="false")
  .async-required-container
    .top-wrap.d-flex-row-between.m-b-8
      .left-wrap__top {{apiData.name ? '已选中:' : '请选择一个数据源'}}
        small.color-primary.left-top__tip(v-show="apiData.name")
          span 【{{apiData.method}}】
          span {{apiData.url}}
          span(v-show="apiData.demo") {{apiData.demo}}
      el-button-group.right-wrap__top
        el-button(icon="el-icon-plus", @click="addApi") 新增数据源
        el-button(type="primary", @click="testLink") 测试链接
        el-button(type="primary", title="保存至全局，允许下次继续使用", @click="save") 保存至全局
        el-button(type="primary", title="保存至当前，不影响全局", @click="chooseChange") 选中当前
    .bottom-wrap.d-flex-row-between
      .left-wrap.m-r-8
        .left-api-list.d-flex-row-between.align-items-center.hover-change-bgColor(v-for="(apiItem, index) in apiList", :key="apiItem.name", @click.stop="editApi(apiItem, index)")
          .left
            .d-flex-v-center
              i.el-icon-check.color-primary.m-r-8(v-show="apiItem.name === apiData.name && apiData.__index === index")
              .color-warning {{apiItem.method}}
              .secondary-text.m-l-8 {{apiItem.url}}
            .color-text-secondary.font-size-small.m-l-8 {{ apiItem.demo || ''}}
          .right
            .el-icon-delete.hover-change-scale.hover-change-color__danger(@click.stop.prevent="removeApi(apiItem, index)")
        el-empty.left-empty(v-show="!apiList.length", description="暂无数据源，请添加")
      .right-wrap
        .right-custom-data
          el-form(ref="apiForm", :model="apiData", label-position="top", :rules="rules")
            //- el-form-item(label="名称", prop="name")
            //-   el-input(v-model="apiData.name", placeholder="接口标识名称，请使用英文或数字")

            el-form-item(label="请求地址", prop="url")
              el-input(v-model="apiData.url", placeholder="请输入相对地址，无需带http(s)://前缀，以/开头，默认跟随系统配置")

            el-form-item(label="请求方式", prop="method")
              el-radio-group(v-model="apiData.method" size="mini")
                el-radio-button(v-for="method in apiMethods", :key="method", :label="method")

            el-form-item(prop="header")
              .d-flex-row-between.align-items-center(slot="label")
                .label-left 请求头部
                .label-right.cursor-pointer.font-size-medium.hover-change-scale.p-l-8(
                  :class="!hasHeader ? 'el-icon-circle-plus-outline' : 'el-icon-remove-outline'"
                  @click="toggleCustomList('header')")
              ParamsList(v-show="hasHeader", v-model="apiData.header", :editAble="true", :isSelection="true")

            el-form-item(prop="body")
              .d-flex-row-between.align-items-center(slot="label")
                .label-left 请求参数
                .label-right.cursor-pointer.font-size-medium.hover-change-scale.p-l-8(
                  :class="!hasBody ? 'el-icon-circle-plus-outline' : 'el-icon-remove-outline'"
                  @click="toggleCustomList('body')")
              ParamsList(v-show="hasBody", v-model="apiData.body", :editAble="true", :isSelection="true")

            //- el-form-item(label="是否表单初始化发送请求", prop="immediate")
            //-   el-switch(v-model="apiData.immediate")

            el-form-item(label="数据处理", prop="dataHandle")
              el-collapse.box-content__inside.code-editor__collapse.m-r-8(
                v-model="apiData.dataHandle"
                @change="openFuncEdit")
                el-collapse-item(
                  v-for="handle in dataHandles"
                  :key="handle.name"
                  :title="handle.title"
                  :name="handle.name")
                  CodeEditor(
                    v-if="apiData && apiData[handle.name]"
                    v-model="apiData[handle.name].placeholder"
                    :key="apiData.name"
                    @change="formatFuncByStr($event, handle)")
                    pre.code-editor-desc__pre(slot="code-pre") {{handle.params|filterPrePlaceholder}}
                    pre.code-editor-desc__suffix(slot="code-suffix") }

            el-form-item(label="备注", prop="demo")
              el-input(v-model="apiData.demo")
</template>

<script>
import ParamsList from './ParamsList'
import { cloneDeep, keyBy } from 'lodash'
import CodeEditor from '@/components/CodeEditor/index'
import { ApiData, ApiDataHandles } from '@/model/resource.js'
export default {
  name: 'RemoteSettingRequire',
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
    ParamsList,
    CodeEditor
  },
  filters: {
    filterPrePlaceholder (desc) {
      const descList = Object.entries(desc)
      return descList.reduce((str, [name, value], index) => {
        str += `// @ { ${name} } ${value} \n`
        if (index === descList.length - 1) {
          str += `(${Object.keys(desc)}) => {`
        }
        return str
      }, '')
    }
  },
  data () {
    return {
      key: new Date().getTime(),
      apiData: new ApiData(),
      apiMethods: ['GET', 'POST', 'PATCH', 'SET', 'DELETE'],
      apiStorageList: this.$store.getters.getResources,
      dataHandles: ApiDataHandles,
      dataHandleEditors: {},
      rules: {
        name: [
          // { required: true, message: '必填', trigger: 'change' },
          { pattern: /^[a-z0-9]+$/i, message: '请输入英文或数字', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (this.apiNames[value]) {
                callback(new Error('已存在相同接口'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        url: { required: true, message: '必填', trigger: 'change' },
        method: { required: true, message: '必填', trigger: 'change' }
      },
      funcEditVisibles: []
    }
  },
  watch: {
    chosenData: {
      deep: true,
      immediate: true,
      handler (data) {
        this.apiData = new ApiData(data)
      }
    },
    apiList (list) {
      this.$store.dispatch('resources/updateList', list)
    }
  },
  computed: {
    apiList () {
      return this.$store.getters.getResources
    },
    apiNames () {
      return Object.keys(keyBy(this.apiList, 'name'))
    },
    hasHeader () {
      return this.apiData?.header != null
    },
    hasBody () {
      return this.apiData?.body != null
    },
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
      this.apiData = {
        ...cloneDeep(api),
        name: `${api.url}_${api.method}`,
        __index: index
      }
    },
    removeApi (api, index) {
      if (index >= 0) {
        this.$delete(this.apiList, index)
      }
    },
    addApi () {
      /* if (this.apiData?.name || this.apiData?.url) {
        this.$confirm('当前编辑内容未保存是否继续?', '提示', {
          confirmButtonText: '丢弃当前，并继续',
          cancelButtonText: '保存，并继续',
          type: 'warning'
        }).then(() => {
          this.apiData = new ApiData()
        }).catch(() => {
          // 取消
          this.save()
          this.$nextTick(() => {
            this.apiData = new ApiData()
          })
        })
      } else {
        this.apiData = new ApiData()
      } */
      this.apiData = new ApiData()
      // this.dataHandleFunc = this.apiData.dataHandleFunc
    },
    save () {
      const apiData = Object.assign(this.apiData, { name: this.apiData.name || `${this.apiData.url}_${this.apiData.method}` })
      if (this.apiData?.__index == null) {
        this.apiList.push(Object.assign(apiData, { __index: this.apiList.length }))
        // this.$gbImport.gbApiRequires.push(this.apiData)
      } else {
        const { __index } = this.apiData
        if (__index > -1) {
          this.$set(this.apiList, __index, apiData)
          // this.$set(this.$gbImport.gbApiRequires, __index, this.apiData)
        }
      }
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
      console.info('测试发起请求:', this.apiData)
      this.$require(this.apiData).then(res => {
        console.info(res)
      })
    },
    toggleCustomList (type) {
      // console.log('toggleCustomList:', type)
      const data = this.apiData[type]
      if (data) {
        this.$set(this.apiData, type, null)
        delete this.apiData[type]
      } else {
        this.$set(this.apiData, type, [])
      }
    },
    formatFuncByStr (str, handle) {
      const { funcDefault, name } = handle
      const funcInput = funcDefault.replace(/\{[^}]+\}/g, `{ ${str} }`)
      this.$set(this.apiData[name], 'funcInput', funcInput)
      this.$set(this.apiData[name], '__isChange', funcInput !== funcDefault)
    },
    openFuncEdit (actNames) {
      this.funcEditVisibles = actNames
    }
  },
  mounted () {
    // console.info('remote mounted')
    // this.initFuncEdit()
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

.left-top__tip
  span + span
    &::before
      content: '-'
      margin-left: 4px
      margin-right: 4px

.left-api-list
  border: 1px solid $--border-color-base
  padding: 8px
  cursor: pointer
  // &:hover
  //   background: $--bgcolor-secondary
  & + .left-api-list
    margin-top: 8px
  .left
    line-height: 1.2

.code-editor__collapse
  ::v-deep .el-collapse-item .el-collapse-item__header
    background-color: $--bgcolor-secondary
    &.is-active
      border-bottom: 1px dotted $--border-active
    // margin-bottom: 8px
.code-editor
  min-height: 200px
  height: 100%
  width: 100%
</style>

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
        el-button(icon="el-icon-plus", @click="addGroup") 新增分组
        el-button(icon="el-icon-plus", @click="addApi") 新增数据源
        el-button(type="primary", @click="testLink") 测试链接
        el-button(type="primary", :disabled="!apiData.name", title="保存至全局，允许下次继续使用", @click="globalSave(apiData)") 保存
        el-button(type="primary", title="保存至当前，不影响全局", @click="chooseChange") 确定选中
    .bottom-wrap.d-flex-row-between
      //- 左
      .left-wrap.m-r-8
        ApiGroup.left-api-group(
          v-for="(list, title) in apiGroup"
          :key="title"
          :apiData="apiData"
          :title="title"
          :list="list"
          :full="apiGroup"
          @upgrade="upgradeGroup"
          @remove="removeGroup"
          @addApi="addApi"
          @editApi="editApi"
          @removeApi="removeApi"
          @copeApi="copeApi")
        el-empty.left-empty(v-show="!apiList.length", description="暂无数据源，请添加")
      //- 右
      .right-wrap
        .right-custom-data
          el-form(ref="apiForm", :model="apiData", label-position="top", :rules="rules")
            el-form-item(label="所属分组", prop="group")
              el-input(v-model="apiData.group", placeholder="请输入分组标题名称")
            //- 请求地址
            el-form-item.position-relative(prop="url")
              .d-flex-row-between.align-items-center.label-absolute(slot="label")
                //- i.icon.el-icon-
                .label-left 请求地址
                .label-right
                  el-tooltip(placement="top")
                    template(slot="content")
                      div 地址格式：
                      div 1. 请输入相对地址
                      div 2. 动态地址参数请使用${xxx}的格式填入，并在相应下面【请求参数】中补充对应的取值方式。
                      div 3. "?"后的query参数，格式为："xxx=${xxx}"。"="前方为参数key，后方可选填。并在相应下面【请求参数】中补充对应的取值方式。
                    i.icon.el-icon-info.m-l-8
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
              ParamsList(v-show="hasHeader", keyName="header", v-model="apiData.header", :editAble="true", @onClearAll="toggleCustomList('header')")

            el-form-item(prop="pathData")
              .d-flex-row-between.align-items-center(slot="label")
                .label-left 请求参数（Path）
                .label-right.cursor-pointer.font-size-medium.hover-change-scale.p-l-8(:class="!hasPathData ? 'el-icon-circle-plus-outline' : 'el-icon-remove-outline'" @click="toggleCustomList('pathData')")
              ParamsList(v-show="hasPathData", keyName="pathData", v-model="apiData.pathData", :editAble="true", @onClearAll="toggleCustomList('pathData')")

            el-form-item(prop="body")
              .d-flex-row-between.align-items-center(slot="label")
                .label-left 请求参数（Query）
                .label-right
                  .cursor-pointer.font-size-medium.hover-change-scale.p-l-8(
                    :class="!hasBody ? 'el-icon-circle-plus-outline' : 'el-icon-remove-outline'"
                    @click="toggleCustomList('body')")
                  el-checkbox.m-l-16(v-model="apiData.isFullDose") 是否默认表单全量数据提交
                    el-tooltip(placement="top")
                      template(slot="content")
                        div 除字典以外的数据，
                        div 表单存在默认请求多个数据源时，则以列表形式传递
                        div 该选项会影响所有该接口，请求参数的数据范围
                      i.icon.el-icon-info.m-l-8
              ParamsList(v-show="hasBody", keyName="body", v-model="apiData.body", :editAble="true", @onClearAll="toggleCustomList('body')")

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
import ApiGroup from './ApiGroup.vue'
import { keyBy, isEqual, debounce, groupBy } from 'lodash'
import CodeEditor from '@/components/CodeEditor/index'
import { ApiData, ApiDataHandles, ApiBodyParams } from '@/model/resource.js'
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
    CodeEditor,
    ApiGroup
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
      handler (data, oldData) {
        if (!isEqual(data, oldData)) {
          this.apiData = new ApiData(data)
          this.analyseUrl(data)
        }
      }
    },
    apiList (list) {
      /* 受vue2影响，无监听到数组对象内部属性更新，重新再触发一次 */
      this.$store.dispatch('resources/updateList', list)
    },
    'apiData.url': debounce(function (path) {
      this.analyseUrl(this.apiData)
    }, 1800)
  },
  computed: {
    apiList: {
      get () {
        return this.$store.getters.getResources
      },
      set (list) {
        console.log('更新apiList')
        this.$store.dispatch('resources/updateList', list)
      }
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
    hasPathData () {
      return this.apiData?.pathData != null
    },
    dialogVisabled: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    },
    // api分组
    apiGroup () {
      return groupBy(this.apiList, (api) => api.group || '全局')
    }
  },
  methods: {
    getApiName ({ name, group } = {}) {
      return name || new Date().getTime()
    },
    addGroup () {
      const newLen = Object.keys(this.apiGroup).filter(key => /^新建/.test(key)).length
      this.apiData = new ApiData({
        group: `新建分组${newLen + 1}`,
        // name: `${newLen + 1}_${new Date().getTime()}`,
        // name: this.getApiName(),
        _edit: true
      })
      this.$nextTick(() => {
        // this.globalSave(this.apiData)
        this.apiList.push(this.apiData)
      })
    },
    upgradeGroup (list, title) {
      console.info('upgradeGroup:', arguments)
      // this.$set(this.apiGroup, title, list)
    },
    removeGroup (title) {
      this.apiList = this.apiList.filter(row => row.group !== title)
      this.apiData = {}
    },
    editApi (api, index) {
      this.apiData = api
    },
    removeApi (api) {
      const index = this.apiList.findIndex(row => row.name === api.name)
      if (index >= 0) {
        this.$delete(this.apiList, index)
        this.apiData = {}
      }
    },
    copeApi (api) {
      if (api.url) {
        const nUrl = `${api.url}_copie`
        const oIndex = this.apiList.findIndex(row => row.name === api.name)
        const nIndex = oIndex + 1
        this.apiData = new ApiData({
          ...api,
          url: nUrl,
          name: new Date().getTime(), // 置为空，重新赋值
          _edit: false
        })
        this.$nextTick(() => {
          // this.globalSave(this.apiData, nIndex)
          this.apiList.splice(nIndex, 0, this.apiData)
        })
      }
    },
    addApi (api) {
      if (!api || !api.group) {
        this.apiData = new ApiData()
      } else {
        this.apiList.push(api)
        this.apiData = api
      }
      // this.dataHandleFunc = this.apiData.dataHandleFunc
    },
    /* 全局保存：修改 + 新增 */
    globalSave (data = this.apiData, nIndex = null) {
      const index = this.apiList.findIndex(api => api.name === data.name)
      if (index >= 0) {
        console.info('保存全局1:', data)
        this.$set(this.apiList, index, data)
      } else {
        console.info('保存全局2:', data)
        this.apiList.push(data)
      }
      this.$nextTick(() => {
        this.$message.success('全局保存成功')
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
      console.info('测试发起请求:', this.apiData)
      this.$require(this.apiData).then(res => {
        console.info(res)
      })
    },
    // 切换自定义请求头部/请求参数列表开关
    toggleCustomList (type) {
      console.log('toggleCustomList:', type)
      const data = this.apiData[type]
      if (data) {
        this.$set(this.apiData, type, null)
        delete this.apiData[type]
      } else {
        this.$set(this.apiData, type, [])
      }
    },
    getParamByUrl (path, originParams, regex = /(\$\{)(\w+)(\})/g) {
      let pathParams = Array.from(originParams || [])
      // const regex = /(\$\{)(\w+)(\})/g
      const params = path.match(regex)
      if (params && params.length) {
        const keys = params.map(k => k.match(/\w+/)?.[0])
        const objs = keyBy(pathParams, 'key')
        let i = keys.length - 1
        // 自动生成path参数列表
        while (!objs[keys[i]] && i >= 0) {
          const val = new ApiBodyParams({ key: keys[i], __key: new Date().getTime() + i })
          pathParams = [...pathParams, val]
          --i
        }
        return pathParams
      }
    },
    // 对请求地址格式化，与请求参数(path)的联动关系
    analyseUrl ({ url, pathData, body }) {
      if (url) {
        const [part1, part2] = url.split('?')
        if (part1) {
          this.apiData.pathData = this.getParamByUrl(part1, pathData)
        }
        if (part2) {
          this.apiData.body = this.getParamByUrl(part2, body, /(\w+)=/g)
        }
      } else {
        return []
      }
    },
    // 格式化自定义数据处理方法
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

.left-api-group
  & + .left-api-group
    margin-top: 8px

.code-editor__collapse
  ::v-deep .el-collapse-item .el-collapse-item__header
    background-color: #fff
    padding-left: 8px
    &.is-active
      border-bottom: 1px dotted $--border-active
    // margin-bottom: 8px
.code-editor
  min-height: 200px
  height: 100%
  width: 100%

.label-absolute
  position: absolute
  left: 10px
  top: 0

</style>

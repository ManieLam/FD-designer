<template lang='pug'>
el-dialog.async-required-dialog(
  :key="key"
  :title="title"
  :visible.sync="dialogVisabled"
  width="70%"
  center
  :append-to-body="true"
  :close-on-click-modal="false"
  @close="$emit('refuse')")
  .async-required-container
    .top-wrap.d-flex-row-between.m-b-8
      .left-wrap__top {{apiData.name ? '已选中:' : '请选择一个数据源'}}
        small.color-primary.left-top__tip(v-show="apiData.name")
          span 【{{apiData.method}}】
          span {{apiData.url}}
          span(v-show="apiData.demo") {{apiData.demo}}
      el-button-group.right-wrap__top
        el-button(icon="el-icon-plus", @click="addApi") 新增数据源
    .bottom-wrap.d-flex-row-between
      //- 左
      .left-wrap.m-r-8.d-flex-column
        .left-wrap-tool
          .d-flex-row-between.d-flex-v-center
            .d-flex-1.text 可选数据源
              //- el-checkbox(v-model="allSelectedVisable") 查看画布内已选的数据源
            el-button-group
              //- el-button(icon="el-icon-finished"
              //-   :type="allSelectedVisable? 'primary' : ''"
              //-   title="查看画布内已选的数据源"
              //-   @click="showSelected")
              el-button(icon="el-icon-plus", title="新增分组", @click="addGroup")
              el-button(icon="el-icon-upload2", title="保存分组", @click="globalSaveGroup")
          .search-bar.m-t-8
            el-input(v-model.trim="apiSearchVal"
              clearable
              size="mini"
              placeholder="请输入请求地址筛选数据源"
              @keyup.enter.native="filterApi"
              @clear="clearSearch")
              el-button(slot="append", class="el-input__icon el-icon-search", @click="filterApi")
        .left-wrap-list.d-flex-1
          ApiGroup.left-api-group(
            v-for="(list, title) in apiGroup"
            v-bind="$attrs"
            :key="title"
            :apiData="apiData"
            :title="decodeURI(title)"
            :list="list"
            :full="apiGroup"
            :multiSelectAble="isMulti"
            @upgrade="upgradeGroup"
            @remove="removeGroup"
            @addApi="addApi"
            @editApi="editApi"
            @removeApi="removeApi"
            @copeApi="copeApi")
          el-empty.left-empty(v-show="!apiList.length", description="暂无数据源可选，请添加")
        //- 查看查看画布内已选的数据源
        //- ApiGroup.left-api-group(
        //-   :editable="false"
        //-   :list="canvasResources"
        //-   :collapseDefault="false"
        //-   title="已选数据源")
      //- 右
      .right-wrap.d-flex-column
        .right-custom-data.d-flex-1.p-r-8
          //- 接口配置
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

            el-form-item.form-item-label_w100(prop="header")
              .d-flex-row-between.align-items-center(slot="label")
                .label-left 请求头部
                .label-right.cursor-pointer.font-size-medium.hover-change-scale.p-l-8(
                  :class="!hasHeader ? 'el-icon-plus' : 'el-icon-delete'"
                  :title="!hasHeader ? '添加' : '清空' "
                  @click="toggleCustomList('header')")
              ParamsList(v-show="hasHeader", keyName="header", v-model="apiData.header", :editAble="true", @onClearAll="toggleCustomList('header')")

            el-form-item.form-item-label_w100(prop="pathData")
              //- path的请求参数根据url自动转换, 不支持手动添加除非有占位
              .d-flex-row-between.align-items-center(slot="label")
                .label-left
                  span 请求参数（Path）
                  el-tooltip(content="根据地址栏/${xxx}自动生成; 请先在请求地址上补充对应的${xxx}占位", placeholder="top")
                    i.el-icon-info.m-l-8
              ParamsList(
                v-show="hasPathData"
                keyName="pathData"
                v-model="apiData.pathData"
                :operateAble="false"
                :disableEditFunc="disableEditFunc"
                @onClearAll="toggleCustomList('pathData')")

            el-form-item.form-item-label_w100(prop="body")
              .d-flex-row-between.align-items-center(slot="label")
                .label-left
                  span 请求参数（Query）
                  el-tooltip(placement="top")
                    template(slot="content")
                      div 除字典以外的数据，
                      div 表单存在默认请求多个数据源时，则以列表形式传递
                      div 该选项会影响所有该接口，请求参数的数据范围
                    i.icon.el-icon-info.m-l-8
                .label-right.d-flex-v-center
                  el-checkbox.m-l-16.split-after(v-model="apiData.isFullDose") 是否将表单【默认数据集数】全量提交
                  .cursor-pointer.font-size-medium.hover-change-scale(
                    :class="!hasBody ? 'el-icon-plus' : 'el-icon-delete'"
                    :title="!hasBody ? '添加' : '清空' "
                    @click="toggleCustomList('body')")
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
        .right-bottom__fixed.d-flex-row-between
          el-button-group
            el-button(@click="testLink") 测试链接
            el-button(:disabled="!apiData.name", title="保存至全局，允许下次继续使用", @click="globalSave(apiData)") 保存至全局
          .button-group
            el-checkbox.p-r-8.split-after(v-model="isContinues") 保存后，继续添加下一个
            el-button-group
              el-button(@click="$emit('refuse')") 取消
              el-button(type="primary", title="保存至当前，不影响全局", @click="chooseChange") 确定选中
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
    },
    // 是否多选
    isMulti: {
      type: Boolean,
      default: false
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
      originGlobalApi: null, // 记录选中的全局接口对象,用于判断是否有修改变动
      apiData: new ApiData(),
      apiMethods: ['GET', 'POST', 'PATCH', 'SET', 'DELETE'],
      apiStorageList: this.$store.getters.getResources, // 缓存全局的数据源列表
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
      funcEditVisibles: [],
      /* 查看所有已选api */
      allSelectedVisable: false,
      canvasResources: [],
      /* 筛选内容 */
      isFilterIng: false, // 筛选中
      filterList: [], // 筛选的列表
      apiSearchVal: '', // 筛选的数据
      isContinues: false // 是否持续性添加
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
      this.$store.dispatch('resources/updateList', list)
    },
    'apiData.url': debounce(function (path) {
      this.analyseUrl(this.apiData)
    }, 1800)
  },
  computed: {
    apiList: {
      get () {
        // apiStorageList
        return this.apiStorageList
      },
      set (list) {
        // 当使用array.splice/array.unshift等会影响到array自身的，都不会触发这里
        this.apiStorageList = list
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
      const params = this.apiData?.url?.split('?')?.[0].match(/(\$\{)(\w+)(\})/g)
      return params && params.length > 0
      // return this.apiData?.pathData != null
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
      const list = this.isFilterIng ? this.filterList : this.apiList
      return groupBy(list, (api) => encodeURI(api.group || '全局'))
    // },
    // // 表单内已选数据源
    // formApiList () {
    //   const
    }
  },
  methods: {
    disableEditFunc (scope) {
      return scope.column.property === 'key'
    },
    /* 筛选api */
    filterApi () {
      if (!this.apiSearchVal) return
      // console.info('搜索')
      this.isFilterIng = true
      const regex = new RegExp(this.apiSearchVal, 'ig')
      this.filterList = this.apiList.filter(row => regex.test(row.url))
    },
    clearSearch () {
      this.filterList = []
      this.isFilterIng = false
      // this.apiData = new ApiData()
    },
    /* 查看画布已选所有 */
    showSelected () {
      this.allSelectedVisable = !this.allSelectedVisable
    },
    /* 新增分组 */
    addGroup () {
      const newLen = Object.keys(this.apiGroup).filter(key => /^新建/.test(decodeURI(key))).length
      this.apiData = new ApiData({
        group: `新建分组${newLen + 1}`
      })
      this.$nextTick(() => {
        this.apiList.unshift(this.apiData)
      })
    },
    upgradeGroup (list, title) {
      // console.info('upgradeGroup:', arguments)
      // this.$set(this.apiGroup, title, list)
    },
    removeGroup (title) {
      this.apiList = this.apiList.filter(row => row.group !== title)
      this.apiData = new ApiData()
    },
    editApi (api, index) {
      this.originGlobalApi = api
      this.apiData = new ApiData(api)
    },
    removeApi (api) {
      const index = this.apiList.findIndex(row => row.name === api.name)
      if (index >= 0) {
        this.$delete(this.apiList, index)
        this.apiData = new ApiData()
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
          name: new Date().getTime() // 重新赋值
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
        this.apiList.unshift(api)
        this.apiData = api
      }
      // this.dataHandleFunc = this.apiData.dataHandleFunc
    },
    /* 全局保存：修改 + 新增 */
    globalSave (data = this.apiData, nIndex = null) {
      const index = this.apiList.findIndex(api => api.name === data.name)
      const newData = { ...data, __isGlobal: true }
      if (index >= 0) {
        this.$set(this.apiList, index, newData)
      } else {
        this.apiList.unshift(newData)
      }
      this.$nextTick(() => {
        this.$message.success('数据源保存成功')
        this.originGlobalApi = newData
      })
    },
    /* 全局保存数据源分组 */
    globalSaveGroup () {
      this.$store.dispatch('resources/updateList', this.apiList)
      setTimeout(() => {
        this.$message.success('数据源分组保存成功')
      }, 500)
    },
    /* 确认选中当前数据 */
    chooseChange () {
      this.$refs.apiForm.validate(valid => {
        if (valid) {
          const newData = this.apiData
          // console.info('originGlobalApi:', this.originGlobalApi)
          // 通过判断当前是否修改了url或method, 如果是, 则认为非全局性的接口
          const { method: oMethod, url: oUrl } = this.originGlobalApi || {}
          const { method: nMethod, url: nUrl } = this.apiData
          const unChanged = isEqual({ method: oMethod, url: oUrl }, { method: nMethod, url: nUrl })
          // console.info('unChanged:', unChanged)
          newData.name = unChanged ? this.apiData.name : new Date().getTime()
          // console.log('是否改名:', unChanged ? '是' : '否', newData.name)
          newData.__isGlobal = unChanged
          this.$emit('chosen', newData, this.isContinues)
          if (!this.isContinues) {
            this.dialogVisabled = false
          } else {
            // 继续添加下一个, 初始化接口数据
            this.apiData = new ApiData()
          }
        } else {
          this.$message.warning('请选择一个数据源')
        }
      })
    },
    testLink () {
      this.$message.info('请到预览中查看效果')
      // console.info('测试发起请求:', this.apiData)
      // if (!this.apiData.url) {
      //   return this.$message.warning('请选择一个数据源')
      // }
      // const func = requireTranslate.methods?.formatRequire?.call(this, this.apiData)
      // console.info(func)
      // this.$require(func).then(res => {
      //   console.info(res)
      // })
    },
    // 切换自定义请求头部/请求参数列表开关
    toggleCustomList (type) {
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
    // 对请求地址格式化，与请求参数(path\query)的联动关系
    analyseUrl ({ url, pathData, body }) {
      if (url) {
        const [part1, part2] = url.split('?')
        if (part1) {
          // this.apiData.pathData = this.getParamByUrl(part1, pathData)
          const res = this.getParamByUrl(part1)
          this.$set(this.apiData, 'pathData', res)
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
  // overflow-y: auto
  position: relative
  transform: translate(0)
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

.form-item-label_w100
  ::v-deep .el-form-item__label
    width: 100%

</style>

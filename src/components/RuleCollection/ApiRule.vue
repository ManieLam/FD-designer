<template lang='pug'>
.api-rule-wrap
  .top-wrap.box-content__title
    .title 表达式
    el-input(type="textarea", :rows="5", v-model="expression")
  .content-wrap.d-flex-row-between.m-t-8
    .left-wrap.m-r-8.box-content__title.d-flex-1
      .title 变量区
      el-tabs(type="border-card", v-model="paramTabName")
        el-tab-pane(v-for="tab in paramTabs", v-bind="tab")
    .right-wrap.box-content__title.d-flex-1
      .title 函数区
  .bottom-wrap.text-right.m-t-16
    //- el-button-group
    //-   el-button(size="medium") 取消
    //-   el-button(type="primary", size="medium") 确定
</template>

<script>
/** 多接口请求配置规则 */
export default {
  name: 'ApiRule',
  props: {
    apiList: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      // 表达式
      expression: '',
      // 变量区
      paramTabs: [
        { label: '表单数据集合', name: 'resourceCollect' },
        { label: '本地缓存', name: 'localstorage' },
        { label: '路由参数', name: 'router' }
      ],
      paramTabName: 'resourceCollect',
      paramName: [],
      // 函数区
      functionals: {}
    }
  },
  computed: {},
  methods: {}
}
</script>

<style lang='sass' scoped>
// .box-content__title
//   border: 1px solid #dfdfdf
//   padding: 0 8px
//   .title
//     padding: 8px
</style>

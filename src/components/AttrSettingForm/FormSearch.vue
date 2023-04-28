<template lang='pug'>
.form-search-container
  el-checkbox(v-model="filterAble") 是否允许搜索
  .tip-text.secondary-text.m-l-8
    i.icon.el-icon-info 默认纯前端静态搜索，可配置异步请求接口实现远程搜索
  .search-async-wrap.p-l-8.p-r-8.box-content__inside(v-if="filterAble")
    form-remote(key="search", v-model="asyncFunc", title="配置远程搜索")
</template>

<script>
/** 搜索配置 */
// import RemoteSettingRequire from '../RemoteSetting/Require'
export default {
  name: 'FormSearch',
  props: {
    value: Boolean,
    fullSetting: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    // RemoteSettingRequire
  },
  data () {
    return {
      setAsyncVisible: false,
      filterByRemote: false
    }
  },
  computed: {
    filterAble: {
      get () {
        return this.value
      },
      set (flag) {
        this.$emit('input', flag)
      }
    },
    asyncFunc: {
      get () {
        return this.fullSetting.filterApi || {}
      },
      set (data) {
        this.$emit('updateAnAttr', { name: 'filterApi', value: data.name ? data : null })
        this.$emit('updateAnAttr', { name: 'filterAbleType', value: data.name ? 'filterApi' : null })
      }
    }
  }
}
</script>

<style lang='sass' scoped>

</style>

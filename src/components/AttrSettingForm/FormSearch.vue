<template lang='pug'>
.form-search-container
  el-checkbox(v-model="filterAble") 是否允许搜索
  //- el-checkbox(v-model="filterByRemote") 是否开启远程搜索
  .search-async-wrap.p-l-8.p-r-8.box-content__inside(v-if="filterAble")
    //- span.label.secondary-text.m-r-8 设置远程搜索
    //- el-switch.m-r-8(v-model="isAsync", @change="updateAsyncAttrs")
    el-button(@click="toggleAsyncSetting") {{ asyncFunc.name ? '重新选择数据源' : '开启远程搜索(TODO)' }}
    el-button(v-show="asyncFunc.name", type="text", @click="cancelAsync") 取消远程搜索
    .list-column__default.m-t-4(v-show="asyncFunc.name")
      .left-wrap
        .d-flex-v-center
          i.el-icon-check.color-primary.m-r-8
          .color-warning {{asyncFunc.method}}
          .secondary-text.m-l-8 {{asyncFunc.url}}
        .color-text-secondary.font-size-small.m-l-8 {{ asyncFunc.demo || ''}}
      .right-wrap
      RemoteSettingRequire(key="search", title="配置远程搜索", v-model="setAsyncVisible", :chosenData="asyncFunc", @chosen="getAsyncFunc")
</template>

<script>
/** 搜索配置 */
import RemoteSettingRequire from '../RemoteSetting/Require'
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
    RemoteSettingRequire
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
        return this.fullSetting.filterAbleAsyncFunc || {}
      },
      set (data) {
        this.$emit('updateAnAttr', { name: 'filterAbleAsyncFunc', value: data.name ? data : null })
        this.$emit('updateAnAttr', { name: 'filterAbleType', value: data.name ? 'filterAbleAsyncFunc' : null })
      }
    }
  },
  methods: {
    toggleAsyncSetting () {
      // console.info('打开远程搜索配置')
      this.setAsyncVisible = !this.setAsyncVisible
    },
    getAsyncFunc (data) {
      this.asyncFunc = data
    },
    cancelAsync () {
      this.asyncFunc = {}
    }
  }
}
</script>

<style lang='sass' scoped>

</style>

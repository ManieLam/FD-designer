<template lang='pug'>
.form-search-container
  el-switch(v-model="filterAble", :active-text="filterAble?'开启搜索':''")
  .search-async-wrap.p-l-8.p-r-8.box-content__inside(v-if="filterAble")
    span.label.secondary-text.m-r-8 是否远程搜索
    el-switch.m-r-8(v-model="isAsync", @change="updateAsyncAttrs")
    el-button(v-if="isAsync", @click="toggleAsyncSetting") 配置远程搜索
</template>

<script>
/** 搜索配置 */
export default {
  name: 'FormSearch',
  props: ['value'],
  data () {
    return {
      isAsync: false
      // filterAble: false
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
    }
  },
  methods: {
    updateAsyncAttrs (value) {
      console.info('updateAsyncAttrs---', value)
    },
    toggleAsyncSetting () {
      console.info('打开远程搜索配置')
    }
  }
}
</script>

<style lang='sass' scoped>

</style>

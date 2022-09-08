<template lang='pug'>
.custom-list-container
  ul.list-wrap
    li(v-for="item in list",:key="item") {{item}}
</template>

<script>
/** 自定义列表组件 */
export default {
  name: 'CustomList',
  data () {
    return {
      list: Array.from({ length: 10 }, (i) => { return `文本_${i + 1}` })
    }
  }
}
</script>

<style lang='sass' scoped>

</style>

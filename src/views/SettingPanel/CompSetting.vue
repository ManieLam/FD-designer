<template lang='pug'>
.secondary-text 组件配置区
  .secondary-text {{formItemConfig.name}}
</template>

<script>
/** */
export default {
  name: 'CompSetting',
  props: ['formItemConfig'],
  data () {
    return {}
  }
}
</script>

<style lang='sass' scoped>

</style>

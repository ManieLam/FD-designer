<template lang='pug'>
.precondition-wrap
  el-dropdown.m-b-8(split-button) 前置触发条件
    el-dropdown-menu.dropdown-item(v-for="item in condition", :name="condition.name", @click="getResourceWhen(byRoute)") 根据页面路由参数
</template>

<script>
/** 条件设置 */
export default {
  name: 'FormPrecondition',
  props: {
    condition: {
      type: Array,
      default: () => ({})
    }
  },
  data () {
    return {}
  },
  computed: {},
  methods: {}
}
</script>

<style lang='sass' scoped>

</style>

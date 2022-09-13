<template lang='pug'>
.custom-list-container
  ul.list-wrap
    li(v-for="item in list",:key="item.value", :value="item.value") {{item.label}}
</template>

<script>
/** 自定义列表组件 */
export default {
  name: 'CustomList',
  props: {
    value: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      // list: []
      // list: Array.from({ length: 10 }, (el, i) => { return `文本_${i + 1}` })
    }
  },
  computed: {
    list: {
      get () {
        return this.value
      },
      set (data) {
        this.$emit('input', data)
      }
    }
  },
  methods: {
    add () {
      this.list.push({ label: '', value: '' })
    },
    remove (ele, index) {
      this.$delete(this.list, index)
    }
  }
}
</script>

<style lang='sass' scoped>
.list-table
  thead
    line-height: 1.2
  th
    color: $--color-text-regular
</style>

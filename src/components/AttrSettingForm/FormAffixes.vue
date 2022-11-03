<template lang='pug'>
.form-affixes
  el-input.input(v-model="inputVal")
    el-button(slot="append", icon="el-icon-arrow-down")
  .icon-wrap__collapse

</template>

<script>
/** input前缀/后缀 */
export default {
  name: 'FormAffixes',
  props: {
    type: {
      type: String,
      default: 'append'
    },
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      iconAffix: {
        // type: 'prefix-icon', // prefix-icon \ suffix-icon
        icon: '',
        iconAlign: this.type === 'append' ? 'right' : ''
      },
      strAffix: {
        type: '',
        content: ''
      }
      // inputVal: ''
    }
  },
  computed: {
    inputVal: {
      get () {
        return this.strAffix.content
      },
      set (val) {
        console.info('set inputVal:', val)
        this.$emit('input', val)
      }
    }
  },
  methods: {}
}
</script>

<style lang='sass' scoped>

</style>

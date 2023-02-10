<template lang='pug'>
el-input(v-model="curValue", v-bind="$attrs")
</template>

<script>
/* 附带数据格式转换的input输入控件 */
import { isNil } from 'lodash'
export default {
  name: 'FormInputWithType',
  props: {
    value: [String, Boolean, Number],
    valType: {
      type: String,
      default: 'String'
    }
  },
  computed: {
    curValue: {
      get () {
        // input 仅支持String/Number类型输入，特此做转换
        const accType = [String, Number]
        return !accType.includes(this.valType) && !isNil(this.value) ? String(this.value) : this.value
      },
      set (val) {
        // console.log('设置typeInput:', val)
        let nVal = val
        switch (this.valType) {
          case 'Boolean': nVal = Boolean(val); break
          case 'Number': nVal = Number(val); break
          case 'String':
          default:
            nVal = val; break
        }
        this.$emit('input', nVal)
      }
    }
  },
  methods: {},
  mounted () {}
}
</script>

<style scoped lang=scss>

</style>

<template lang='pug'>
.assist-setting
  CompSetting(
    v-if="type && formItemConfig[type]"
    v-bind="$attrs"
    :formItemConfig="currentConfig"
    @update="updateConfig")
</template>

<script>
import CompSetting from './CompSetting.vue'
export default {
  name: 'AssistSetting',
  props: {
    formItemConfig: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: String,
      default: ''
    }
  },
  components: {
    CompSetting
  },
  data () {
    return {
    }
  },
  computed: {
    currentConfig: {
      get () {
        return this.type ? this.formItemConfig[this.type] : {}
      },
      set (conf) {
        // console.log('update2:', conf)
        this.$emit('update', 'assist', { [this.type]: conf })
      }
    }
  },
  methods: {
    updateConfig (type, newData) {
      if (type === 'comp') {
        this.currentConfig = newData
      }
    }
  },
  mounted () {
  }
}
</script>

<style scoped lang=sass>

</style>

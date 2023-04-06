<template lang='pug'>
.canvas-table-column__config
  AnsoButtonGroup(:buttonList='buttonList')
  SmartDialog.config-code_dialog(v-model="jsonBlockVisabled", size="lg", title="完整配置")
    CodeEditor.json-codeEditor(
      v-if="jsonBlockVisabled && value"
      :value="valueStr"
      :readOnly="true"
      mode="ace/mode/json"
      @onCloseDialog="toggleJsonBlock")
</template>

<script>
import CodeEditor from '@/components/CodeEditor'
export default {
  name: 'CanvasInfo',
  props: {
    value: {
      type: String,
      default: () => ({})
    }
  },
  components: {
    CodeEditor
  },
  data () {
    return {
      jsonBlockVisabled: false,
      buttonList: [
        { label: '查看完整配置', name: 'showJson', type: 'text', textType: 'primary', func: this.toggleJsonBlock }
      ]
    }
  },
  computed: {
    valueJsonObj () {
      return this.value ? JSON.parse(this.value) : ''
    },
    valueStr () {
      const obj = this.value ? JSON.parse(this.value) : null
      return obj ? JSON.stringify(obj, null, '\t') : ''
    }
  },
  methods: {
    toggleJsonBlock () {
      this.jsonBlockVisabled = !this.jsonBlockVisabled
    }
  },
  mounted () {
  }
}
</script>

<style scoped lang='sass'>
.json-codeEditor
  max-height: 100vh
  min-height: 80vh
  ::v-deep .code-editor
    height: 100%
    max-height: 100vh
    min-height: 80vh
</style>

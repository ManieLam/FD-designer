<template lang='pug'>
.code-editor-box
  .code-editor-desc__pre
    slot(name="code-pre")
  .code-editor(style="margin: 0", :id="generatedId")
  .code-editor-desc__suffix
    slot(name="code-suffix")
</template>

<script>
/** js代码编辑器 */
export default {
  name: 'CodeEditor',
  props: {
    value: String, // 命令行
    mode: {
      type: String,
      default: 'ace/mode/javascript'
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  model: {
    event: 'change'
  },
  data () {
    return {
      editor: null,
      generatedId: `id_${Math.random().toString(36).substr(2, 4)}`
    }
  },
  methods: {
    initEditor () {
      this.editor = new this.CodeEditor({
        name: this.generatedId,
        command: this.value,
        mode: this.mode,
        option: this.options,
        ...this.$attrs
      })
      // this.editor.setOption({
      //   autoScrollEditorIntoView: true,
      //   copyWithEmptySelection: true
      // })
      this.editor.getSession().on('change', () => {
        this.$emit('change', this.editor.getValue())
      })
      this.resizeEditor()
    },
    // 清空代码
    clearEditor () {
      this.editor.setValue(this.value)
      this.editor.clearSelection()
    },
    resizeEditor () {
      this.editor.resize(true)
    },
    destory () {
      if (this.editor) {
        this.editor.destroy()
        this.editor.container.remove()
        this.editor = null
      }
    }
  },
  mounted () {
    this.initEditor()
  },
  beforeDestroy () {
    this.destory()
  }
}
</script>

<style lang='sass' scoped>
.code-editor
  min-height: 200px
  height: 100%
  width: 100%
</style>

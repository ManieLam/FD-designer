/**
 * ace 属性说明文档： https://github.com/ajaxorg/ace/wiki/Configuring-Ace
 * https://www.cnblogs.com/China-Dream/p/13883153.html
 *  */
import ace from 'ace'
// import CodeEditor from './CodeEditor'
const CodeEditor = {
  install (Vue, options) {
    ace.config.set('basePath', '/public/lib/ace')
    Vue.prototype.CodeEditor = function (config = {}) {
      if (config.name) {
        const name = config.name
        const options = config.options || {}
        // console.info('画布名称:', name)
        // console.log('命令：', config.command)
        const editor = ace.edit(name, {
          value: config.command,
          theme: 'ace/theme/chrome',
          selectionStyle: 'text',
          // theme: 'ace/theme/tomorrow_night_eighties',
          mode: config.mode || 'ace/mode/javascript',
          autoScrollEditorIntoView: true,
          fontSize: 14,
          tooltipFollowsMouse: true,
          wrap: true,
          tabSize: 2,
          highlightGutterLine: true,
          navigateWithinSoftTabs: true,
          ...options
        })
        editor.setOption({
          selectionMarker: 2,
          useElasticTabstops: true,
          enableEmmet: true,
          enableSnippets: true,
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          tooltipFollowsMouse: true
        })
        // editor.session.setMode('ace/mode/javascript')
        // // editor.setTheme('ace/theme/twilight')
        // editor.renderer.setScrollMargin(0, -10)
        // editor.resize()
        // editor.moveCursorTo(0, 0)
        // editor.getSession().on('change', () => {
        //   return new Promise((resolve, reject) => {
        //     return resolve(editor.getValue())
        //   })
        // })
        return editor
      }
    }
  }
}
export default CodeEditor

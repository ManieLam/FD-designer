<template lang='pug'>
.tool-panel.d-flex-row-between
  //- 左边工具栏
  el-button-group.tool-wrap__left
    //- el-button() 切换画布
    el-button(@click="toggleSettingJson") 查看配置文件
    el-dropdown(key="canvasToggle", @command="handleChangeCanvas")
      el-button {{ `当前画布：${canvasName}` || '切换画布'}}
        i.el-icon-arrow-down.el-icon--right
      el-dropdown-menu.dropdown-menu__canvas(style="width: 200px;text-align:right", slot="dropdown")
        el-dropdown-item.dropdown-item(v-for="cName in canvasKeysInLimit", :command="cName", :key="cName")
          .left-text
            i.m-r-4.color-primary(:class="cName === canvasName ? 'el-icon-check' : ''")
            span {{cName || ''}}
          .right-text.btn-icon.el-icon-close.color-primary(
            style="z-index: 2;"
            title="丢弃修改的数据，并关闭"
            @click.prevent.stop="() => onCloseCanvas(cName)")
        el-dropdown-item(divided, style="margin-left: 20px")
        el-dropdown-item(style="margin-left: 20px", icon="el-icon-position") 批量发布（TODO）
        el-dropdown-item(style="margin-left: 20px", icon="el-icon-close") 批量关闭（TODO）
        //- el-dropdown-item(style="margin-left: 20px", icon="el-icon-plus") 快捷打开（TODO）
        el-dropdown-item(command="more", style="margin-left: 20px", icon="el-icon-search") 查看更多画布
  //- 右边工具栏
  el-button-group.tool-wrap__right
    //- computed中设立saveable无法监听到store的变化
    el-button(:disabled="!canvasKeysInLimit.length", @click="toExportProps.visable=true") 导出
    el-button(@click="onCreate") 打开
    el-button(:disabled="preventSingleSaved", @click="onCopied") 复制
    el-button(:disabled="preventSingleSaved", @click="onClear") 清空
    //- el-button(:disabled="actCanvas|saveable", @click="onPreview") 预览
    el-button(type="primary", :disabled="preventSingleSaved", @click="onSave") 暂存
    el-button(type="primary", :disabled="preventSingleSaved", @click="publishOnline") 发布
    el-dropdown(key="preview", :disabled="preventSingleSaved", @command="handlePreview")
      el-button 预览
        i.el-icon-arrow-down.el-icon--right
      el-dropdown-menu(slot="dropdown")
        el-dropdown-item(command="onPreview") 预览
        el-dropdown-item(:disabled="!actCanvas.configId", command="handleOnlinePreview") 在线预览
</template>

<script>
/** */
export default {
  name: 'DesignerHeader',
  data () {
    return {}
  },
  methods: {
    toggleSettingJson () {
      this.$emit('onShowJson')
    },
    handleChangeCanvas (command) {
    }
  }
}
</script>

<style lang='sass' scoped>

</style>

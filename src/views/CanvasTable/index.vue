<template lang='pug'>
.canvas-list-page
  AnsoDatatable.h-100(
    ref="table"
    key="canvasTable"
    style="min-height: 800px"
    v-bind="tableConfig"
    :columns="columns")
    //- 头部插槽
    template(v-slot:toolbar-right)
      el-checkbox(v-model="multiEditing") 批量编辑
    //- 字段插槽
    template(v-slot:column-canvasTitle="{ row, column, value }")
      el-input(v-if="row._isEditing", v-model="editingData.canvasTitle", @keyup.native.enter="saveEdit(row)")
        el-button(
          slot="append"
          icon="el-icon-check"
          type="primary"
          title="保存修改"
          @click="() => saveEdit(row)")
      AnsoDataformText(v-else :value="value", :field="column.canvasTitle", :data="row")
    template(v-slot:column-routePath="scope")
      AnsoLink.link-text(
        :value="renderRoutePath(scope)"
        :linkLabel="renderRoutePath(scope)"
        :url="renderRoutePath(scope)")
    template(v-slot:column-config="scope")
      CanvasInfo(:key="scope.column.name", :value="scope.value")

</template>

<script>
/* 多画布管理 */
import { keyBy, pick, cloneDeep } from 'lodash'
import CanvasInfo from './CanvasInfo'
export default {
  name: 'CanvasTable',
  props: {},
  components: {
    CanvasInfo
  },
  data () {
    const columns = [
      { label: '画布标题', name: 'canvasTitle', form: { tag: 'input' } },
      {
        label: '画布名称',
        name: 'canvasName',
        form: { tag: 'input' },
        render: (value, field, data) => {
          const config = data.config ? JSON.parse(data.config) : {}
          data._configObj = config
          // 原先没有canvasName字段，只是认routerName
          return value || config.routerName || '--'
        }
      },
      {
        label: '在线查看地址', name: 'routePath', form: { tag: 'input' }
      },
      { label: '画布信息', name: 'config', width: 120 }
    ]
    return {
      columns,
      tableConfig: {
        keyName: 'multiCanvas',
        resource: '/fileserver/ui/config',
        serverSide: true,
        filterFields: ['canvasTitle', 'canvasName'].map(k => keyBy(columns, 'name')[k]),
        operationWidth: '155',
        operateButtonList: [
          {
            // label: '编辑',
            name: 'edit',
            type: 'text',
            icon: 'el-icon-edit-outline',
            textType: 'primary',
            tooltip: {
              content: '编辑',
              placement: 'top'
            },
            showabled: (row) => {
              return !row._isEditing
            },
            func: this.edit
          },
          {
            label: '取消编辑',
            name: 'cancelEdit',
            type: 'text',
            icon: 'gerenxinxi-yijianfankui',
            textType: 'primary',
            showabled: (row) => {
              return !!row._isEditing
            },
            func: (button, row) => {
              // console.log('取消编辑', row)
              // const oData = cloneDeep(row)
              row._isEditing = false
              this.$set(row, 'canvasTitle', row._oldData.canvasTitle)
            }
          },
          // {
          //   name: 'open',
          //   type: 'text',
          //   icon: 'el-'
          // },
          {
            // label: '删除',
            name: 'delete',
            icon: 'el-icon-delete-solid',
            type: 'text',
            textType: 'primary',
            tooltip: {
              content: '删除',
              placement: 'top'
            },
            func: this.delete
          },
          {
            // label: '复制配置',
            name: 'copy',
            type: 'text',
            icon: 'el-icon-document-copy',
            textType: 'primary',
            tooltip: {
              content: '复制',
              placement: 'top'
            },
            func: this.copy
          }
        ]
      },
      tableData: [],
      editingData: {},
      multiEditing: false
    }
  },
  watch: {},
  methods: {
    edit (button, row) {
      // this.editingData = row
      // this.$store.commit('canvas/edit', { name: row.canvasName || row.routerName, ...row })
      // 由于新增时候canvas中没有configId, 需要再次编辑的时候补充
      const config = row.config ? JSON.parse(row.config) : {}
      const nData = {
        ...row,
        config: {
          ...config,
          configId: config.configId || row.id
        },
        // 旧数据没有canvasName，只有routerName，此处做数据更正
        canvasName: row.canvasName || config.routerName
      }
      this.$emit('close', nData, this.multiEditing)
    },
    /* 批量编辑 */
    multEdit () {},
    editTitle (button, row) {
      this.$set(row, '_isEditing', true)
      this.$set(row, '_oldData', cloneDeep(row))
      this.editingData = row
      // this.$linkTo.billDetail({ detail: row.id })
    },
    formatEditParams () {
      const oData = this.editingData
      return {
        ...pick(this.editingData, ['canvasName', 'canvasTitle', 'config', 'id']),
        canvasName: oData.canvasName ? oData.canvasName : oData?._configObj?.routerName
      }
    },
    saveEdit (row) {
      const editingData = this.formatEditParams()
      // console.log('保存修改:', editingData)

      this.$normalRequire({
        url: this.$api.canvas.edit(row.id),
        method: 'post',
        data: editingData
      }).then(res => {
        if (res && res.code === 0) {
          // console.log('reponse:', res)
          this.$store.commit('canvas/assignConfig', {
            name: editingData.canvasName,
            assignObj: {
              // configId: editingData.id,
              routerName: editingData.canvasName,
              canvasTitle: editingData.canvasTitle
            }
          })
          this.$set(row, '_isEditing', false)
          this.$message.success('修改成功')
        }
      })
    },
    delete (button, row) {
      // this.$linkTo.billDetail({ detail: row.id })
      this.$normalRequire({
        url: this.$api.canvas.delete(row.id),
        method: 'post'
      }).then(res => {
        // console.log('reponse:', res)
        if (res && res.code === 0) {
          this.$message.success('删除成功')
          this.$nextTick(() => {
            this.$refs.table.getTableData()
          })
        }
      })
    },
    // saveDelete () {},
    copy (button, row) {
      if (row.config) {
        navigator.clipboard.writeText(row.config).then(() => {
          this.$message.success('复制配置成功')
        })
      }
    },
    renderRoutePath ({ row }) {
      // this.tableData = data
      const config = row.config ? JSON.parse(row.config) : {}
      // console.log(arguments)
      const { routerName, configId } = config
      const id = configId || row.id
      return routerName && id ? `/#/online/${routerName}/${id}` : ''
    }
  },
  mounted () { }
}
</script>

<style scoped lang='sass'>

</style>

<template lang='pug'>
.form-option-container
  //- ul.list-wrap
  //-   li(v-for="item in list",:key="item.value", :value="item.value") {{item.label}}
  .radio-list.m-b-8
    el-radio-group(v-model="optionType", fill="#57a8ce", @change="toggleOptionType")
      el-radio(v-for="radio in optionTypes", :key="radio.value", :label="radio.value", :disabled="radio.disabled") {{radio.label}}
  table.list-options(v-if="optionType === 'options'")
    thead
      tr
        th
        th 选项值(value)
        th 选项文本(label)
    Draggable(tag="tbody", :list="list", class="list-group", handle=".handle", animation="150")
      tr.drag-list(v-for="(item, index) in list")
        td
          i.el-icon-rank.handle
        td
          el-input(v-model="item.value")
        td
          el-input(v-model="item.label")
        td
          i.el-icon-minus.color-primary.btn-radius-50(:disabled="list.length===1",  @click="remove(item, index)")
        td
          i.el-icon-plus.color-primary.btn-radius-50(v-if="index === list.length - 1", @click="add")
  .list-async(v-if="optionType === 'optionsAsyncFunc'")
    //- 动态配置数据源
    el-button(@click="setAsyncVisible = !setAsyncVisible") {{ asyncFunc.url ? '重新选择数据源' : '配置数据源' }}
    .list-column__default.m-t-4(v-show="asyncFunc.url")
      .left-wrap
        .d-flex-v-center
          i.el-icon-check.color-primary.m-r-8
          .color-warning {{asyncFunc.method}}
          .secondary-text.m-l-8 {{asyncFunc.url}}
        .color-text-secondary.font-size-small.m-l-8 {{ asyncFunc.demo || ''}}
      .right-wrap
    RemoteSettingRequire(key="option", title="配置选项动态数据源", v-model="setAsyncVisible", :chosenData="asyncFunc",  @chosen="getAsyncSeting")
    //- 选择现有字典
  .list-async(v-if="optionType === 'optionRelationKey'")
    el-input(v-model.trim.lazy="optionRelationKey", placeholder="请填写字典关键名")
    //- el-select(v-model="value", placeholder="请选择字典")
    //-   el-option(v-for="item in options", :key="item.value", :label="item.label", :value="item.value")
</template>

<script>
import Draggable from 'vuedraggable'
import RemoteSettingRequire from '../RemoteSetting/Require'
/** 自定义选项配置
 * 遇到`xxxAsyncFunc`的命名，就使用异步请求方法，执行是在运行表单时候运行，即在业务方使用
 * 遇到`optionRelationKey`,则使用relation请求,在表单中如有勾选[首次加载字典], 则默认执行
 * TODO 配置disabled的方法
 */
export default {
  name: 'FormOption',
  props: {
    value: {
      type: Array,
      default: () => ([])
    },
    fullSetting: {
      type: Object,
      default: () => ({})
    },
    isGroup: {
      type: Boolean,
      default: false
    },
    isTree: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Draggable,
    RemoteSettingRequire
  },
  data () {
    return {
      optionType: this.fullSetting.optionType || 'options',
      optionTypes: [
        // 以取值命名value，方便数据同时存在options/optionsAsyncFunc后
        { label: '手动添加', value: 'options' },
        { label: '动态字典', value: 'optionRelationKey' },
        { label: '动态数据源', value: 'optionsAsyncFunc' },
        { label: '批量导入', value: 'optionsImport', disabled: true }
      ],
      setAsyncVisible: false,
      remoteType: 'asyncFunc'
      // asyncFunc: {}
      // list: []
      // list: Array.from({ length: 10 }, (el, i) => { return `文本_${i + 1}` })
    }
  },
  watch: {
    'fullSetting.optionType' (type) {
      this.optionType = type || this.optionTypes[0]
    }
  },
  computed: {
    list: {
      get () {
        return this.value || [{ label: '选项1', value: 1 }]
      },
      set (data) {
        this.$emit('input', data)
      }
    },
    asyncFunc: {
      get () {
        return this.fullSetting.optionsAsyncFunc || {}
      },
      set (data) {
        this.$emit('updateAnAttr', { name: 'optionsAsyncFunc', value: data })
      }
    },
    optionRelationKey: {
      get () {
        return this.fullSetting.optionsRelationKey || ''
      },
      set (data) {
        this.$emit('updateAnAttr', { name: 'optionsRelationKey', value: data })
      }
    }
  },
  methods: {
    getAsyncSeting (data) {
      this.asyncFunc = data
    },
    toggleOptionType (type) {
      this.$emit('updateAnAttr', { name: 'optionType', value: type })
    },
    add () {
      this.list.push({ label: '', value: '' })
    },
    remove (ele, index) {
      if (this.list.length) {
        this.$delete(this.list, index)
      }
    }
  }
}
</script>

<style lang='sass' scoped>
.list-options
  thead
    line-height: 1.2
  th
    color: $--color-text-regular
.drag-list
  i:hover
    transform: scale(1.2)
.handle
  float: left
  padding-top: 8px
  padding-bottom: 8px
  cursor: move

.btn-radius-50[disabled]
  background: #ddd
  color: $--color-text-placeholder !important
  pointer-events: none
</style>

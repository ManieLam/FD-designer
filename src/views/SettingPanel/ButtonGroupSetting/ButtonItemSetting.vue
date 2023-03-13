<template lang='pug'>
.button-item-setting
  AttrSettingForm.box-content__inside(
    v-if="attrs && attrs.length"
    v-bind="btn"
    v-on="$listeners"
    :key="`button_${btn.name}`"
    :value="btn"
    :attrs="attrs")
  CompActionSetting.m-t-8.box-content__inside(
    v-if="actions && actions.length"
    v-bind="$attrs"
    v-on="$listeners"
    :key="`button_action_${btn.name}`"
    :value="btn"
    :attrs="actions"
    @input="$emit('updateAction', $event)")
</template>

<script>
import AttrSettingForm from '@/components/AttrSettingForm'
import CompActionSetting from '../CompActionSetting'
export default {
  name: 'ButtonItemSetting',
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    /* 属性配置 { label,key,tag,group } */
    attrs: {
      type: Array,
      default: () => ([])
    },
    /* 操作事件配置 */
    actions: {
      type: Array,
      default: () => ([])
    }
  },
  components: {
    AttrSettingForm,
    CompActionSetting
  },
  data () {
    return {
    }
  },
  computed: {
    btn: {
      get () {
        return this.value
      },
      set (obj) {
        this.$emit('input', obj)
      }
    }
  },
  methods: {},
  mounted () {}
}
</script>

<style scoped lang=sass>

</style>

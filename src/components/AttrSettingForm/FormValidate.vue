<template lang='pug'>
.form-validate-container.box-content__inside
  .validate-list
    .validate-item
      el-checkbox(v-model="validType.isRequired") 不允许为空
      el-input(v-if="validType.isRequired", v-model="requireRule.message", placeholder="请输入")
        template(slot="prepend") 自定义错误信息
    .validate-item
      el-checkbox(v-model="validType.isRegexp") 正则判断
      form-list(v-if="validType.isRegexp", :columnProps="regexpProps", :draggable="false", v-model="regexpRule")
        template(v-slot:patternStr="scoped")
          //- regexpRule[scoped.index].patternStr
          el-input(:value="scoped.value", placeholder="输入表达式", clearable, @input="inputRegex($event, scoped)")
            el-select(slot="append", v-model="regexSelectVal", placeholder="请选择", filterable, @change="selectRegex($event, scoped)")
              el-option(v-for="regex in regexOptions", :key="`regex_${regex.name}`", :value="regex.name", :label="regex.label")
    .validate-item
      el-checkbox(v-model="validType.isValidator") 自定义规则
      CodeEditor(
        v-if="validType.isValidator"
        v-model="validatorRule"
        key="validator")
        pre.code-editor-desc__pre(slot="code-pre") (rule, value, callback) => {
        pre.code-editor-desc__suffix(slot="code-suffix") }
</template>

<script>
/** 表单校验 */
import { isEqual } from 'lodash'
import CodeEditor from '@/components/CodeEditor'
import regexOptions from '@/utils/regex.js'
export default {
  name: 'FormValidate',
  components: {
    CodeEditor
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    widget: {
      type: String
    }
  },
  data () {
    return {
      validType: {
        isRequired: false,
        isRegexp: false,
        isValidator: false
      },
      ruleDefined: {
        isRequired: {
          required: true,
          message: '必填'
        },
        isRegexp: { patternStr: '', message: '' },
        isValidator: 'callback();'
      },
      regexpProps: [
        { label: '正则', prop: 'patternStr', placeholder: '正则表达式' },
        { label: '错误信息', prop: 'message', placeholder: '错误信息提示' }
      ],
      // requireRule: this.value.isRequired,
      requireData: this.value.isRequired || {},
      regexpList: this.value.isRegexp || [],
      validatorFunc: this.value.isValidator || '',
      regexOptions: Object.values(regexOptions), // 正则选项
      regexSelectVal: null // 选择的正则选项
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (rules) {
        const { isRequired, isRegexp, isValidator } = rules
        this.validType.isRequired = !!isRequired
        this.validType.isRegexp = !!isRegexp
        this.validType.isValidator = !!isValidator
        this.requireRule = isRequired || this.ruleDefined.isRequired
        this.regexpRule = isRegexp || Array.from({ length: 1 }, () => this.ruleDefined.isRegexp)
        this.validatorRule = isValidator || this.ruleDefined.isValidator
      }
    },
    rules: {
      deep: true,
      handler (data, oldData) {
        if (!isEqual(data, oldData)) {
          this.$emit('updateAnAttr', { name: 'validate', value: data })
        }
      }
    }
  },
  computed: {
    requireRule: {
      get () {
        // return this.value.isRequired || this.ruleDefined.isRequired || {}
        return this.requireData
      },
      set (value) {
        this.requireData = value
        // this.$emit('update')
      }
    },
    regexpRule: {
      get () {
        return this.regexpList
      },
      set (value) {
        this.regexpList = value
      }
    },
    validatorRule: {
      get () {
        return this.validatorFunc
      },
      set (value) {
        this.validatorFunc = value
      }
    },
    rules () {
      const { isRequired, isRegexp, isValidator } = this.validType
      return {
        isRequired: isRequired ? this.requireRule : null,
        isRegexp: isRegexp ? this.regexpRule : null,
        isValidator: isValidator ? this.validatorRule : null
      }
    }
  },
  methods: {
    selectRegex (value, scoped) {
      const target = regexOptions[value]
      this.$set(scoped.data, 'message', `仅限${target?.label}`)
      this.$set(scoped.data, 'patternStr', String(target?.regex).replace(/\//g, ''))
    },
    inputRegex (value, scoped) {
      this.$set(this.regexpRule[scoped.index], 'patternStr', value)
      if (!value) {
        this.$set(this.regexpRule[scoped.index], 'message', '')
      }
    }
  }
}
</script>

<style lang='sass' scoped>

</style>

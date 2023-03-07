<script>
/** */
import Draggable from 'vuedraggable'
import { isEqual } from 'lodash'
import { formatField } from '@/utils/format.js'
export default {
  name: 'WidgetFormItem',
  props: [
    'value',
    'name',
    'index',
    // 'config',
    'compTag',
    'keyName',
    'scopedSlots',
    'selectItem'
  ],
  components: {
    Draggable
  },
  data () {
    return {
      assistType: {
        0: 'preSlotRender',
        2: 'suffixSlotRender'
      },
      configs: [],
      /* domList: [{dom: <string>tag标签, comKey: <string> key}] */
      domList: Array.from({ length: 3 }) // 存放插槽（辅助信息录入）和主录入组件的dom列表
    }
  },
  computed: {
    currentConfig: {
      get () {
        return this.value
      },
      set (config) {
        this.$emit('input', config)
      }
    },
    domLen () {
      return this.domList.filter(e => !!e).length
    }
  },
  watch: {
    currentConfig: {
      immediate: true,
      handler (conf, oldConf) {
        if (conf.compTag || !isEqual(conf, oldConf)) {
          if (conf.compTag) this.$set(this.domList, 1, { dom: conf.compTag, comKey: conf.key }) // 多出个[0]: undefined
          // this.$set(this.configs, 1, conf)
          Object.entries(this.assistType).reduce((arrRes, [index, assist]) => {
            // 存在某个辅助插槽，按位补组件
            arrRes[index] = Object.hasOwn(conf, assist) ? { dom: conf[assist]?.compTag, comKey: conf[assist]?.key } : null
            return arrRes
          }, this.domList)

          // console.log('doms:', this.domList)
        }
      }
    }
  },
  methods: {
    dragAdd (evt) {
      const tag = evt.clone?.dataset?.name
      const newIndex = evt.newIndex === 1 ? evt.newIndex + 1 : evt.newIndex // 保证位置只有0，2
      // console.log('拖了 新增', newIndex, this.domList.length)

      if (tag && this.domList.length === 3) {
        // 前后位置暂时各1个, 暂不支持替换主组件
        // console.log('to位置：', newIndex, tag, this.domList.length)

        const conf = formatField.call(this, { tag })
        const assistName = this.assistType[newIndex]
        // console.log('转换后的conf:', assistName)
        // this.$set(this.configs, newIndex, conf)
        this.$set(this.currentConfig, assistName, conf)
        this.$nextTick(() => this.clickItem(null, tag, newIndex))
      }
    },
    /* 通过改变currentConfig，删除对应的domList */
    removeItem (colIndex, conf) {
      // console.log('删除插槽元素', colIndex)
      if (this.domLen > 1 && conf.key !== this.name) {
        const newIndex = colIndex === 1 ? colIndex + 1 : colIndex // 保证位置只有0，2
        // 删除对应的辅助插槽组件
        // console.log('删除的下标：', newIndex)
        this.$delete(this.currentConfig, this.assistType[newIndex])
      } else {
        // 删除主组件
        this.$emit('remove', this.currentConfig, this.index)
      }
    },
    // 选择
    clickItem (e, tag, index) {
      if (e) e.stopPropagation()
      console.log('clickItem', tag)
      if (this.domLen > 1) {
        if (index === 1) {
          this.$emit('onSelect', { type: 'component', data: this.currentConfig })
        } else {
          // 切换tab， data还是主录入组件的配置数据
          this.$emit('onSelect', { type: 'assist', data: this.currentConfig, assist: this.assistType[index] })
        }
      } else {
        this.$emit('onSelect', { type: 'component', data: this.currentConfig })
      }
    },
    onDragMove (e, originalEvent) {
      console.log('onDragMove:', e, originalEvent)
    }
  },
  render (h) {
    const { label, name, key } = this.currentConfig || {}
    // 前后缀暂时只支持各1位
    // const domList = [preSlotRender, this.scopedSlots[name] || this.compTag, suffixSlotRender]
    return (
      <el-form-item
        ref={`formitem_${name}`}
        id={`${this.keyName}-formitem-${name}`}
        props={this.$attrs.formItemProp}
        on={this.$listeners}
        class={this.currentConfig.tag === 'text' ? 'el-form-item-text' : ''}
        label={label}
        prop={this.name}
        label-hidden={this.currentConfig.labelHidden}
        label-width={this.currentConfig.labelWidth ? this.currentConfig.labelWidth : ''}
        is-toptiperror={this.currentConfig.errorToptip}
      >
        <template slot="label">
          <span>{label}</span>
          {this.currentConfig.labelTip
            ? (
              <el-popover
                placement="top-start"
                trigger="hover"
                width="200"
                content={this.currentConfig.labelTip}
                id={`${this.name}-labelTip`}>
                <i
                  slot="reference"
                  style="padding-left: 4px;cursor: pointer"
                  class="el-icon-warning-outline"></i>
              </el-popover>
            )
            : ''}
        </template>
        <Draggable
          class="list-group drag-page-container"
          value={this.domList}
          group="form"
          animation="150"
          onAdd={this.dragAdd}
          move={this.onDragMove}>
          <transition-group
            name="fade"
            tag="div"
            class="form-item-drag">

            {
              this.domList
                .filter(e => !!e)
                .map(({ dom: hdom, comKey }, hindex) => {
                  const isAssist = comKey !== key
                  const aIndex = isAssist && hindex === 1 ? hindex + 1 : hindex
                  const config = isAssist ? this.currentConfig[this.assistType[aIndex]] : this.currentConfig

                  return <div
                    key={comKey}
                    is-slot={ isAssist }
                    class={[
                      { 'is-active': config && this.selectItem === comKey },
                      'form-item-inside',
                      'position-relative'
                    ]}
                    onClick={(e) => this.clickItem(e, hdom, hindex)}>
                    {
                      hdom && typeof hdom === 'function'
                        ? hdom(h, { field: config })
                        : h(hdom, {
                          class: 'form-item_component',
                          props: {
                            field: config,
                            ...config
                          },
                          attrs: {
                            ...config,
                            id: this.name
                          },
                          on: {
                            ...this.$listeners
                          }
                        })
                    }
                    {
                      this.domLen > 1 ? <div class="tool-wrap">
                        <i class="cursor-pointer el-icon-delete" onClick={() => this.removeItem(hindex, config)}></i>
                      </div> : null
                    }
                  </div>
                })

            }
          </transition-group>
        </Draggable>
      </el-form-item>
    )
  }
}
</script>

<style lang='sass' scoped>
.form-item-drag
  display: flex
  align-items: center
  // width: 100%
  justify-content: flex-start
.form-item-inside
  flex: 1 1 auto
  border: 1px dashed transparent
  position: relative
  padding: 2px
  > .form-item_component
    width: 100%
  &[is-slot=true]
    width: fit-content !important
    flex-grow: 0
    // flex: 0
    // padding-top: 4px
  &.is-active
    border: 1px dashed #0A4078 !important
    background: rgb(87, 168, 206, 0.2)
  &:hover
    border: 1px dashed #0A4078 !important
    background: rgb(87, 168, 206, 0.2)
    &::after
      content: ''
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 100%
      background: rgba(87, 168, 206, 0.2)
    .tool-wrap
      display: inline-block
      color: #0A4078

.tool-wrap
  position: absolute
  right: 0
  bottom: 0
  z-index: 2
  display: none
  background: rgba(255,255,255,0.8)
  padding: 2px
</style>

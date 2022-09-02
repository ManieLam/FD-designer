<template lang='pug'>
draggable(
  v-model="rows"
  group="p"
  class="list-group")
  div.list-group-item(v-for="item in rows",:key="item.id") {{item.name}}
</template>

<script>
/** 拖拽的面板页面 */
import draggable from 'vuedraggable'
export default {
  name: 'DragPage',
  components: {
    draggable
  },
  data () {
    return {
      rows: [
        { name: 'Jesus', id: 1 },
        { name: 'Paul', id: 2 },
        { name: 'Peter', id: 3 }
      ]
    }
  }
}
</script>

<style lang='sass' scoped>

</style>

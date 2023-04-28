<template lang="pug">
.app#app
  router-view
</template>

<script>
import AppDesigner from './Designer'
export default {
  components: {
    AppDesigner
  },
  data () {
    return {

    }
  },
  methods: {
    export () {},
    globalSetting () {}
  }
}
</script>

<style lang="sass">
#app
  font-family: Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  // text-align: center
  color: #2c3e50
  .app-header
    color: #2c3e50
    background-image: url('~@/assets/imgs/cool-background.png')
    background-size: cover
    background-position: 80% 70%
    padding: $--padding-primary
    display: flex
    justify-content: space-between
    align-items: center
    font-weight: bold
</style>
